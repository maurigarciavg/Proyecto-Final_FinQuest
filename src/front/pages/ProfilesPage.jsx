import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { PinModal } from "../components/child/PinModal";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/ProfilesPage.css";
import cashtorImg from "../assets/img/Cashtor.jpg";

export const ProfilesPage = () => {
  const { store } = useGlobalReducer();
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = store.token;
        const user = store.user;

        if (!token || !user) {
          navigate("/sign-in");
          return;
        }

        const childrenData = await apiRequest(`api/parent/${user.id}/children`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfiles([
          { ...user, role: "parent" },
          ...childrenData.map(child => ({ ...child, role: "child" }))
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error cargando perfiles: ", error);
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [navigate, store.token, store.user]);

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
  };

  const closeModal = () => {
    setSelectedProfile(null);
  };

  return (
    <div className="profiles-container">
      <h1 className="profiles-title">¿Quién está usando FinQuest?</h1>

      {loading ? (
        <div className="profiles-loading">
          <div className="spinner"></div>
          <p>Cargando perfiles...</p>
        </div>
      ) : (
        <div className="profiles-grid">
          {profiles.map((profile) => (
            <div
              key={`${profile.role}-${profile.id}`}
              className={`profile-card profile-card--${profile.role}`}
              onClick={() => handleProfileClick(profile)}
            >
              <div className="profile-card__avatar-wrapper">
                <img
                  src={profile.avatar || cashtorImg}
                  alt={profile.name}
                  className="profile-card__img"
                  onError={(e) => { e.target.src = cashtorImg; }}
                />
              </div>

              <div className="profile-card__info">
                <p className="profile-card__name">
                  {profile.name.toUpperCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProfile && (
        <PinModal
          profile={selectedProfile}
          onClose={closeModal}
        />
      )}
    </div>
  );
};