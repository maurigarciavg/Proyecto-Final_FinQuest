import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getGrandPrizeIcon } from "../../front/Utils/getTaskIcon";
import "../style ParentDash/styleRightPanel.css";

const RightPanel = ({ grandPrizeName, grandPrizeImage, tasks = [] }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('month');

    const getTaskStatusInfo = (task, date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const itemDate = new Date(date);
        itemDate.setHours(0, 0, 0, 0);
        const isPast = itemDate < today;

        const completedDate = task.last_completed ? new Date(task.last_completed) : null;
        const isCompletedOnDate = completedDate
            && completedDate.toDateString() === itemDate.toDateString()
            && (task.status === 'completed' || task.done);

        if (isCompletedOnDate) {
            return { label: "Aprobada", color: "#28a745", bg: "#eafaf1" };
        }
        if (task.wasRejected) {
            return { label: "Desaprobada", color: "#dc3545", bg: "#fdf2f2" };
        }
        if (task.status === 'pending_approval') {
            return { label: "Pendiente", color: "#f08c00", bg: "#fff9db" };
        }
        if (isPast) {
            return { label: "No realizada", color: "#6c757d", bg: "#f8f9fa" };
        }
        return { label: "Por hacer", color: "#007bff", bg: "#e7f5ff" };
    };

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

    const getTasksForDate = (date) => {
        if (!tasks || tasks.length === 0) return [];
        const dateStr = formatDateKey(date);
        const dayMap = { 1: "L", 2: "M", 3: "X", 4: "J", 5: "V", 6: "S", 0: "D" };
        const dayLetter = dayMap[date.getDay()];
        const seen = new Set();
        const uniqueTasks = [];

        tasks.forEach(t => {
            if (!t || seen.has(t.id)) return;
            const matchesDate = t.date && t.date.substring(0, 10) === dateStr;
            const matchesDay = t.days && Array.isArray(t.days) && t.days.includes(dayLetter);
            if (matchesDate || matchesDay) {
                seen.add(t.id);
                uniqueTasks.push(t);
            }
        });

        return uniqueTasks;
    };

    return (
        <aside className="right-panel">
            <section className="grand-prize-section">
                <h3>Gran Premio</h3>
                <div className="prize-card">
                    {grandPrizeImage && (grandPrizeImage.includes("http") || grandPrizeImage.includes("/")) ? (
                        <img src={grandPrizeImage} alt="Premio" className="prize-img" />
                    ) : (
                        <div className="prize-img" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            background: '#e2e8f0',
                            margin: '0 auto'
                        }}>
                            {getGrandPrizeIcon(grandPrizeName)}
                        </div>
                    )}
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
                                    {(viewMode === 'week' || viewMode === 'day') ? (
                                        <div className={viewMode === 'day' ? "tasks-list-full" : "tasks-list-compact"}>
                                            {dayTasks.length > 0 ? (
                                                <>
                                                    {dayTasks.slice(0, viewMode === 'week' ? 2 : 999).map((t, i) => {
                                                        const status = getTaskStatusInfo(t, date);
                                                        return (
                                                            <div
                                                                key={`${t.id}-${date.getTime()}`}
                                                                className="task-pill"
                                                                style={{
                                                                    borderLeft: `3px solid ${status.color}`,
                                                                    backgroundColor: status.bg,
                                                                    marginBottom: viewMode === 'week' ? '4px' : '6px',
                                                                    padding: viewMode === 'week' ? '4px 8px' : '8px 12px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    borderRadius: '6px',
                                                                    gap: '6px'
                                                                }}
                                                            >
                                                                <span style={{
                                                                    fontWeight: '600',
                                                                    fontSize: viewMode === 'week' ? '0.65rem' : '0.75rem',
                                                                    flex: viewMode === 'day' ? '0 1 auto' : '1',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    color: '#333'
                                                                }}>
                                                                    {t.title}
                                                                </span>

                                                                {viewMode === 'day' && (
                                                                    <span style={{
                                                                        background: "none",
                                                                        color: status.color,
                                                                        fontSize: '0.6rem',
                                                                        border: `1px solid ${status.color}`,
                                                                        padding: '1px 6px',
                                                                        borderRadius: '10px',
                                                                        fontWeight: '700'
                                                                    }}>
                                                                        {status.label}
                                                                    </span>
                                                                )}

                                                                <span style={{
                                                                    fontWeight: '700',
                                                                    fontSize: viewMode === 'week' ? '0.65rem' : '0.8rem',
                                                                    marginLeft: viewMode === 'day' ? 'auto' : '0',
                                                                    color: '#444'
                                                                }}>
                                                                    🪙 {t.points}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                    {viewMode === 'week' && dayTasks.length > 2 && (
                                                        <div style={{ fontSize: '0.65rem', textAlign: 'center', color: '#888', fontWeight: 'bold' }}>
                                                            + {dayTasks.length - 2} tareas
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="no-tasks" style={{ fontSize: '0.7rem', opacity: 0.5 }}>Sin tareas</span>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="dots-container" style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginTop: '4px' }}>
                                            {dayTasks.slice(0, 3).map((t, i) => {
                                                const status = getTaskStatusInfo(t, date);
                                                return (
                                                    <span
                                                        key={i}
                                                        className="task-dot"
                                                        style={{
                                                            width: '6px',
                                                            height: '6px',
                                                            borderRadius: '50%',
                                                            backgroundColor: status.color
                                                        }}
                                                    />
                                                );
                                            })}
                                            {dayTasks.length > 3 && <span style={{ fontSize: '0.6rem', color: '#999' }}>+</span>}
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