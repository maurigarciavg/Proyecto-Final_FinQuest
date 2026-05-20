import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiRequest, authHeaders } from "../services/api";
import childAvatar1 from "../assets/img/Profiles/Children/child_1.png";
import childAvatar2 from "../assets/img/Profiles/Children/child_2.png";
import childAvatar3 from "../assets/img/Profiles/Children/child_3.png";
import childAvatar4 from "../assets/img/Profiles/Children/child_4.png";
import childAvatar5 from "../assets/img/Profiles/Children/child_5.png";
import childAvatar6 from "../assets/img/Profiles/Children/child_6.png";
import childAvatar7 from "../assets/img/Profiles/Children/child_7.png";
import childAvatar8 from "../assets/img/Profiles/Children/child_8.png";
import childAvatar9 from "../assets/img/Profiles/Children/child_9.png";
import childAvatar10 from "../assets/img/Profiles/Children/child_10.png";
import childAvatar11 from "../assets/img/Profiles/Children/child_11.png";
import childAvatar12 from "../assets/img/Profiles/Children/child_12.png";
import "../styles/Account.css";

const childAvatars = [
  { id: "child_1", src: childAvatar1 },
  { id: "child_2", src: childAvatar2 },
  { id: "child_3", src: childAvatar3 },
  { id: "child_4", src: childAvatar4 },
  { id: "child_5", src: childAvatar5 },
  { id: "child_6", src: childAvatar6 },
  { id: "child_7", src: childAvatar7 },
  { id: "child_8", src: childAvatar8 },
  { id: "child_9", src: childAvatar9 },
  { id: "child_10", src: childAvatar10 },
  { id: "child_11", src: childAvatar11 },
  { id: "child_12", src: childAvatar12 }
];

export const ChildAccount = () => {
  const { childId } = useParams();
  const { store } = useGlobalReducer();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(childAvatars[0].src);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadChild = async () => {
      if (!store.token || !childId) return;
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest(`api/child/${childId}`, {
          headers: authHeaders(store.token)
        });
        setChild(data.child);
        setSelectedAvatar(data.child.avatar || childAvatars[0].src);
      } catch (err) {
        setError(err.message || "No se pudo cargar el perfil del niño.");
      } finally {
        setLoading(false);
      }
    };

    loadChild();
  }, [store.token, childId]);

  const handleSave = async () => {
    if (!store.token || !childId) return;
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const data = await apiRequest(`api/child/${childId}`, {
        method: "PATCH",
        headers: authHeaders(store.token),
        body: JSON.stringify({ avatar: selectedAvatar })
      });

      setChild(data.child);
      setMessage("Avatar guardado correctamente.");
    } catch (err) {
      setError(err.message || "No se pudo guardar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="account-page">Cargando perfil...</div>;
  }

  if (!child) {
    return <div className="account-page">Perfil no encontrado.</div>;
  }

  return (
    <section className="account-page">
      <div className="account-heading">
        <div>
          <p className="eyebrow">Perfil del niño</p>
          <h1 className="account-title">Cuenta de {child.name}</h1>
          <p className="account-copy">
            Modifica el avatar y mira el estado de tu cuenta. El nombre lo decide papá/mamá.
          </p>
        </div>
      </div>

      {error && <div className="account-alert account-alert--error">{error}</div>}
      {message && <div className="account-alert account-alert--success">{message}</div>}

      <div className="account-grid account-grid--single">
        <div className="account-panel">
          <h2>Resumen del perfil</h2>
          <div className="profile-summary">
            <img src={selectedAvatar} alt={child.name} className="profile-summary__avatar" />
            <div>
              <p className="profile-summary__name">{child.name}</p>
              <p>Edad: {child.age}</p>
              <p>Monedas: {child.total_coins}</p>
              <p>Racha: {child.streak} día{child.streak === 1 ? "" : "s"}</p>
            </div>
          </div>

          <div className="form-group avatar-selection-group">
            <label>Selecciona tu avatar</label>
            <div className="avatar-selection-grid">
              {childAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  className={`avatar-card ${selectedAvatar === avatar.src ? "avatar-card--selected" : ""}`}
                  onClick={() => setSelectedAvatar(avatar.src)}
                >
                  <img src={avatar.src} alt={avatar.id} />
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Nombre</label>
            <input type="text" value={child.name} readOnly />
          </div>
          <div className="form-group">
            <label>Edad</label>
            <input type="text" value={child.age} readOnly />
          </div>
          <div className="form-group">
            <label>Monedas</label>
            <input type="text" value={child.total_coins} readOnly />
          </div>

          <div className="action-row">
            <button className="btn btn-primary-yellow" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar avatar"}
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => navigate(-1)}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
