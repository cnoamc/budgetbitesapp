-- Add enhanced recipe memory fields to custom_recipes table
ALTER TABLE public.custom_recipes 
ADD COLUMN IF NOT EXISTS servings integer DEFAULT 2,
ADD COLUMN IF NOT EXISTS difficulty text DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS tips text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS substitutions jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS doneness_checks text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS chef_notes text,
ADD COLUMN IF NOT EXISTS common_questions jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS recipe_memory_json jsonb,
ADD COLUMN IF NOT EXISTS recipe_summary text,
ADD COLUMN IF NOT EXISTS explanation_text text;

-- Add constraint for difficulty values
ALTER TABLE public.custom_recipes 
DROP CONSTRAINT IF EXISTS custom_recipes_difficulty_check;

ALTER TABLE public.custom_recipes 
ADD CONSTRAINT custom_recipes_difficulty_check 
CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'));