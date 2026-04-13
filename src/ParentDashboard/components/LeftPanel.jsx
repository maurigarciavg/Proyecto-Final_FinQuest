import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChildWizard } from "../../front/components/ChildProfileCreation/ChildWizard";
import "../style ParentDash/styleLeftPanel.css";
import defaultAvatar from "../../front/assets/img/Castor-1.png";

const LeftPanel = ({ parentName, childrenProfiles, onSelectChild }) => {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  return (
    <aside className="left-panel">
      <header className="panel-header">
        <h2>{parentName}</h2>
      </header>

      <nav className="panel-content">
        <button
          className={`btn-create-child-profile ${selectedId === 'create' ? 'selected' : ''}`}
          onClick={() => {
            setShowWizard(true);
            setSelectedId('create');
          }}
        >
          <div className="plus-icon-container">
            <i className="fa-solid fa-plus"></i>
          </div>
          <span>Crear perfil hijo</span>
        </button>

        <ul className="children-list">
          {childrenProfiles.map((child) => (
            <li
              key={child.id}
              className={`child-item ${selectedId === child.id ? 'active' : ''}`}
            >
              <button
                className="child-profile"
                onClick={() => {
                  setSelectedId(child.id);
                  if (onSelectChild) onSelectChild(child);
                }}
              >
                <div className="avatar-wrapper">
                  <img
                    src={child.avatar || defaultAvatar}
                    className="child-avatar"
                    alt={`Avatar de ${child.name}`}
                    onError={(e) => { e.target.src = defaultAvatar }}
                  />
                </div>
                <span className="child-name">{child.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {showWizard && (
        <div className="wizard-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="wizard-modal-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button
              onClick={() => setShowWizard(false)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: '#ff5f56', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontWeight: 'bold', cursor: 'pointer', zIndex: 10001, boxShadow: '0 2px 5px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >✕</button>
            <ChildWizard onClose={() => setShowWizard(false)} />
          </div>
        </div>
      )}
    </aside>
  );
};

LeftPanel.propTypes = {
  parentName: PropTypes.string.isRequired,
  childrenProfiles: PropTypes.array.isRequired,
  onSelectChild: PropTypes.func
};

export default LeftPanel;
