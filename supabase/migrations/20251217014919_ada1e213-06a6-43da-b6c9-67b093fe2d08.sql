-- Add UPDATE policy for cooked_meals so users can edit their meal ratings
CREATE POLICY "Users can update their own cooked meals"
ON public.cooked_meals
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);