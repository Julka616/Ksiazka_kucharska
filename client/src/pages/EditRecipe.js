// src/pages/EditRecipe.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const categories = ["Zupy", "Desery", "Dania główne", "Napoje"];

const EditRecipe = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    category: categories[0],
    calories: "",
    servings: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const r = res.data;
        setForm({
          title: r.title || "",
          ingredients: r.ingredients ? r.ingredients.join(", ") : "",
          instructions: r.instructions || "",
          category: r.category || categories[0],
          calories: r.calories !== undefined ? r.calories.toString() : "",
          servings: r.servings !== undefined ? r.servings.toString() : "",
        });
        setError(null);
      } catch (err) {
        console.error(" Błąd pobierania przepisu:", err);
        setError("Nie udało się załadować przepisu.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ingredientsArray = form.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      await axios.put(
        `http://localhost:5000/api/recipes/${id}`,
        {
          title: form.title,
          ingredients: ingredientsArray,
          instructions: form.instructions,
          category: form.category,
          calories: form.calories ? parseInt(form.calories, 10) : undefined,
          servings: form.servings ? parseInt(form.servings, 10) : undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Przepis został zaktualizowany!");
      navigate("/dashboard");
    } catch (err) {
      console.error(" Błąd edycji przepisu:", err.response?.data || err.message);
      alert("Nie udało się zaktualizować przepisu.");
    }
  };

  if (loading) return <p>Ładowanie przepisu...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      {/* DODANY PRZYCISK POWROTU */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          alignSelf: "flex-start",
          marginBottom: "10px", // Dodaj odstęp poniżej przycisku
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
      {/* KONIEC DODANEGO PRZYCISKU */}

      <h2 style={{ marginBottom: 20, textAlign: "center" }}>✏️ Edytuj przepis</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 15 }}
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Tytuł przepisu"
          required
          style={inputStyle}
        />
        <textarea
          name="ingredients"
          value={form.ingredients}
          onChange={handleChange}
          placeholder="Składniki (oddziel przecinkami)"
          required
          rows={3}
          style={inputStyle}
        />
        <textarea
          name="instructions"
          value={form.instructions}
          onChange={handleChange}
          placeholder="Instrukcje"
          required
          rows={5}
          style={inputStyle}
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {/* Nowe pola */}
        <input
          type="number"
          name="calories"
          value={form.calories}
          onChange={handleChange}
          placeholder="Kalorie (kcal)"
          min="0"
          style={inputStyle}
        />
        <input
          type="number"
          name="servings"
          value={form.servings}
          onChange={handleChange}
          placeholder="Liczba porcji"
          min="1"
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Zapisz zmiany
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

export default EditRecipe;