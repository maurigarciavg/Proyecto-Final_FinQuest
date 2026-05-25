import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiRequest, authHeaders } from "../services/api";
import parentAvatar1 from "../assets/img/Profiles/Parent/Parent_1.png";
import parentAvatar2 from "../assets/img/Profiles/Parent/Parent_2.png";
import parentAvatar3 from "../assets/img/Profiles/Parent/Parent_3.png";
import parentAvatar4 from "../assets/img/Profiles/Parent/Parent_4.png";
import parentAvatar5 from "../assets/img/Profiles/Parent/Parent_5.png";
import parentAvatar6 from "../assets/img/Profiles/Parent/Parent_6.png";
import parentAvatar7 from "../assets/img/Profiles/Parent/Parent_7.png";
import parentAvatar8 from "../assets/img/Profiles/Parent/Parent_8.png";
import defaultChildAvatar from "../assets/img/Profiles/Children/child_9.png";
import "../styles/Account.css";

const parentAvatars = [
  { id: "Parent_1", src: parentAvatar1 },
  { id: "Parent_2", src: parentAvatar2 },
  { id: "Parent_3", src: parentAvatar3 },
  { id: "Parent_4", src: parentAvatar4 },
  { id: "Parent_5", src: parentAvatar5 },
  { id: "Parent_6", src: parentAvatar6 },
  { id: "Parent_7", src: parentAvatar7 },
  { id: "Parent_8", src: parentAvatar8 }
];

export const ParentAccount = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: parentAvatars[0].src,
    parentalPIN: "",
    children: []
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!store.token) return;

      setLoading(true);
      setError("");

      try {
        const data = await apiRequest("api/me", {
          headers: authHeaders(store.token)
        });

        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          avatar: data.user.avatar || parentAvatars[0].src,
          parentalPIN: data.user.parentalPIN || "",
          children: data.user.children || []
        });
      } catch (err) {
        setError(err.message || "No se pudo cargar tu cuenta.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [store.token]);

  const handleInputChange = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setMessage("");
    setError("");
  };

  const handleAvatarSelect = (src) => {
    setProfile((current) => ({ ...current, avatar: src }));
    setMessage("");
    setError("");
  };

  const handleSaveProfile = async () => {
    if (!store.token) return;
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const data = await apiRequest("api/me", {
        method: "PATCH",
        headers: authHeaders(store.token),
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar
        })
      });

      setProfile((current) => ({ ...current, ...data.user }));
      dispatch({ type: "auth_success", payload: { token: store.token, user: data.user } });
      if (store.activeProfile?.role === "parent") {
        dispatch({ type: "set_active_profile", payload: data.user });
      }
      setMessage("Perfil guardado correctamente.");
    } catch (err) {
      setError(err.message || "No se pudo guardar la cuenta.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordMessage("");
    setPasswordError("");

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await apiRequest("api/me/password", {
        method: "PATCH",
        headers: authHeaders(store.token),
        body: JSON.stringify(passwordForm)
      });
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
      setPasswordMessage("Contraseña actualizada correctamente.");
    } catch (err) {
      setPasswordError(err.message || "No se pudo cambiar la contraseña.");
    }
  };

  const handleDeleteChild = async (childId) => {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar a este hijo? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;

    try {
      await apiRequest(`api/child/${childId}`, {
        method: "DELETE",
        headers: authHeaders(store.token)
      });
      setProfile((current) => ({
        ...current,
        children: current.children.filter((child) => child.id !== childId)
      }));
      setMessage("Perfil de niño eliminado correctamente.");
    } catch (err) {
      setError(err.message || "No se pudo eliminar al niño.");
    }
  };

  const handleNavigateChild = (childId) => {
    navigate(`/account/child/${childId}`);
  };

  if (loading) {
    return <div className="account-page">Cargando tu cuenta...</div>;
  }

  return (
    <section className="account-page">
      <div className="account-heading">
        <div>
          <p className="eyebrow">Cuenta de padre</p>
          <h1 className="account-title">Mi cuenta</h1>
          <p className="account-copy">
            Aquí puedes actualizar tu información, cambiar avatar y gestionar los perfiles de tus hijos.
          </p>
        </div>
      </div>

      {error && <div className="account-alert account-alert--error">{error}</div>}
      {message && <div className="account-alert account-alert--success">{message}</div>}

      <div className="account-grid">
        <div className="account-panel">
          <h2>Información personal</h2>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>PIN parental</label>
            <input type="text" value={profile.parentalPIN} readOnly />
          </div>

          <div className="form-group avatar-selection-group">
            <label>Avatar</label>
            <div className="avatar-selection-grid">
              {parentAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  className={`avatar-card ${profile.avatar === avatar.src ? "avatar-card--selected" : ""}`}
                  onClick={() => handleAvatarSelect(avatar.src)}
                >
                  <img src={avatar.src} alt={avatar.id} />
                </button>
              ))}
            </div>
          </div>

          <div className="action-row">
            <button className="btn btn-primary-yellow" onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>

        <div className="account-panel">
          <h2>Cambiar contraseña</h2>
          <div className="form-group">
            <label>Contraseña actual</label>
            <input
              type="password"
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm((current) => ({ ...current, current_password: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Nueva contraseña</label>
            <input
              type="password"
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm((current) => ({ ...current, new_password: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Confirmar nueva contraseña</label>
            <input
              type="password"
              value={passwordForm.confirm_password}
              onChange={(e) => setPasswordForm((current) => ({ ...current, confirm_password: e.target.value }))}
            />
          </div>
          {passwordError && <div className="account-alert account-alert--error">{passwordError}</div>}
          {passwordMessage && <div className="account-alert account-alert--success">{passwordMessage}</div>}
          <div className="action-row">
            <button className="btn btn-secondary" onClick={handleChangePassword}>
              Cambiar contraseña
            </button>
          </div>
        </div>
      </div>

      <div className="account-panel account-panel--wide">
        <div className="account-panel-header">
          <div>
            <h2>Perfiles de tus hijos</h2>
            <p>Gestiona los niños que has creado y edita sus perfiles directamente.</p>
          </div>
        </div>

        {profile.children.length === 0 ? (
          <p>No tienes hijos registrados todavía. Añádelos desde el panel de control.</p>
        ) : (
          <div className="children-list">
            {profile.children.map((child) => (
              <div className="child-item" key={child.id}>
                <div className="child-item__info">
                  <img src={child.avatar || defaultChildAvatar} alt={child.name} className="child-item__avatar" />
                  <div>
                    <p className="child-item__name">{child.name}</p>
                    <p className="child-item__meta">Edad: {child.age}</p>
                    <p className="child-item__meta">Monedas: {child.total_coins}</p>
                  </div>
                </div>
                <div className="child-item__actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleNavigateChild(child.id)}
                  >
                    Editar perfil
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteChild(child.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
