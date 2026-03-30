import PropTypes from 'prop-types';

const RightPanel = ({ grandPrizeName, grandPrizeImage }) => {
    // Obtenemos el mes actual para el título del calendario
    const currentMonth = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date());

    return (
        <aside className="right-panel">
            {/* 1. Sección del Gran Premio */}
            <section className="grand-prize-section">
                <h3>Gran Premio</h3>
                <div className="prize-card">
                    {grandPrizeImage && <img src={grandPrizeImage} alt="Premio" className="prize-img" />}
                    <p className="prize-name">{grandPrizeName || "Sin premio asignado"}</p>
                </div>
            </section>

            <hr />

            {/* 2. Sección del Calendario */}
            <section className="calendar-section">
                <header className="calendar-header">
                    <h4>{currentMonth}</h4>
                </header>
                <div className="calendar-placeholder">
                    {/* Aquí puedes renderizar un calendario real o una cuadrícula de días */}
                    <div className="calendar-grid">
                        Calendario
                    </div>
                </div>
            </section>
        </aside>
    );
};

// Validaciones para que ESLint no marque errores en rojo
RightPanel.propTypes = {
    grandPrizeName: PropTypes.string,
    grandPrizeImage: PropTypes.string
};

export default RightPanel;