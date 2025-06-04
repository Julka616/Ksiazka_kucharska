// src/pages/RecipeDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipe(res.data);
      } catch (err) {
        console.error("Błąd pobierania przepisu:", err);
      }
    };

    fetchRecipe();
  }, [id, token]);

  if (!recipe) return <p>Ładowanie...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{recipe.title}</h2>

      {recipe.calories && (
        <p><strong>Kalorie:</strong> {recipe.calories} kcal</p>
      )}

      {recipe.servings && (
        <p><strong>Liczba porcji:</strong> {recipe.servings}</p>
      )}

      <p><strong>Składniki:</strong></p>
      <ul>
        {recipe.ingredients.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <p><strong>Instrukcje:</strong></p>
      <p>{recipe.instructions}</p>

      <button onClick={() => navigate(-1)}> Wróć</button>
    </div>
  );
};

export default RecipeDetails;
