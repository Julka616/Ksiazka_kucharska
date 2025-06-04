
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RecipeCard = ({ recipe, onDelete, openModal, isSelected }) => { 
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    if (window.confirm("Czy na pewno chcesz usunąć ten przepis?")) {
      try {
        await axios.delete(`http://localhost:5000/api/recipes/${recipe._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onDelete(recipe._id);
        alert("Przepis usunięty pomyślnie!");
      } catch (err) {
        console.error("Błąd usuwania przepisu:", err);
        alert("Nie udało się usunąć przepisu.");
      }
    }
  };

  return (
    <div
      style={{
        border: isSelected ? "2px solid #28a745" : "1px solid #ddd", 
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "15px",
        backgroundColor: isSelected ? "#e6ffe6" : "#f9f9f9",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <h3 style={{ margin: "0", color: "#333" }}>{recipe.title}</h3>
      <p style={{ margin: "0", fontSize: "0.9em", color: "#666" }}>
        Kategoria: {recipe.category}
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => openModal(recipe)}
          style={{
            padding: "8px 12px",
            fontSize: "0.85em",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Zobacz szczegóły
        </button>
        <button
          onClick={() => navigate(`/edit/${recipe._id}`)}
          style={{
            padding: "8px 12px",
            fontSize: "0.85em",
            backgroundColor: "#ffc107",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Edytuj
        </button>
        <button
          onClick={handleDelete}
          style={{
            padding: "8px 12px",
            fontSize: "0.85em",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Usuń
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;