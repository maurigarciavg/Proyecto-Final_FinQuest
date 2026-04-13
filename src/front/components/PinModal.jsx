import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const PinModal = ({ profile, onClose }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();

  const handleSubmit = () => {
    if (!pin || pin.length !== 4) {
      setError("El PIN debe tener 4 dígitos");
      return;
    }

    const correctPin = profile.role === "parent" ? profile.parentalPIN : profile.pin;

    // Convertimos ambos a String para asegurar la comparación
    if (String(pin) === String(correctPin)) {
      setError("");

      if (profile.role === "parent") {
        navigate("/parentadmin");
      } else if (profile.role === "child") {

        dispatch({ type: "set_child", payload: profile });
        navigate(`/child-dashboard/${profile.id}`);
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
          onChange={(e) => {
            setPin(e.target.value);
            setError("");
          }}
          placeholder="••••"
        />

        {error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>
            {error}
          </p>
        )}

        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleSubmit}>Entrar</button>
          <button onClick={onClose} style={{ marginLeft: "1rem" }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const ProfileCard = ({ name, avatar, onClick }) => {
  return (
    <div className="profile-card" onClick={onClick}>
      <img src={avatar} alt={name} />
      <p>{name}</p>
    </div>
  );
};