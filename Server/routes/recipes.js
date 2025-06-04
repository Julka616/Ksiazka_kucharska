const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const auth = require("../middleware/auth");

// Dodaj nowy przepis
router.post("/", auth, async (req, res) => {
const { title, ingredients, instructions, category, calories, servings } = req.body;
  try {
    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      category,   
      calories,    
      servings,     
      createdBy: req.user.id,
    });
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ msg: "Błąd serwera" });
  }
});

// Pobierz wszystkie przepisy
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("createdBy", "username");
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ msg: "Błąd serwera" });
  }
});

// Pobierz jeden przepis
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("createdBy", "username");
    if (!recipe) return res.status(404).json({ msg: "Nie znaleziono przepisu" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ msg: "Błąd serwera" });
  }
});

// Edytuj przepis
router.put("/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: "Nie znaleziono przepisu" });
    if (recipe.createdBy.toString() !== req.user.id)
      return res.status(401).json({ msg: "Brak uprawnień" });

const { title, ingredients, instructions, category, calories, servings } = req.body;
    recipe.title = title;
    recipe.ingredients = ingredients;
    recipe.instructions = instructions;
    recipe.category = category;
    recipe.calories = calories;     
    recipe.servings = servings; 
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ msg: "Błąd serwera" });
  }
});

// Usuń przepis
router.delete("/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: "Nie znaleziono przepisu" });
    if (recipe.createdBy.toString() !== req.user.id) return res.status(401).json({ msg: "Brak uprawnień" });

    await recipe.deleteOne();
    res.json({ msg: "Przepis usunięty" });
  } catch (err) {
    res.status(500).json({ msg: "Błąd serwera" });
  }
});

module.exports = router;
