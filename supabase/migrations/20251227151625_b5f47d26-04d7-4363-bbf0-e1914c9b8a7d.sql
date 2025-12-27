-- 产品分类表
CREATE TABLE public.wh_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_zh VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 分类表索引
CREATE INDEX idx_wh_categories_slug ON public.wh_categories(slug);
CREATE INDEX idx_wh_categories_sort ON public.wh_categories(sort_order);

-- 产品表
CREATE TABLE public.wh_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.wh_categories(id) ON DELETE SET NULL,
  name_zh VARCHAR(200) NOT NULL,
  name_en VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  min_order INT DEFAULT 1,
  specs JSONB DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  stock_status VARCHAR(20) DEFAULT 'in_stock',
  sort_order INT DEFAULT 0,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 产品表索引
CREATE INDEX idx_wh_products_cat_id ON public.wh_products(category_id);
CREATE INDEX idx_wh_products_slug ON public.wh_products(slug);
CREATE INDEX idx_wh_products_featured ON public.wh_products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_wh_products_sort ON public.wh_products(sort_order);

-- 网站设置表
CREATE TABLE public.wh_site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB,
  description VARCHAR(200),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 询盘表
CREATE TABLE public.wh_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.wh_products(id) ON DELETE SET NULL,
  customer_name VARCHAR(100),
  customer_email VARCHAR(100),
  customer_phone VARCHAR(50),
  customer_company VARCHAR(200),
  customer_im VARCHAR(100),
  message TEXT,
  source VARCHAR(50) DEFAULT 'web',
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 询盘表索引
CREATE INDEX idx_wh_inquiries_status ON public.wh_inquiries(status);
CREATE INDEX idx_wh_inquiries_created ON public.wh_inquiries(created_at);

-- 启用 RLS
ALTER TABLE public.wh_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wh_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wh_site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wh_inquiries ENABLE ROW LEVEL SECURITY;

-- 公开读取分类和产品（展示型网站）
CREATE POLICY "Categories are publicly readable" 
ON public.wh_categories FOR SELECT 
USING (true);

CREATE POLICY "Products are publicly readable" 
ON public.wh_products FOR SELECT 
USING (true);

CREATE POLICY "Site settings are publicly readable" 
ON public.wh_site_settings FOR SELECT 
USING (true);

-- 询盘可以公开插入（访客提交询盘）
CREATE POLICY "Anyone can create inquiries" 
ON public.wh_inquiries FOR INSERT 
WITH CHECK (true);

-- 更新产品时间戳的触发器
CREATE OR REPLACE FUNCTION public.update_wh_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_wh_products_updated_at
  BEFORE UPDATE ON public.wh_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_wh_products_updated_at();

-- 更新设置时间戳的触发器
CREATE OR REPLACE FUNCTION public.update_wh_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_wh_site_settings_updated_at
  BEFORE UPDATE ON public.wh_site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_wh_site_settings_updated_at();