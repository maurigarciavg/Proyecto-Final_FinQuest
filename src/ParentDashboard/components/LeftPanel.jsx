import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChildWizard } from "../../front/components/ChildProfileCreation/ChildWizard";
import "../style ParentDash/styleLeftPanel.css";
import defaultAvatar from "../../front/assets/img/Castor-1.png";

const LeftPanel = ({ parentName, parentAvatar, childrenProfiles, onSelectChild }) => {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleCloseWizard = () => {
    setShowWizard(false);
    if (selectedId === 'create') setSelectedId(null);
  };

  return (
    <aside className="left-panel">
      <div className="left-panel-card">
        <header className="panel-header">
          <div className="parent-avatar-wrapper">
            <img
              src={parentAvatar || defaultAvatar}
              className="parent-avatar"
              alt={`Avatar de ${parentName}`}
              onError={(e) => { e.target.src = defaultAvatar; }}
            />
          </div>
          <div className="parent-info">
            <p className="parent-role">Perfil del padre</p>
            <h2>{parentName}</h2>
            <p className="parent-subtitle">{childrenProfiles.length} {childrenProfiles.length === 1 ? 'hijo registrado' : 'hijos registrados'}</p>
          </div>
        </header>

        <div className="panel-actions">
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
        </div>

        <div className="children-section">
          <div className="children-section-header">
            <h3>Perfiles de niños</h3>
            <span className="children-count">{childrenProfiles.length}</span>
          </div>

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
                      onError={(e) => { e.target.src = defaultAvatar}}
                    />
                  </div>
                  <span className="child-name">{child.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showWizard && (
        <div
          className="wizard-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div
            className="wizard-modal-container"
            style={{
              position: 'relative',
              backgroundColor: '#fff',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={handleCloseWizard}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#ff5f56',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                fontWeight: 'bold',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>

            <ChildWizard onClose={handleCloseWizard} />
          </div>
        </div>
      )}
    </aside>
  );
};

LeftPanel.propTypes = {
  parentName: PropTypes.string.isRequired,
  parentAvatar: PropTypes.string,
  childrenProfiles: PropTypes.array.isRequired,
  onSelectChild: PropTypes.func
};

export default LeftPanel;