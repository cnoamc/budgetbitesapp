-- Add display_name and photo_url columns to profiles table for cross-device sync
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT DEFAULT 'השף הביתי',
ADD COLUMN IF NOT EXISTS photo_url TEXT;