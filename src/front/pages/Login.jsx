import { useState } from "react";
import "../Login.css"; // opcional: tu archivo de estilos

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://supreme-enigma-w4q77jgrqwv29q99-3001.app.github.dev/api/sign-in",
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

      // Guardar token y usuario en localStorage
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirigir (temporal) a siguiente paso
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
      <h2 className="login-title">¡Bienvenido de nuevo!</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="login-input"
          type="email"
          placeholder="Correo electrónico"
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
          ¿No tienes cuenta? <a href="/signup">Regístrate</a>
        </p>
      </form>
    </div>
  );
};