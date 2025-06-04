import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const categories = ["Zupy", "Desery", "Dania główne", "Napoje"];

const AddRecipe = () => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [calories, setCalories] = useState(""); 
  const [servings, setServings] = useState(""); 
  const [category, setCategory] = useState(categories[0]); 

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ingredientsArray = ingredients
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    try {
      await axios.post(
        "http://localhost:5000/api/recipes",
        {
          title,
          ingredients: ingredientsArray,
          instructions,
          category, 
          
          calories: calories ? Number(calories) : undefined,
          servings: servings ? Number(servings) : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Przepis został dodany pomyślnie!"); 
      navigate("/dashboard");
    } catch (err) {
      console.error("Błąd dodawania przepisu:", err);
      alert("Nie udało się dodać przepisu: " + (err.response?.data?.msg || err.message || "Sprawdź konsolę."));
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          alignSelf: "flex-start",
          marginBottom: "10px",
          padding: "6px 12px",
          fontSize: "0.9em",
          backgroundColor: "transparent",
          color: "#28a745",
          border: "1px solid #28a745",
          borderRadius: "999px",
          cursor: "pointer",
        }}
      >
        Wróć do przepisów
      </button>

      <h2 style={{ marginBottom: 20, textAlign: "center" }}>➕ Dodaj nowy przepis</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <input
          type="text"
          placeholder="Tytuł przepisu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Składniki (oddziel przecinkami)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
          rows={3}
          style={inputStyle}
        />
        <textarea
          placeholder="Instrukcje"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
          rows={5}
          style={inputStyle}
        />
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={inputStyle}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Kalorie (kcal)"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          min="0"
          
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Liczba porcji"
          value={servings}
          onChange={(e) => setServings(e.target.value)}
          min="1"
    
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Dodaj przepis
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: "10px",
  fontSize: "1em",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
  resize: "vertical",
};

const buttonStyle = {
  padding: "8px 14px",
  fontSize: "0.95em",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "999px",
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  transition: "background-color 0.2s ease",
};

export default AddRecipe;