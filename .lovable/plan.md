

# Add 50 Kosher Recipes

## Summary
Add 50 new kosher recipes to the existing recipe array in `src/lib/recipes.ts`. The "kosher" category (כשר ✡️) already exists in the app -- no schema or UI changes needed.

## What Already Exists
- Category "כשר" with emoji ✡️ is configured
- The kosher filter works in the Recipes page
- Only 3 recipes currently tagged as kosher (falafel, kosher sushi, kosher sashimi)

## What Will Be Done

### File: `src/lib/recipes.ts`
Add 50 new recipe objects to the `recipes` array. Each recipe will:
- Have `'kosher'` in its `category` array, plus other relevant categories (fast, cheap, meat, vegetarian, protein, etc.)
- Follow the existing `Recipe` interface (id, name, category, difficulty, prepTime, cookTime, homeCost, deliveryCost, emoji, image, ingredients, steps)
- Be written entirely in Hebrew (names, ingredients, steps)
- Be Israel-friendly, realistic, and simple
- Contain NO forbidden foods (no pork, shellfish, etc.) -- only kosher fish (salmon, tuna, etc.)
- Include tags for dairy/meat/pareve via category assignments (vegetarian = pareve/dairy context)

### Recipe Diversity (50 recipes)
- **Meat dishes (~15):** Chicken schnitzel kosher, lamb kebab, chicken shawarma, meatballs in sauce, stuffed peppers with meat, chicken stir-fry, beef stew, chicken drumsticks, turkey patties, chicken cutlets, cholent, Jerusalem mixed grill, chicken liver, ground beef pita, etc.
- **Fish dishes (~5):** Salmon fillet, tuna steak, fish cakes, baked tilapia, salmon patties
- **Vegetarian/Dairy (~10):** Cheese bourekas, shakshuka, mushroom pasta, vegetable quiche, cheese blintzes, pasta with cream sauce, eggplant parmesan, vegetable fritters, cheese toast, baked potato
- **Soups (~5):** Chicken soup with kneidlach, lentil soup, vegetable soup, tomato soup, bean soup
- **Salads (~5):** Israeli salad, quinoa salad, tabbouleh, couscous salad, beet salad
- **Rice/Pasta/Grains (~5):** Rice pilaf, couscous with vegetables, ptitim, pasta salad, bulgur
- **Desserts (~5):** Rugelach, honey cake, halva mousse, sufganiyot, apple crumble

### No Other Changes
- No UI modifications
- No schema changes
- No changes to other files (types, pages, etc.)

## Technical Details
- Each recipe follows the exact `Recipe` interface structure
- `image: ''` for all new recipes (consistent with existing pattern -- images are mapped separately in `recipeImages.ts`)
- IDs will be unique kebab-case strings prefixed with `kosher-` for clarity
- Difficulty range: 1-3
- Realistic Israeli cost estimates for homeCost and deliveryCost

