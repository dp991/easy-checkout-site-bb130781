-- Create user profiles table
CREATE TABLE public.wh_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email VARCHAR NOT NULL,
  nickname VARCHAR,
  phone VARCHAR,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wh_users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.wh_users
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.wh_users
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.wh_users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.wh_users
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Create cart items table
CREATE TABLE public.wh_cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.wh_products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.wh_cart_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own cart
CREATE POLICY "Users can view own cart"
ON public.wh_cart_items
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can add to their own cart
CREATE POLICY "Users can add to own cart"
ON public.wh_cart_items
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart
CREATE POLICY "Users can update own cart"
ON public.wh_cart_items
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete from their own cart
CREATE POLICY "Users can delete from own cart"
ON public.wh_cart_items
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger for updating updated_at
CREATE TRIGGER update_wh_users_updated_at
BEFORE UPDATE ON public.wh_users
FOR EACH ROW
EXECUTE FUNCTION public.update_wh_products_updated_at();

CREATE TRIGGER update_wh_cart_items_updated_at
BEFORE UPDATE ON public.wh_cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_wh_products_updated_at();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.wh_users (user_id, email, nickname)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'nickname');
  RETURN new;
END;
$$;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();