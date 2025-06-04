import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Nieprawidłowy email").required("Wymagane"),
      password: Yup.string().required("Wymagane"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/login", values);
        localStorage.setItem("token", res.data.token); 
        alert("Zalogowano pomyślnie!");
        navigate("/dashboard");
      } catch (error) {
        alert("Błąd logowania");
      }
    },
  });

  return (
    <div style={styles.container}>
      <form onSubmit={formik.handleSubmit} style={styles.form}>
        <h2 style={{ marginBottom: 20, textAlign: "center" }}>Zaloguj się</h2>

        <input
          style={styles.input}
          name="email"
          type="email"
          placeholder="Email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.errors.email && <div style={styles.error}>{formik.errors.email}</div>}

        <input
          style={styles.input}
          name="password"
          type="password"
          placeholder="Hasło"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.errors.password && <div style={styles.error}>{formik.errors.password}</div>}

        <button type="submit" style={styles.button}>Zaloguj się</button>

        <p style={{ marginTop: 15, textAlign: "center" }}>
          Nie masz konta? <Link to="/register">Zarejestruj się</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f7fa",
  },
  form: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: 320,
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  button: {
    padding: 12,
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 12,
    fontSize: 14,
  },
};

export default Login;
