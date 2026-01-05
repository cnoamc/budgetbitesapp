-- Create custom_recipes table for user-created recipes
CREATE TABLE public.custom_recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '🍽️',
  ingredients TEXT[] DEFAULT '{}',
  steps TEXT[] DEFAULT '{}',
  prep_time INTEGER DEFAULT 30,
  home_cost INTEGER DEFAULT 30,
  delivery_cost INTEGER DEFAULT 60,
  category TEXT DEFAULT 'easy',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.custom_recipes ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own custom recipes" 
ON public.custom_recipes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own custom recipes" 
ON public.custom_recipes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom recipes" 
ON public.custom_recipes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom recipes" 
ON public.custom_recipes 
FOR DELETE 
USING (auth.uid() = user_id);