// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import { useNavigate } from "react-router-dom";

const categories = ["Wszystkie", "Zupy", "Desery", "Dania główne", "Napoje"];

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie");
  const [modalRecipe, setModalRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedRecipeId, setSelectedRecipeId] = useState(null); 
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const normalize = (text) => {
  if (typeof text !== "string") return "";
  return text.trim().toLowerCase();
};

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/recipes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userId = JSON.parse(atob(token.split(".")[1])).id;
        const userRecipes = res.data.filter((r) => r.createdBy._id === userId);

        console.log("Przepisy:", userRecipes);
        userRecipes.forEach((r) => console.log(`Kategoria: "${r.category}"`));

        setRecipes(userRecipes);
      } catch (err) {
        console.error(" Błąd pobierania przepisów:", err);
      }
    };

    if (token) {
      fetchRecipes();
    } else {
      navigate("/");
    }
  }, [token, navigate]);

  
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      selectedCategory === "Wszystkie" ||
      normalize(recipe.category) === normalize(selectedCategory);

    const matchesSearchTerm = normalize(recipe.title).includes(
      normalize(searchTerm)
    );

    return matchesCategory && matchesSearchTerm;
  });

  const handleDelete = (id) => {
    setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
    
    if (selectedRecipeId === id) {
      setSelectedRecipeId(null);
      setModalRecipe(null); 
    }
  };

  const openModal = (recipe) => {
    setModalRecipe(recipe);
    setSelectedRecipeId(recipe._id); 
  };

  const closeModal = () => {
    setModalRecipe(null);
    setSelectedRecipeId(null); 

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Twoje przepisy</h2>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          style={{
            padding: "6px 12px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Wyloguj
        </button>
      </div>

      
      <div
        style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSearchTerm(""); 
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border:
                selectedCategory === cat
                  ? "2px solid #28a745"
                  : "1px solid #ccc",
              backgroundColor: selectedCategory === cat ? "#e6ffe6" : "white",
              cursor: "pointer",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Wyszukaj przepis po nazwie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "1em",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <button
        onClick={() => navigate("/add")}
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Dodaj nowy przepis
      </button>

      {filteredRecipes.length === 0 ? ( 
        <p>Nie masz jeszcze żadnych przepisów w tej kategorii lub pasujących do wyszukiwania.</p>
      ) : (
        filteredRecipes.map((recipe) => ( 
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            onDelete={handleDelete}
            openModal={openModal}
            isSelected={selectedRecipeId === recipe._id} 
          />
        ))
      )}

      {modalRecipe && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <button style={modalCloseButtonStyle} onClick={closeModal}>
              ✖
            </button>
            <h2>{modalRecipe.title}</h2>
            {modalRecipe.calories !== undefined &&
              modalRecipe.calories !== null && (
                <p>
                  <strong>Kalorie:</strong> {modalRecipe.calories} kcal
                </p>
              )}
            {modalRecipe.servings !== undefined &&
              modalRecipe.servings !== null && (
                <p>
                  <strong>Liczba porcji:</strong> {modalRecipe.servings}
                </p>
              )}
            <strong>Składniki:</strong>
            <ul>
              {modalRecipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
            <strong>Instrukcje:</strong>
            <p style={{ whiteSpace: "pre-wrap" }}>{modalRecipe.instructions}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalContentStyle = {
  backgroundColor: "white",
  borderRadius: "10px",
  padding: "30px",
  maxWidth: "600px",
  width: "90%",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  position: "relative",
  maxHeight: "80vh",
  overflowY: "auto",
};

const modalCloseButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  border: "none",
  background: "transparent",
  fontSize: "1.2rem",
  cursor: "pointer",
 };
}
export default Dashboard;