import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const PinModal = ({ profile, onClose }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();

  const correctPin =
    profile.role === "parent" ? profile.parentalPIN : profile.pin;

  const triggerError = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleSubmit = () => {
    if (!pin || pin.length !== 4) {
      triggerError("El PIN debe tener 4 dígitos");
      return;
    }

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
      triggerError("PIN incorrecto, intenta de nuevo");
    }
  };

  return ReactDOM.createPortal(
    <div className="modal" onClick={onClose}>
      <div
        className={`modal-content ${shake ? "shake" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Ingresa el PIN de {profile.name}</h2>

        {/* 🔥 SOLO ESTE CAMBIO (FORM) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
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
            <button type="submit">Entrar</button>
            <button type="button" onClick={onClose} style={{ marginLeft: "1rem" }}>
              Cerrar
            </button>
          </div>
        </form>

      </div>
    </div>,
    document.body
  );
};