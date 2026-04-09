import { useState } from "react";
import "../Login.css";

// 👇 IMPORTS CORRECTOS
import beaverImg from "../assets/img/cashtor_coins.png";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  console.log("Hola");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    const rawUrl = import.meta.env.VITE_BACKEND_URL || "";
    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Credenciales incorrectas");
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/profile-selection";
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el backend");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="login-container">

      {/* Card izquierda */}
      <div className="login-card">
        <h3 className="login-title">¡Bienvenido de nuevo!</h3>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            placeholder="Usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="login-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Iniciando..." : "Iniciar sesión"}
          </button>

          {error && <p className="login-error">{error}</p>}

          <p className="login-signup">
            ¿No tienes cuenta? <br /> <a href="/signup">Regístrate</a>
          </p>
        </form>
      </div>

      {/* Imagen derecha */}
      <div className="login-image">
        <img src={beaverImg} alt="Cashtor" />
      </div>
    </div>
  );
};