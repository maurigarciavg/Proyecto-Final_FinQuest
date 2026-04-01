import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Asegúrate de que esta ruta sigue siendo válida tras tus merges
import { ChildWizard } from "../../front/components/ChildProfileCreation/ChildWizard";

const LeftPanel = ({ parentName, childrenProfiles }) => {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <aside className="left-panel">
      <header className="panel-header">
        <h2>{parentName}</h2>
      </header>

      <nav className="panel-content">
        <button className="btn-create" onClick={() => setShowWizard(true)}>
          + Crear perfil hijo
        </button>

        <ul className="children-list">
          {childrenProfiles.map((child) => (
            <li key={child.id} className="child-item">
              <span>{child.name}</span>
            </li>
          ))}
        </ul>
      </nav>

      {/* --- RENDERIZADO DEL MODAL --- */}
      {showWizard && (
        <div className="wizard-modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)', // Un poco más oscuro para que resalte
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="wizard-modal-container" style={{
            position: 'relative',
            width: '550px', 
            height: '650px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '30px', // Acompaña la forma de tu card
            overflow: 'hidden'    // Evita que nada sobresalga
          }}>
            {/* Botón de cerrar (X roja) */}
            <button
              onClick={() => setShowWizard(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#ff5f56',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                fontWeight: 'bold',
                cursor: 'pointer',
                zIndex: 10001,
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>

            {/* Tu componente Wizard con el prop onClose */}
            <ChildWizard onClose={() => setShowWizard(false)} />
          </div>
        </div>
      )}
    </aside>
  );
};

LeftPanel.propTypes = {
  parentName: PropTypes.string.isRequired,
  childrenProfiles: PropTypes.array.isRequired
};

export default LeftPanel;
