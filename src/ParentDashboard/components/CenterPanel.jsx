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
    onUndoTask,
    onUndoRedeem,
    onEditItem,
    onDeleteItem,
    onCreateItem
}) => {
    const [activeTab, setActiveTab] = useState('Tareas');
    const [subFilter, setSubFilter] = useState('principal');
    const panelRef = useRef(null);

    const badgeBaseStyle = { fontSize: '0.7rem', padding: '3px 10px', borderRadius: '12px', fontWeight: '600', marginLeft: '10px', display: 'inline-block', verticalAlign: 'middle', border: 'none' };
    const dateLabelStyle = { fontSize: '0.72rem', color: '#888', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' };
    const undoButtonStyle = { background: 'none', border: 'none', color: '#ff0019', cursor: 'pointer', padding: '5px' };

    const statusStyles = {
        aprobada: { bg: "#eafaf1", color: "#28a745", label: "Aprobada" },
        desaprobada: { bg: "#fdf2f2", color: "#dc3545", label: "Desaprobada" },
        pendiente: { bg: "#fff9db", color: "#f08c00", label: "Pendiente" },
        porHacer: { bg: "#e7f5ff", color: "#007bff", label: "Por hacer" }
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return "Sin fecha";
        const d = new Date(dateValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const taskDate = new Date(d);
        taskDate.setHours(0, 0, 0, 0);
        const diffTime = taskDate - today;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays === 0) return "Hoy";
        if (diffDays === 1) return "Mañana";
        if (diffDays === -1) return "Ayer";
        return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSubFilter('principal');
    };

    const getCreateButtonLabel = () => {
        switch (activeTab) {
            case 'Tareas': return '+ Añadir Tarea';
            case 'Cupones': return '+ Añadir Cupón';
            case 'Gran Premio': return grandPrize ? 'Editar Gran Premio' : '+ Añadir Gran Premio';
            default: return `Nuevo ${activeTab}`;
        }
    };

    // 🟢 VALIDACIÓN: Bloqueo si no hay perfil marcado
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
                <h2>Misiones de {childName}</h2>
            </header>

            <section className="pending-status">
                <div className="status-card">
                    <h4>Pendientes de validar: <strong>{pendingTasksCount}</strong></h4>
                    <div className="quick-approve-list" style={{ marginTop: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                        {tasksList.filter(t => t.status === "pending_validation").map(t => (
                            <div key={t.id} className="task-row-item quick-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 8px', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.4rem' }}>{getTaskIcon(t.title)}</span>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{t.title}</span>
                                            <span style={{ ...badgeBaseStyle, backgroundColor: statusStyles.pendiente.bg, color: statusStyles.pendiente.color }}>Pendiente</span>
                                        </div>
                                        <span style={dateLabelStyle}><i className="fa-regular fa-calendar"></i> {formatDate(t.date)}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>🪙 {t.points}</span>
                                    <button onClick={() => onApproveTask(t.id)} style={{ padding: '4px 10px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #32a89b', backgroundColor: '#fff', color: '#32a89b', fontWeight: 'bold' }}>Aprobar</button>
                                </div>
                            </div>
                        ))}
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
                        <button className="add-mission-btn" onClick={() => onCreateItem(activeTab)} style={{ backgroundColor: '#3dc9b6', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {getCreateButtonLabel()}
                        </button>
                    </div>

                    <div className="filter-container">
                        <div className="sub-filters-wrapper">
                            <button className={`sub-filter-btn ${subFilter === 'principal' ? 'active' : ''}`} onClick={() => setSubFilter('principal')}>
                                {activeTab === 'Tareas' ? 'Por hacer' : 'Disponibles'}
                            </button>
                            <button className={`sub-filter-btn ${subFilter === 'secundario' ? 'active' : ''}`} onClick={() => setSubFilter('secundario')}>
                                {activeTab === 'Tareas' ? 'Aprobadas' : 'Canjeados'}
                            </button>
                        </div>
                    </div>

                    <div className='Lista'>
                        {activeTab === 'Tareas' && tasksList
                            .filter(t => subFilter === 'principal' ? (!t.done && t.status !== 'pending_validation') : t.done)
                            .map(t => (
                                <div key={t.id} className="task-row-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 10px', borderBottom: '1px solid #eee' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '1.6rem' }}>{getTaskIcon(t.title)}</span>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '600' }}>{t.title}</span>
                                            <span style={dateLabelStyle}><i className="fa-regular fa-calendar"></i> {formatDate(t.date)}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span>🪙 {t.points}</span>
                                        {subFilter === 'principal' ? (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => onEditItem(t, 'Tareas')} style={{ background: '#f0fdfa', border: 'none', color: '#32a89b', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}><i className="fa-solid fa-pen"></i></button>
                                                <button onClick={() => onDeleteItem(t.id, 'Tareas')} style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => onUndoTask(t.id)} style={undoButtonStyle}><i className="fa-solid fa-rotate-left"></i></button>
                                        )}
                                    </div>
                                </div>
                            ))}

                        {activeTab === 'Cupones' && couponsList
                            .filter(c => subFilter === 'principal' ? !c.redeemed : c.redeemed)
                            .map(c => (
                                <div key={c.id} className="task-row-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 10px', borderBottom: '1px solid #eee' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '1.6rem' }}>{getCouponIcon(c.name)}</span>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '600' }}>{c.name}</span>
                                            <span style={dateLabelStyle}><i className="fa-regular fa-calendar"></i> {formatDate(c.date)}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span>🪙 {c.coins}</span>
                                        {subFilter === 'principal' ? (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => onEditItem(c, 'Cupones')} style={{ background: '#f0fdfa', border: 'none', color: '#32a89b', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}><i className="fa-solid fa-pen"></i></button>
                                                <button onClick={() => onDeleteItem(c.id, 'Cupones')} style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => onUndoRedeem(c.id, 'coupon')} style={undoButtonStyle}><i className="fa-solid fa-rotate-left"></i></button>
                                        )}
                                    </div>
                                </div>
                            ))}

                        {activeTab === 'Gran Premio' && grandPrize && (
                            ((subFilter === 'principal' && !grandPrize.redeemed) || (subFilter === 'secundario' && grandPrize.redeemed)) && (
                                <div className="task-row-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 10px', borderBottom: '1px solid #eee' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '1.6rem' }}>{getGrandPrizeIcon(grandPrize.name)}</span>
                                        <span style={{ fontWeight: '600' }}>{grandPrize.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span>🪙 {grandPrize.coins}</span>
                                        {subFilter === 'principal' ? (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => onEditItem(grandPrize, 'Gran Premio')} style={{ background: '#f0fdfa', border: 'none', color: '#32a89b', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}><i className="fa-solid fa-pen"></i></button>
                                                <button onClick={() => onDeleteItem(grandPrize.id, 'Gran Premio')} style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => onUndoRedeem(grandPrize.id, 'prize')} style={undoButtonStyle}><i className="fa-solid fa-rotate-left"></i></button>
                                        )}
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
    onUndoTask: PropTypes.func,
    onUndoRedeem: PropTypes.func,
    onEditItem: PropTypes.func,
    onDeleteItem: PropTypes.func,
    onCreateItem: PropTypes.func
};

export default CenterPanel;