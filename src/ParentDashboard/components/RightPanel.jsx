import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "../style ParentDash/styleRightPanel.css";

const RightPanel = ({ grandPrizeName, grandPrizeImage, tasks = [] }) => {
    // 1. ESTADO: Controla qué mes y año estamos visualizando
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 2. CÁLCULOS DINÁMICOS basándonos en viewDate
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth(); // 0 (Enero) a 11 (Diciembre)

    // Formatear el encabezado (ej: "abril de 2026")
    const currentMonthLabel = new Intl.DateTimeFormat('es-ES', { 
        month: 'long', 
        year: 'numeric' 
    }).format(viewDate);
    
    // Obtener cuántos días tiene el mes actual de la vista
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // 3. FUNCIONES DE NAVEGACIÓN
    const changeMonth = (offset) => {
        // offset puede ser -1 (atrás) o 1 (adelante)
        const newDate = new Date(year, month + offset, 1);
        setViewDate(newDate);
    };

    const handleDayClick = (day) => {
        // Formato YYYY-MM-DD para comparar con las tareas
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const dayTasks = tasks.filter(t => t.date === dateStr);
        
        setSelectedTasks(dayTasks);
        setIsModalOpen(true);
    };

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

            <hr className="divider" />

            {/* 2. Sección del Calendario */}
            <section className="calendar-section">
                <header className="calendar-header">
                    <div className="calendar-nav">
                        <button className="nav-btn" onClick={() => changeMonth(-1)}>
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        
                        <h4 className="calendar-title">{currentMonthLabel}</h4>
                        
                        <button className="nav-btn" onClick={() => changeMonth(1)}>
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </header>
                
                <div className="calendar-grid">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                        <div key={d} className="calendar-weekday">{d}</div>
                    ))}

                    {daysArray.map(day => {
                        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                        const dayTasks = tasks.filter(t => t.date === dateStr);

                        return (
                            <div key={day} className="calendar-day" onClick={() => handleDayClick(day)}>
                                <span className="day-number">{day}</span>
                                <div className="dots-container">
                                    {dayTasks.slice(0, 3).map(t => (
                                        <span key={t.id} className="task-dot"></span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 3. Modal de Tareas */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h4>Tareas del día</h4>
                        {selectedTasks.length > 0 ? (
                            <ul className="modal-task-list">
                                {selectedTasks.map(t => (
                                    <li key={t.id}>• {t.title} <span className="pts">+{t.points}pts</span></li>
                                ))}
                            </ul>
                        ) : <p>No hay tareas asignadas para este día.</p>}
                        <button className="btn-close" onClick={() => setIsModalOpen(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </aside>
    );
};

RightPanel.propTypes = {
    grandPrizeName: PropTypes.string,
    grandPrizeImage: PropTypes.string,
    tasks: PropTypes.array
};

export default RightPanel;