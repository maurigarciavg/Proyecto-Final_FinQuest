import React from 'react';
import PropTypes from 'prop-types';

const LeftPanel = ({ parentName, childrenProfiles }) => {
  return (
    <aside className="left-panel">
      <header className="panel-header">
        <h2>{parentName}</h2>
      </header>

      <nav className="panel-content">
        <button className="btn-create">
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
    </aside>
  );
};

LeftPanel.propTypes = {
  parentName: PropTypes.string.isRequired,
  childrenProfiles: PropTypes.array.isRequired
};

export default LeftPanel;

