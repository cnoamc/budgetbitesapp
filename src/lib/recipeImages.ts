// Recipe images mapping
import hamburgerImg from '@/assets/recipes/hamburger.jpg';
import pastaTomatoImg from '@/assets/recipes/pasta-tomato.jpg';
import shakshukaImg from '@/assets/recipes/shakshuka.jpg';
import omeletteImg from '@/assets/recipes/omelette.jpg';
import riceChickenImg from '@/assets/recipes/rice-chicken.jpg';
import toastCheeseImg from '@/assets/recipes/toast-cheese.jpg';
import tortillaImg from '@/assets/recipes/tortilla.jpg';
import friedRiceImg from '@/assets/recipes/fried-rice.jpg';
import proteinSaladImg from '@/assets/recipes/protein-salad.jpg';
import panPizzaImg from '@/assets/recipes/pan-pizza.jpg';
import toastAvocadoImg from '@/assets/recipes/toast-avocado.jpg';
import noodlesImg from '@/assets/recipes/noodles.jpg';
import vegetableStirFryImg from '@/assets/recipes/vegetable-stir-fry.jpg';
import hummusPlateImg from '@/assets/recipes/hummus-plate.jpg';
import falafelImg from '@/assets/recipes/falafel.jpg';
import sabichImg from '@/assets/recipes/sabich.jpg';
import majadaraImg from '@/assets/recipes/majadara.jpg';
import schnitzelImg from '@/assets/recipes/schnitzel.jpg';
import israeliSaladImg from '@/assets/recipes/israeli-salad.jpg';
import couscousImg from '@/assets/recipes/couscous.jpg';
import shawarmaImg from '@/assets/recipes/shawarma.jpg';
import chickenSoupImg from '@/assets/recipes/chicken-soup.jpg';
import burekasImg from '@/assets/recipes/burekas.jpg';
import malawachImg from '@/assets/recipes/malawach.jpg';
import ptitimImg from '@/assets/recipes/ptitim.jpg';
import shakshukaGreenImg from '@/assets/recipes/shakshuka-green.jpg';
import matbuchaImg from '@/assets/recipes/matbucha.jpg';
import tehinaSaladImg from '@/assets/recipes/tehina-salad.jpg';

export const recipeImages: Record<string, string> = {
  'hamburger': hamburgerImg,
  'pasta-tomato': pastaTomatoImg,
  'shakshuka': shakshukaImg,
  'omelette': omeletteImg,
  'rice-chicken': riceChickenImg,
  'toast-cheese': toastCheeseImg,
  'tortilla': tortillaImg,
  'fried-rice': friedRiceImg,
  'protein-salad': proteinSaladImg,
  'pan-pizza': panPizzaImg,
  'toast-avocado': toastAvocadoImg,
  'noodles': noodlesImg,
  'vegetable-stir-fry': vegetableStirFryImg,
  'hummus-plate': hummusPlateImg,
  'falafel': falafelImg,
  'sabich': sabichImg,
  'majadara': majadaraImg,
  'schnitzel': schnitzelImg,
  'israeli-salad': israeliSaladImg,
  'couscous': couscousImg,
  'shawarma': shawarmaImg,
  'chicken-soup': chickenSoupImg,
  'burekas': burekasImg,
  'malawach': malawachImg,
  'ptitim': ptitimImg,
  'shakshuka-green': shakshukaGreenImg,
  'matbucha': matbuchaImg,
  'tehina-salad': tehinaSaladImg,
};

export const getRecipeImage = (recipeId: string): string | undefined => {
  return recipeImages[recipeId];
};
