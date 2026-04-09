import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { PinModal } from "../components/PinModal";
import "../ProfilesPage.css";
import cashtorImg from "../assets/img/Cashtor.jpg"; // imagen fija

export const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("TOKEN:", token);
        if (!token) {
          navigate("/sign-in");
          return;
        }

        const data = await apiRequest("api/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProfiles(data.profiles || [data.user]); // fallback por si devuelve un solo user
        setLoading(false);
      } catch (error) {
        console.error("Error cargando perfil: ", error);
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [navigate]);

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
  };

  const closeModal = () => {
    setSelectedProfile(null);
  };

  return (
    <div className="profiles-container">
      <h1>¿Quién está usando FinQuest?</h1>

      {loading ? (
        <p>Cargando perfiles...</p>
      ) : (
        <div className="profiles-grid">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="profile-card"
              onClick={() => handleProfileClick(profile)}
            >
              <img src={cashtorImg} alt={profile.name} /> {/* imagen fija */}
              <p>{profile.name.toUpperCase()}</p>
              <p>Rol: {profile.role.toUpperCase()}</p>
              <p>PIN: {profile.parentalPIN}</p>
            </div>
          ))}

          <div
            className="profile-card"
            onClick={() => navigate("/child-dashboard")}
          >
            <img src={cashtorImg} />
            <p>hijo</p>
          </div>
        </div>
      )}

      {selectedProfile && (
        <PinModal profile={selectedProfile} onClose={closeModal} />
      )}
    </div>
  );
};