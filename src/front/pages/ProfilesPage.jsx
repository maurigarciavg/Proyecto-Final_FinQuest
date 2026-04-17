import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { PinModal } from "../components/PinModal";
import "../ProfilesPage.css";
import cashtorImg from "../assets/img/Cashtor.jpg"; 

export const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token) { navigate("/sign-in"); return; }

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
  }, [navigate]);

  const handleProfileClick = (profile) => {
  localStorage.setItem("activeProfile", JSON.stringify(profile));
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
                  src={profile.role === "child" ? (profile.avatar || cashtorImg) : cashtorImg} 
                  alt={profile.name} 
                  className="profile-card__img"
                  onError={(e) => { e.target.src = cashtorImg; }}
                />
              </div>
              
              <div className="profile-card__info">
                <p className="profile-card__name">{profile.name.toUpperCase()}</p>
                <p className="profile-card__role">
                    {profile.role === "parent" ? "👨‍👩‍👧 PADRE/MADRE" : "👦 MODO NIÑO"}
                </p>
                <span className="profile-card__pin-hint">
                    PIN: {profile.role === "parent" ? profile.parentalPIN : profile.pin}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProfile && (
        <PinModal profile={selectedProfile} onClose={closeModal} />
      )}
    </div>
  );
};