import React from "react";

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const contentStyle = {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 8,
  maxWidth: 500,
  width: "90%",
  maxHeight: "80vh",
  overflowY: "auto",
};

const redText = {
  color: "red",
  marginTop: "1rem",
};

const RecipeDetailsModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <h2>{recipe.title}</h2>

        <h4>Składniki:</h4>
        <ul>
          {recipe.ingredients && recipe.ingredients.map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>

        <h4>Instrukcje:</h4>
        <p>{recipe.instructions}</p>

        <div style={redText}>
          {recipe.servings && (
            <p><strong>Liczba porcji:</strong> {recipe.servings}</p>
          )}
          {recipe.calories && (
            <p><strong>Kalorie:</strong> {recipe.calories} kcal</p>
          )}
        </div>

        <button onClick={onClose} style={{ marginTop: 20 }}>
          Zamknij
        </button>
      </div>
    </div>
  );
};

export default RecipeDetailsModal;
