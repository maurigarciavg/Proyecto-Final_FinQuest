import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "../style ParentDash/styleRightPanel.css";

const RightPanel = ({ grandPrizeName, grandPrizeImage, tasks = [] }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('month');



    const formatDateKey = (date) => {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const getLabel = () => {
        const options = { month: 'long', year: 'numeric' };
        if (viewMode === 'day') options.day = 'numeric';
        return new Intl.DateTimeFormat('es-ES', options).format(viewDate).replace(/ de /g, " ");
    };

    const navigate = (offset) => {
        const newDate = new Date(viewDate);
        if (viewMode === 'month') newDate.setMonth(viewDate.getMonth() + offset);
        else if (viewMode === 'week') newDate.setDate(viewDate.getDate() + (offset * 7));
        else newDate.setDate(viewDate.getDate() + offset);
        setViewDate(newDate);
    };

    const getDaysToRender = () => {
        const tempDate = new Date(viewDate);
        if (viewMode === 'month') {
            const year = tempDate.getFullYear();
            const month = tempDate.getMonth();
            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const offset = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
            const totalDays = new Date(year, month + 1, 0).getDate();
            return {
                offsetDays: Array.from({ length: offset }),
                realDays: Array.from({ length: totalDays }, (_, i) => new Date(year, month, i + 1))
            };
        }
        if (viewMode === 'week') {
            const dayOfWeek = tempDate.getDay();
            const diffToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
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

    const handleDayClick = (date) => {
        if (viewMode === 'day') return;
        setViewDate(date);
        setViewMode('day');
    };

    // --- FUNCIÓN DE FILTRADO ROBUSTA ---
    const getTasksForDate = (date) => {
        if (!tasks || tasks.length === 0) return [];

        const dateStr = formatDateKey(date); // YYYY-MM-DD

        // Mapeo de JS (0-6) a tus letras del Wizard
        // 0 es Domingo, 1 es Lunes...
        const dayMap = {
            1: "L",
            2: "M",
            3: "X",
            4: "J",
            5: "V",
            6: "S",
            0: "D"
        };

        const dayLetter = dayMap[date.getDay()];

        return tasks.filter(t => {
            if (!t) return false;

            // 1. Si la tarea tiene una fecha específica
            if (t.date && t.date.substring(0, 10) === dateStr) return true;

            // 2. Si la tarea tiene recurrencia por días (L, M, X...)
            if (t.days && Array.isArray(t.days)) {
                // Comparamos la letra del día actual con las letras en la tarea
                return t.days.includes(dayLetter);
            }

            return false;
        });
    };
    return (
        <aside className="right-panel">
            <section className="grand-prize-section">
                <h3>Gran Premio</h3>
                <div className="prize-card">
                    {grandPrizeImage && <img src={grandPrizeImage} alt="Premio" className="prize-img" />}
                    <p className="prize-name">{grandPrizeName || "Sin premio asignado"}</p>
                </div>
            </section>

            <hr className="divider" />

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
                        <h4 className="calendar-title" style={{ textTransform: 'capitalize' }}>{getLabel()}</h4>
                        <button className="nav-btn" onClick={() => navigate(1)}>
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </header>

                <div className={`calendar-grid grid-${viewMode}`}>
                    {viewMode === 'month' && ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                        <div key={d} className="calendar-weekday">{d}</div>
                    ))}

                    {viewMode === 'month' && offsetDays.map((_, i) => (
                        <div key={`empty-${i}`} className="calendar-day empty"></div>
                    ))}

                    {realDays.map((date, idx) => {
                        const dayTasks = getTasksForDate(date);
                        const isToday = new Date().toDateString() === date.toDateString();
                        const dayNameShort = new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date);

                        return (
                            <div
                                key={`${idx}-${date.getTime()}`}
                                className={`calendar-day ${isToday ? 'today' : ''} view-${viewMode}`}
                                onClick={() => handleDayClick(date)}
                            >
                                <div className="day-card-header">
                                    <span className="day-name-label">{viewMode !== 'month' ? dayNameShort : ''}</span>
                                    <span className="day-number">{date.getDate()}</span>
                                </div>

                                <div className="tasks-container">
                                    {/* Casos de vista Día o Semana */}
                                    {(viewMode === 'week' || viewMode === 'day') ? (
                                        <div className="tasks-list-inline">
                                            {dayTasks.length > 0 ? (
                                                <>
                                                    {/* LÓGICA DE RENDERIZADO CONDICIONAL */}
                                                    {dayTasks.map((t, i) => {
                                                        // Si estamos en semana, solo mostramos las 2 primeras
                                                        if (viewMode === 'week' && i >= 2) return null;

                                                        return (
                                                            <div key={`${t.id}-${date.getTime()}`} className="task-pill">
                                                                {/* Usamos un span con clase para controlar el texto largo */}
                                                                <span className="task-title-inline">{t.title}</span>
                                                                <span className="task-coins">🪙{t.points}</span>
                                                            </div>
                                                        );
                                                    })}

                                                    {/* MOSTRAR PUNTOS SOLO EN SEMANA SI HAY MÁS DE 2 */}
                                                    {viewMode === 'week' && dayTasks.length > 2 && (
                                                        <div className="more-tasks-indicator">
                                                            + {dayTasks.length - 2}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="no-tasks">Sin tareas</span>
                                            )}
                                        </div>
                                    ) : (
                                        /* VISTA DE MES (Se mantiene igual con los puntitos) */
                                        <div className="dots-container">
                                            {dayTasks.slice(0, 3).map((t, i) => (
                                                <span key={`${t.id}-${i}`} className="task-dot"></span>
                                            ))}
                                            {dayTasks.length > 3 && <span className="task-dot-plus">+</span>}
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