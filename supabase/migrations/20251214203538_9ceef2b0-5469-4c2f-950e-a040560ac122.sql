-- Create profiles table to store user data from onboarding
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  monthly_spending INTEGER DEFAULT 0,
  weekly_orders INTEGER DEFAULT 0,
  preferred_food TEXT[] DEFAULT '{}',
  country TEXT DEFAULT 'IL',
  cooking_skill INTEGER DEFAULT 1,
  onboarding_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create cooked_meals table to track user progress
CREATE TABLE public.cooked_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id TEXT NOT NULL,
  taste_rating INTEGER NOT NULL CHECK (taste_rating >= 1 AND taste_rating <= 5),
  difficulty_rating INTEGER NOT NULL CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  would_make_again BOOLEAN DEFAULT false,
  savings INTEGER DEFAULT 0,
  cooked_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooked_meals ENABLE ROW LEVEL SECURITY;

-- Profiles policies - users can only access their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Cooked meals policies - users can only access their own meals
CREATE POLICY "Users can view their own cooked meals"
ON public.cooked_meals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cooked meals"
ON public.cooked_meals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cooked meals"
ON public.cooked_meals FOR DELETE
USING (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Create trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profile timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();