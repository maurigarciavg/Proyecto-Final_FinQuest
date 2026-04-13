import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "../style ParentDash/styleCePanel.css";

const CenterPanel = ({ 
    childName, 
    pendingTasksCount, 
    tasksList = [], 
    couponsList = [], 
    grandPrize = null, 
    onApproveTask,
    onRedeem 
}) => {
    const [activeTab, setActiveTab] = useState('Tareas');
    const [subFilter, setSubFilter] = useState('principal'); 

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSubFilter('principal'); 
    };

    const renderSubFilters = () => {
        let labels = activeTab === 'Tareas' ? { f: 'Por hacer', s: 'Aprobadas' } : { f: 'Sin canjear', s: 'Canjeado' };
        return (
            <div className="filter-container">
                <div className="sub-filters-wrapper">
                    <button className={`sub-filter-btn ${subFilter === 'principal' ? 'active' : ''}`} onClick={() => setSubFilter('principal')}>{labels.f}</button>
                    <button className={`sub-filter-btn ${subFilter === 'secundario' ? 'active' : ''}`} onClick={() => setSubFilter('secundario')}>{labels.s}</button>
                </div>
            </div>
        );
    };

    // Imagen por defecto para evitar errores de carga
    const defaultPrizeImg = "https://cdn-icons-png.flaticon.com/512/3112/3112946.png";

    return (
        <main className="center-panel">
            <header className="center-header"><h2>Misiones de {childName}</h2></header>
            <section className="pending-status"><div className="status-card"><h4>Pendientes: <strong>{pendingTasksCount}</strong></h4></div></section>
            <section className="mission-management">
                <div className="management-grid">
                    <div className='missions-btn'>
                        <div className="left_btn">
                            {['Tareas', 'Cupones', 'Gran Premio'].map(tab => (
                                <button key={tab} className={`manage-item ${activeTab === tab ? 'active' : ''}`} onClick={() => handleTabChange(tab)}>{tab}</button>
                            ))}
                        </div>
                    </div>
                    {renderSubFilters()}
                    <div className='Lista'>
                        {/* Tareas */}
                        {activeTab === 'Tareas' && tasksList.filter(t => subFilter === 'principal' ? !t.done : t.done).map(t => (
                            <div key={t.id} className="task-row-item" style={{display:'flex', justifyContent:'space-between', padding:'10px', borderBottom:'1px solid #eee'}}>
                                <span>{t.title}</span>
                                <div><span>🪙 {t.points}</span> {subFilter === 'principal' && <button onClick={() => onApproveTask(t.id)}>Aprobar</button>}</div>
                            </div>
                        ))}
                        {/* Cupones */}
                        {activeTab === 'Cupones' && couponsList.filter(c => subFilter === 'principal' ? !c.redeemed : c.redeemed).map(c => (
                            <div key={c.id} className="task-row-item" style={{display:'flex', justifyContent:'space-between', padding:'10px', borderBottom:'1px solid #eee'}}>
                                <span>{c.name}</span>
                                <div><span>🪙 {c.coins}</span> {subFilter === 'principal' && <button onClick={() => onRedeem(c.id, 'coupon')}>Canjear</button>}</div>
                            </div>
                        ))}
                        {/* Gran Premio - Corregido 'grandPrize' */}
                        {activeTab === 'Gran Premio' && grandPrize && ((subFilter === 'principal' && !grandPrize.redeemed) || (subFilter === 'secundario' && grandPrize.redeemed)) && (
                            <div className="task-row-item" style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px', borderBottom:'1px solid #eee'}}>
                                <div style={{display:'flex', alignItems:'center'}}>
                                    <img src={defaultPrizeImg} alt="prize" style={{width:'30px', marginRight:'10px'}} />
                                    <span>{grandPrize.name}</span>
                                </div>
                                <div><span>🪙 {grandPrize.coins}</span> {subFilter === 'principal' && <button onClick={() => onRedeem(grandPrize.id, 'prize')}>Canjear Final</button>}</div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

CenterPanel.propTypes = {
    childName: PropTypes.string.isRequired,
    pendingTasksCount: PropTypes.number.isRequired,
    tasksList: PropTypes.array,
    couponsList: PropTypes.array,
    grandPrize: PropTypes.object,
    onApproveTask: PropTypes.func,
    onRedeem: PropTypes.func
};

export default CenterPanel;

