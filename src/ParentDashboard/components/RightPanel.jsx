import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "../style ParentDash/styleRightPanel.css";

const RightPanel = ({ grandPrizeName, grandPrizeImage, tasks = [] }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('month'); 

    // --- AYUDANTES DE FECHA ---
    const formatDateKey = (date) => {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const getLabel = () => {
        const options = { month: 'long', year: 'numeric' };
        if (viewMode === 'day') options.day = 'numeric';
        // En vista semana, podemos mostrar un rango (opcional) o el mes actual
        return new Intl.DateTimeFormat('es-ES', options).format(viewDate).replace(/ de /g, " ");
    };

    // --- LÓGICA DE NAVEGACIÓN ---
    const navigate = (offset) => {
        const newDate = new Date(viewDate);
        if (viewMode === 'month') newDate.setMonth(viewDate.getMonth() + offset);
        else if (viewMode === 'week') newDate.setDate(viewDate.getDate() + (offset * 7));
        else newDate.setDate(viewDate.getDate() + offset);
        setViewDate(newDate);
    };

    // --- CÁLCULO DE DÍAS Y HUECOS ---
    const getDaysToRender = () => {
        const tempDate = new Date(viewDate);

        if (viewMode === 'month') {
            const year = tempDate.getFullYear();
            const month = tempDate.getMonth();
            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
            const totalDays = new Date(year, month + 1, 0).getDate();
            
            return {
                offsetDays: Array.from({ length: offset }),
                realDays: Array.from({ length: totalDays }, (_, i) => new Date(year, month, i + 1))
            };
        } 
        
        if (viewMode === 'week') {
            const dayOfWeek = tempDate.getDay();
            const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const monday = new Date(tempDate);
            monday.setDate(tempDate.getDate() - diffToMonday);
            
            const weekDays = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date(monday);
                d.setDate(monday.getDate() + i);
                weekDays.push(d);
            }
            return { offsetDays: [], realDays: weekDays };
        }

        return { offsetDays: [], realDays: [new Date(viewDate)] };
    };

    const { offsetDays, realDays } = getDaysToRender();

    // --- NUEVA LÓGICA AL HACER CLIC ---
    const handleDayClick = (date) => {
        // Si ya estamos en vista día, no hacemos nada
        if (viewMode === 'day') return;

        // 1. Cambiamos la fecha seleccionada a la del día clickeado
        setViewDate(date);
        // 2. Saltamos automáticamente a la vista de "Día"
        setViewMode('day');
    };

    return (
        <aside className="right-panel">
            {/* Sección del Gran Premio */}
            <section className="grand-prize-section">
                <h3>Gran Premio</h3>
                <div className="prize-card">
                    {grandPrizeImage && <img src={grandPrizeImage} alt="Premio" className="prize-img" />}
                    <p className="prize-name">{grandPrizeName || "Sin premio asignado"}</p>
                </div>
            </section>

            <hr className="divider" />

            {/* Sección del Calendario */}
            <section className="calendar-section">
                <header className="calendar-header">
                    <div className="view-selector">
                        <button className={viewMode === 'day' ? 'active' : ''} onClick={() => setViewMode('day')}>Día</button>
                        <button className={viewMode === 'week' ? 'active' : ''} onClick={() => setViewMode('week')}>Semana</button>
                        <button className={viewMode === 'month' ? 'active' : ''} onClick={() => setViewMode('month')}>Mes</button>
                    </div>

                    <div className="calendar-nav">
                        <button className="nav-btn" onClick={() => navigate(-1)}>
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <h4 className="calendar-title" style={{textTransform: 'capitalize'}}>{getLabel()}</h4>
                        <button className="nav-btn" onClick={() => navigate(1)}>
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </header>

                <div className={`calendar-grid grid-${viewMode}`}>
                    {viewMode === 'month' && ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                        <div key={d} className="calendar-weekday">{d}</div>
                    ))}

                    {/* Huecos en Mes */}
                    {viewMode === 'month' && offsetDays.map((_, i) => (
                        <div key={`empty-${i}`} className="calendar-day empty"></div>
                    ))}

                    {/* Días Reales */}
                    {realDays.map((date, idx) => {
                        const dateStr = formatDateKey(date);
                        const dayTasks = tasks.filter(t => t.date === dateStr);
                        const isToday = new Date().toDateString() === date.toDateString();
                        const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date);

                        return (
                            <div
                                key={idx}
                                className={`calendar-day ${isToday ? 'today' : ''} view-${viewMode}`}
                                onClick={() => handleDayClick(date)}
                            >
                                <div className="day-card-header">
                                    <span className="day-name-label">{viewMode !== 'month' ? dayName : ''}</span>
                                    <span className="day-number">{date.getDate()}</span>
                                </div>

                                <div className="tasks-container">
                                    {(viewMode === 'week' || viewMode === 'day') ? (
                                        <div className="tasks-list-inline">
                                            {dayTasks.length > 0 ? (
                                                dayTasks.map(t => (
                                                    <div key={t.id} className="task-pill">
                                                        <span className="task-title-inline">{t.title}</span>
                                                        <span className="task-coins">🪙{t.points}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="no-tasks">Sin tareas</span>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="dots-container">
                                            {dayTasks.slice(0, 3).map(t => (
                                                <span key={t.id} className="task-dot"></span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </aside>
    );
};

RightPanel.propTypes = {
    grandPrizeName: PropTypes.string,
    grandPrizeImage: PropTypes.string,
    tasks: PropTypes.array
};

export default RightPanel;