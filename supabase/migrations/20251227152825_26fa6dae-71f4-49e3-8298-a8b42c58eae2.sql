-- 创建管理员角色枚举
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

-- 用户角色表
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- 启用 RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 角色检查函数（安全定义器）
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 用户角色表策略 - 只有管理员可以查看角色
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 管理员可以管理分类
CREATE POLICY "Admins can insert categories"
ON public.wh_categories FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories"
ON public.wh_categories FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories"
ON public.wh_categories FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 管理员可以管理产品
CREATE POLICY "Admins can insert products"
ON public.wh_products FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON public.wh_products FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON public.wh_products FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 管理员可以查看和更新询盘
CREATE POLICY "Admins can view inquiries"
ON public.wh_inquiries FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update inquiries"
ON public.wh_inquiries FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete inquiries"
ON public.wh_inquiries FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 管理员可以管理网站设置
CREATE POLICY "Admins can insert settings"
ON public.wh_site_settings FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
ON public.wh_site_settings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete settings"
ON public.wh_site_settings FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));