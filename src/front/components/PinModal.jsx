import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";

export const PinModal = ({ profile, onClose }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (pin === profile.pin) {
      setError("");
      // Redirección según rol
      if (profile.role === "parent") {
        navigate("/parentadmin");
      } else {
        navigate("/ChildDashboard");  // <-- ruta correcta para hijos
      }
      onClose();
    } else {
      setError("PIN incorrecto, intenta de nuevo");
    }
  };

  return ReactDOM.createPortal(
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Ingresa el PIN de {profile.name}</h2>
        <input
          type="password"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="••••"
        />
        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleSubmit}>Entrar</button>
          <button onClick={onClose} style={{ marginLeft: "1rem" }}>Cerrar</button>
        </div>
      </div>
    </div>,
    document.body
  );
};