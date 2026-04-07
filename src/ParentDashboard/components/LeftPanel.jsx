import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

        {/* Lista de Perfiles */}
        <ul className="children-list">
          {childrenProfiles && childrenProfiles.map((child) => (
            <li key={child.id} className="child-item">
              <span>{child.name}</span>

              {/* Verificación ultra-segura para evitar el Uncaught TypeError */}
              {child.date && !isNaN(new Date(child.date).getTime()) && (
                <span>{new Date(child.date).toLocaleString()}</span>
              )}
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
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="wizard-modal-container" style={{
            position: 'relative',
            /* 🔴 HEMOS ELIMINADO width, height y overflow: hidden 🔴 */
            /* Ahora este div abrazará perfectamente a tu ChildWizard sin aplastarlo */
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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
