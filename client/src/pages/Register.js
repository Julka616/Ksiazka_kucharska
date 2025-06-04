import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { username: "", email: "", password: "" },
    validationSchema: Yup.object({
      username: Yup.string().required("Wymagane"),
      email: Yup.string().email("Nieprawidłowy email").required("Wymagane"),
      password: Yup.string().min(6, "Minimum 6 znaków").required("Wymagane"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post("http://localhost:5000/api/auth/register", values);
        alert("Zarejestrowano pomyślnie!");
        navigate("/");
      } catch (error) {
        alert("Błąd rejestracji");
      }
    },
  });

  return (
    <div style={styles.container}>
      <form onSubmit={formik.handleSubmit} style={styles.form}>
        <h2 style={{ marginBottom: 20, textAlign: "center" }}>Zarejestruj się</h2>

        <input
          style={styles.input}
          name="username"
          placeholder="Nazwa użytkownika"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        {formik.errors.username && <div style={styles.error}>{formik.errors.username}</div>}

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

        <button type="submit" style={styles.button}>Zarejestruj się</button>

        <p style={{ marginTop: 15, textAlign: "center" }}>
          Masz już konto? <Link to="/">Zaloguj się</Link>
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

export default Register;
