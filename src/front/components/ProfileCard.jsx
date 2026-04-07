

export const ProfileCard = ({ name, avatar, onClick }) => {
  return (
    <div className="profile-card" onClick={onClick}>
      <img src={avatar} alt={name} />
      <p>{name}</p>
    </div>
  );
};