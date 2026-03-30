import PropTypes from 'prop-types';

const CenterPanel = ({ childName, pendingTasksCount }) => {
    return (
        <main className="center-panel">
            {/* 1. Titular con el nombre del hijo */}
            <header className="center-header">
                <h1>Misiones de {childName}</h1>
            </header>

            {/* 2. Alerta de tareas pendientes */}
            <section className="pending-status">
                <div className="status-card">
                    <p>Tareas pendientes por aprobar: <strong>{pendingTasksCount}</strong></p>
                </div>
            </section>

            {/* 3. Gestión de Misiones */}
            <section className="mission-management">
                <h3>Gestión de Misiones</h3>
                <div className="management-grid">
                    <button className="manage-item">Tareas</button>
                    <button className="manage-item">Cupones</button>
                    <button className="manage-item">Gran Premio</button>
                </div>
            </section>
        </main>
    );
};

// Validamos las props para evitar errores de ESLint
CenterPanel.propTypes = {
    childName: PropTypes.string.isRequired,
    pendingTasksCount: PropTypes.number.isRequired
};

export default CenterPanel;