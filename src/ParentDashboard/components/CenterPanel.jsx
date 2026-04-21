import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { getTaskIcon, getCouponIcon, getGrandPrizeIcon } from "../../front/Utils/getTaskIcon";
import "../style ParentDash/styleCePanel.css";

const CenterPanel = ({
    childName,
    pendingTasksCount,
    tasksList = [],
    couponsList = [],
    grandPrize = null,
    onApproveTask,
    onRejectTask,
    onUndoTask,
    onUndoRedeem,
    onEditItem,
    onDeleteItem,
    onCreateItem
}) => {
    const [activeTab, setActiveTab] = useState('Tareas');
    const [subFilter, setSubFilter] = useState('principal');
    const panelRef = useRef(null);

    // 🟢 Lógica de fechas de tu compañera (RECUPERADA)
    const formatDate = (dateValue) => {
        if (!dateValue) return "Sin fecha";
        const d = new Date(dateValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const taskDate = new Date(d);
        taskDate.setHours(0, 0, 0, 0);
        const diffTime = taskDate - today;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "Hoy";
        if (diffDays === 1) return "Mañana";
        if (diffDays === -1) return "Ayer";
        return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    };

    const getTaskStatusBadge = (task) => {
        if (task.done) return { label: "Aprobada", className: "badge-approved" };
        if (task.status === 'rejected') return { label: "Rechazada", className: "badge-rejected" };
        if (task.status === 'pending_validation') return { label: "Esperando", className: "badge-pending" };
        return { label: "Pendiente", className: "badge-todo" };
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSubFilter('principal');
    };

    const getCreateButtonLabel = () => {
        switch (activeTab) {
            case 'Tareas': return '+ Añadir Tarea';
            case 'Cupones': return '+ Añadir Cupón';
            case 'Gran Premio': return '+ Gran Premio';
            default: return `Nuevo ${activeTab}`;
        }
    };

    if (!childName || childName.trim() === "" || childName === "Hijo") {
        return (
            <main className="center-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center', color: '#888' }}>
                    <i className="fa-solid fa-arrow-left" style={{ fontSize: '2.5rem', color: '#3dc9b6', marginBottom: '15px' }}></i>
                    <h3>Selecciona un perfil</h3>
                    <p>Haz clic en un niño a la izquierda para gestionar sus misiones.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="center-panel" ref={panelRef}>
            <header className="center-header">
                <h2>Panel de {childName}</h2>
            </header>

            <section className="pending-status">
                <div className="status-card">
                    <h4>Pendientes de validar: <strong>{pendingTasksCount}</strong></h4>
                    <div className="quick-approve-container">
                        <div className="quick-approve-list">
                            {tasksList
                                .filter(t => t.status === "pending_validation")
                                .map(t => (
                                    <div key={t.id} className="task-card-item pending-card">
                                        <div className="task-card-left">
                                            <div className="task-icon-container">{getTaskIcon(t.title)}</div>
                                            <div className="task-info-text">
                                                <span className="task-title">{t.title}</span>
                                                <span className="task-date"><i className="fa-regular fa-calendar"></i> {formatDate(t.date)}</span>
                                            </div>
                                        </div>
                                        <div className="task-card-right">
                                            <div className="task-actions">
                                                <button className="btn-action btn-pending-reject" onClick={() => onRejectTask(t.id)}><i className="fa-solid fa-xmark"></i></button>
                                                <button className="btn-action btn-pending-approve" onClick={() => onApproveTask(t.id)}><i className="fa-solid fa-check"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mission-management">
                <div className="management-grid">
                    <div className='missions-btn' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div className="left_btn" style={{ display: 'flex', gap: '10px' }}>
                            {['Tareas', 'Cupones', 'Gran Premio'].map(tab => (
                                <button key={tab} className={`manage-item ${activeTab === tab ? 'active' : ''}`} onClick={() => handleTabChange(tab)}>{tab}</button>
                            ))}
                        </div>
                        <button className="add-mission-btn" disabled={activeTab === 'Gran Premio' && grandPrize} onClick={() => onCreateItem(activeTab === 'Gran Premio' ? 'grand-prize' : activeTab)}>
                            {getCreateButtonLabel()}
                        </button>
                    </div>

                    <div className="filter-container">
                        <div className="sub-filters-wrapper">
                            <button className={`sub-filter-btn ${subFilter === 'principal' ? 'active' : ''}`} onClick={() => setSubFilter('principal')}>
                                {activeTab === 'Tareas' ? 'Hoy' : 'Disponibles'}
                            </button>
                            <button className={`sub-filter-btn ${subFilter === 'secundario' ? 'active' : ''}`} onClick={() => setSubFilter('secundario')}>
                                {activeTab === 'Tareas' ? 'Historial' : 'Canjeados'}
                            </button>
                        </div>
                    </div>

                    <div className='Lista'>
                        {/* SECCIÓN TAREAS */}
                        {activeTab === 'Tareas' && tasksList
                            .filter(t => {
                                if (subFilter === 'principal') return t.is_today && !t.done && t.status !== 'pending_validation';
                                return t.done;
                            })
                            .map(t => (
                                <div key={t.id} className="task-card-item">
                                    <div className="task-card-left">
                                        <div className="task-icon-container">{getTaskIcon(t.title)}</div>
                                        <div className="task-info-text">
                                            <span className="task-title">{t.title}</span>
                                            <div style={{display: 'flex', gap: '5px', fontSize: '0.7rem', color: '#888'}}>
                                                <span>{t.days?.join('·')}</span> | <span>{formatDate(t.date)}</span>
                                            </div>
                                            <div className="task-coins"><span>🪙</span> {t.points}</div>
                                        </div>
                                    </div>
                                    <div className="task-card-right">
                                        <div className="task-actions">
                                            {subFilter === 'principal' ? (
                                                <>
                                                    <button className="btn-action btn-edit" onClick={() => onEditItem(t, 'tasks')}><i className="fa-solid fa-pen"></i></button>
                                                    <button className="btn-action btn-delete" onClick={() => onDeleteItem(t.id, 'tasks')}><i className="fa-solid fa-trash"></i></button>
                                                </>
                                            ) : (
                                                <button className="btn-action btn-undo" onClick={() => onUndoTask(t.id)}><i className="fa-solid fa-rotate-left"></i></button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {/* SECCIÓN CUPONES */}
                        {activeTab === 'Cupones' && couponsList
                            .filter(c => subFilter === 'principal' ? !c.redeemed : c.redeemed)
                            .map(c => (
                                <div key={c.id} className="task-card-item">
                                    <div className="task-card-left">
                                        <div className="task-icon-container">{getCouponIcon(c.name)}</div>
                                        <div className="task-info-text">
                                            <span className="task-title">{c.name}</span>
                                            <span className="task-date">Disponible</span>
                                            <div className="task-coins"><span>🪙</span> {c.coins}</div>
                                        </div>
                                    </div>
                                    <div className="task-card-right">
                                        <div className="task-actions">
                                            {subFilter === 'principal' ? (
                                                <>
                                                    <button className="btn-action btn-edit" onClick={() => onEditItem(c, 'small-goals')}><i className="fa-solid fa-pen"></i></button>
                                                    <button className="btn-action btn-delete" onClick={() => onDeleteItem(c.id, 'small-goals')}><i className="fa-solid fa-trash"></i></button>
                                                </>
                                            ) : (
                                                <button className="btn-action btn-undo" onClick={() => onUndoRedeem(c.id, 'coupon')}><i className="fa-solid fa-rotate-left"></i></button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {/* SECCIÓN GRAN PREMIO */}
                        {activeTab === 'Gran Premio' && grandPrize && (
                            ((subFilter === 'principal' && !grandPrize.redeemed) || (subFilter === 'secundario' && grandPrize.redeemed)) && (
                                <div className="task-card-item">
                                    <div className="task-card-left">
                                        <div className="task-icon-container">{getGrandPrizeIcon(grandPrize.name)}</div>
                                        <div className="task-info-text">
                                            <span className="task-title">{grandPrize.name}</span>
                                            <span className="task-date">¡Objetivo Final!</span>
                                            <div className="task-coins"><span>🪙</span> {grandPrize.coins}</div>
                                        </div>
                                    </div>
                                    <div className="task-card-right">
                                        <div className="task-actions">
                                            {subFilter === 'principal' ? (
                                                <>
                                                    <button className="btn-action btn-edit" onClick={() => onEditItem(grandPrize, 'grand-prize')}><i className="fa-solid fa-pen"></i></button>
                                                    <button className="btn-action btn-delete" onClick={() => onDeleteItem(grandPrize.id, 'grand-prize')}><i className="fa-solid fa-trash"></i></button>
                                                </>
                                            ) : (
                                                <button className="btn-action btn-undo" onClick={() => onUndoRedeem(grandPrize.id, 'prize')}><i className="fa-solid fa-rotate-left"></i></button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

CenterPanel.propTypes = {
    childName: PropTypes.string,
    pendingTasksCount: PropTypes.number,
    tasksList: PropTypes.array,
    couponsList: PropTypes.array,
    grandPrize: PropTypes.object,
    onApproveTask: PropTypes.func,
    onRejectTask: PropTypes.func,
    onUndoTask: PropTypes.func,
    onUndoRedeem: PropTypes.func,
    onEditItem: PropTypes.func,
    onDeleteItem: PropTypes.func,
    onCreateItem: PropTypes.func
};

export default CenterPanel;