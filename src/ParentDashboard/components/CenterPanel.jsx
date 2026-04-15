import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getTaskIcon } from "../../front/Utils/getTaskIcon"; // 🟢 Importamos la función mágica
import "../style ParentDash/styleCePanel.css";

const CenterPanel = ({
    childName,
    pendingTasksCount,
    tasksList = [],
    couponsList = [],
    grandPrize = null,
    onApproveTask,
    onRedeem,
    onUndoTask,
    onUndoRedeem,
    onEditItem,
    onDeleteItem,
    onCreateItem
}) => {
    const [activeTab, setActiveTab] = useState('Tareas');
    const [subFilter, setSubFilter] = useState('principal');
    const [selectedItemId, setSelectedItemId] = useState(null);
    const panelRef = useRef(null);

    // --- PALETA DE COLORES UNIFICADA ---
    const statusStyles = {
        aprobada: { bg: "#eafaf1", color: "#28a745", label: "Aprobada" },
        desaprobada: { bg: "#fdf2f2", color: "#dc3545", label: "Desaprobada" },
        pendiente: { bg: "#fff9db", color: "#f08c00", label: "Pendiente" },
        porHacer: { bg: "#e7f5ff", color: "#007bff", label: "Por hacer" }
    };

    /**
     * CORRECCIÓN: Ahora solo formatea la fecha asignada a la tarea/instancia.
     * Se eliminó el fallback a la fecha de creación o fecha actual.
     */
    const formatDate = (dateValue) => {
        if (!dateValue) return "Sin fecha";
        const d = new Date(dateValue);
        return d.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: 'short',
            year: 'numeric'
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) setSelectedItemId(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSubFilter('principal');
        setSelectedItemId(null);
    };

    const handleSelectItem = (e, id) => {
        e.stopPropagation();
        setSelectedItemId(prev => prev === id ? null : id);
    };

    const getCreateButtonLabel = () => {
        switch (activeTab) {
            case 'Tareas': return 'Nueva Tarea';
            case 'Cupones': return 'Nuevo Cupón';
            case 'Gran Premio': return 'Nuevo Gran Premio';
            default: return `Nuevo ${activeTab}`;
        }
    };

    const renderSubFilters = () => {
        let labels = activeTab === 'Tareas' ? { f: 'Por hacer', s: 'Aprobadas' } : { f: 'Por canjear', s: 'Canjeado' };
        return (
            <div className="filter-container">
                <div className="sub-filters-wrapper">
                    <button className={`sub-filter-btn ${subFilter === 'principal' ? 'active' : ''}`} onClick={() => {setSubFilter('principal'); setSelectedItemId(null);}}>{labels.f}</button>
                    <button className={`sub-filter-btn ${subFilter === 'secundario' ? 'active' : ''}`} onClick={() => {setSubFilter('secundario'); setSelectedItemId(null);}}>{labels.s}</button>
                </div>
            </div>
        );
    };

    const badgeBaseStyle = { fontSize: '0.7rem', padding: '3px 10px', borderRadius: '12px', fontWeight: '600', marginLeft: '10px', display: 'inline-block', verticalAlign: 'middle', border: 'none' };
    const dateLabelStyle = { fontSize: '0.72rem', color: '#888', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' };
    const undoButtonStyle = { background: 'none', border: 'none', color: '#ff0019', cursor: 'pointer', padding: '5px' };
    const redeemButtonStyle = { padding: '4px 12px', cursor: 'pointer', borderRadius: '4px', border: 'none', backgroundColor: '#3dc9b6', color: '#fff', fontSize: '0.85rem', fontWeight: 'bold' };

    return (
        <main className="center-panel" ref={panelRef}>
            <header className="center-header">
                <h2>Misiones de {childName}</h2>
            </header>

            <section className="pending-status">
                <div className="status-card">
                    <h4>Pendientes: <strong>{pendingTasksCount}</strong></h4>
                    <div className="quick-approve-list" style={{ marginTop: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                        {tasksList.filter(t => !t.done).map(t => (
                            <div key={t.id} className="task-row-item quick-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {/* 🟢 Emoji en la lista rápida */}
                                    <span style={{ fontSize: '1.2rem' }}>{getTaskIcon(t.title)}</span>
                                    <span>{t.title}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>🪙 {t.points}</span>
                                    <button onClick={() => onApproveTask(t.id)} style={{ padding: '2px 8px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #32a89b', backgroundColor: '#fff', color: '#32a89b' }}>
                                        Aprobar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mission-management">
                <div className="management-grid">
                    <div className='missions-btn'>
                        <div className="left_btn">
                            {['Tareas', 'Cupones', 'Gran Premio'].map(tab => (
                                <button key={tab} className={`manage-item ${activeTab === tab ? 'active' : ''}`} onClick={() => handleTabChange(tab)}>{tab}</button>
                            ))}
                        </div>
                        <div className="action-buttons-container">
                            {selectedItemId && subFilter === 'principal' ? (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="delete-btn" onClick={() => { onDeleteItem(selectedItemId, activeTab); setSelectedItemId(null); }} style={{ backgroundColor: '#ff0019', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                                    <button className="edit-btn" onClick={() => onEditItem(selectedItemId, activeTab)} style={{ backgroundColor: '#3dc9b6', color: "white", border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}><i className="fa-solid fa-pen"></i></button>
                                </div>
                            ) : (
                                <button 
                                    className="add-mission-btn" 
                                    onClick={() => onCreateItem(activeTab)} 
                                    style={{ backgroundColor: '#3dc9b6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}
                                >
                                    {getCreateButtonLabel()}
                                </button>
                            )}
                        </div>
                    </div>

                    {renderSubFilters()}

                    <div className='Lista'>
                        {/* --- TAREAS --- */}
                        {activeTab === 'Tareas' && tasksList.filter(t => subFilter === 'principal' ? !t.done : t.done).map(t => (
                            <div
                                key={t.id}
                                onClick={(e) => handleSelectItem(e, t.id)}
                                className={`task-row-item ${selectedItemId === t.id ? 'selected-item' : ''}`}
                                style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer',
                                    backgroundColor: selectedItemId === t.id ? '#e9f7f6' : 'transparent'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {/* 🟢 Emoji dinámico en la lista principal de tareas */}
                                    <span style={{ fontSize: '1.5rem', minWidth: '30px' }}>{getTaskIcon(t.title)}</span>
                                    <div>
                                        <span>{t.title}</span>
                                        {subFilter === 'principal' ? (
                                            <span style={{ ...badgeStyle, backgroundColor: t.wasRejected ? '#fff0f0' : '#f8f9fa', color: t.wasRejected ? '#ff0019' : '#6c757d' }}>
                                                {t.wasRejected ? 'Desaprobada' : 'Por hacer'}
                                            </span>
                                        ) : (
                                            <span style={{ ...badgeStyle, backgroundColor: '#e7f5ff', color: '#007bff' }}>Aprobada</span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span>🪙 {t.points}</span>
                                    {subFilter === 'secundario' && (
                                        <button onClick={(e) => { e.stopPropagation(); onUndoTask(t.id); }} style={undoButtonStyle}><i className="fa-solid fa-rotate-left"></i></button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* --- CUPONES --- */}
                        {activeTab === 'Cupones' && couponsList.filter(c => subFilter === 'principal' ? !c.redeemed : c.redeemed).map(c => (
                            <div
                                key={c.id}
                                onClick={(e) => handleSelectItem(e, c.id)}
                                className="task-row-item"
                                style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer',
                                    backgroundColor: selectedItemId === c.id ? '#e9f7f6' : 'transparent'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '1.5rem', minWidth: '30px' }}>🎟️</span>
                                    <div>
                                        <span>{c.name}</span>
                                        <span style={{ ...badgeStyle, backgroundColor: c.redeemed ? '#e6fffa' : '#fff9db', color: c.redeemed ? '#3dc9b6' : '#f08c00' }}>
                                            {c.redeemed ? 'Canjeado' : 'Por canjear'}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span>🪙 {c.coins}</span>
                                    {subFilter === 'principal' ? (
                                        <button onClick={(e) => { e.stopPropagation(); onRedeem(c.id, 'coupon'); }} style={{ ...redeemButtonStyle, borderRadius: '100px' }}>Canjear</button>
                                    ) : (
                                        <button onClick={(e) => { e.stopPropagation(); onUndoRedeem(c.id, 'coupon'); }} style={undoButtonStyle}><i className="fa-solid fa-rotate-left"></i></button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* --- GRAN PREMIO --- */}
                        {activeTab === 'Gran Premio' && grandPrize && (
                            ((subFilter === 'principal' && !grandPrize.redeemed) || (subFilter === 'secundario' && grandPrize.redeemed)) && (
                                <div
                                    key={grandPrize.id}
                                    onClick={(e) => handleSelectItem(e, grandPrize.id)}
                                    className="task-row-item"
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer',
                                        backgroundColor: selectedItemId === grandPrize.id ? '#fff3cd' : 'transparent'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '1.5rem', minWidth: '30px' }}>🏆</span>
                                        <div>
                                            <span>{grandPrize.name}</span>
                                            <span style={{ ...badgeStyle, backgroundColor: grandPrize.redeemed ? '#e6fffa' : '#fff9db', color: grandPrize.redeemed ? '#32a89b' : '#f08c00' }}>
                                                {grandPrize.redeemed ? 'Canjeado' : 'Por canjear'}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span>🪙 {grandPrize.coins}</span>
                                        {subFilter === 'principal' ? (
                                            <button onClick={(e) => { e.stopPropagation(); onRedeem(grandPrize.id, 'prize'); }} style={{ ...redeemButtonStyle, borderRadius: '100px', backgroundColor: '#4dbfb6', color: '#FFFFFF' }}>Canjear</button>
                                        ) : (
                                            <button onClick={(e) => { e.stopPropagation(); onUndoRedeem(grandPrize.id, 'prize'); }} style={undoButtonStyle}><i className="fa-solid fa-rotate-left"></i></button>
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
    onRedeem: PropTypes.func,
    onUndoTask: PropTypes.func,
    onUndoRedeem: PropTypes.func,
    onEditItem: PropTypes.func,
    onDeleteItem: PropTypes.func,
    onCreateItem: PropTypes.func
};

export default CenterPanel;