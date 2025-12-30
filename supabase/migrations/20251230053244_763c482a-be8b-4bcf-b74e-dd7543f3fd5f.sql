-- Create page_views table for tracking analytics
CREATE TABLE public.wh_page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_page_views_created_at ON public.wh_page_views (created_at);
CREATE INDEX idx_page_views_visitor_id ON public.wh_page_views (visitor_id);
CREATE INDEX idx_page_views_session_id ON public.wh_page_views (session_id);
CREATE INDEX idx_page_views_page_path ON public.wh_page_views (page_path);

-- Enable RLS
ALTER TABLE public.wh_page_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert page views (for anonymous tracking)
CREATE POLICY "Anyone can insert page views"
ON public.wh_page_views
FOR INSERT
WITH CHECK (true);

-- Only admins can view page views
CREATE POLICY "Admins can view page views"
ON public.wh_page_views
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete page views
CREATE POLICY "Admins can delete page views"
ON public.wh_page_views
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));