import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "../style ParentDash/styleCePanel.css";

const CenterPanel = ({ childName, pendingTasksCount }) => {
    const [activeTab, setActiveTab] = useState('Tareas');
    // Estado para controlar el filtro interno (sub-pestañas)
    const [subFilter, setSubFilter] = useState('principal'); // 'principal' o 'secundario'

    // Resetear el sub-filtro al cambiar de pestaña principal
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSubFilter('principal'); // Por defecto, al cambiar de pestaña, vuelve a la primera opción
    };

    const getActionButtonText = () => {
        switch (activeTab) {
            case 'Tareas': return 'Nueva Tarea';
            case 'Cupones': return 'Nuevo Cupón';
            case 'Gran Premio': return 'Crear Gran Premio';
            default: return '+ Nuevo';
        }
    };

    // Renderizado dinámico de los botones de sub-filtro
    const renderSubFilters = () => {
        let labels = { first: '', second: '' };

        if (activeTab === 'Tareas') {
            labels = { first: 'Por hacer', second: 'Aprobadas' };
        } else if (activeTab === 'Cupones' || activeTab === 'Gran Premio') {
            labels = { first: 'Sin canjear', second: 'Canjeado' };
        }

        return (
            <div className="filter-container">
                <div className="sub-filters-wrapper">
                    <button 
                        className={`sub-filter-btn ${subFilter === 'principal' ? 'active' : ''}`}
                        onClick={() => setSubFilter('principal')}
                    >
                        {labels.first}
                    </button>
                    <button 
                        className={`sub-filter-btn ${subFilter === 'secundario' ? 'active' : ''}`}
                        onClick={() => setSubFilter('secundario')}
                    >
                        {labels.second}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <main className="center-panel">
            <header className="center-header">
                <h2 className='tit_mission'>Misiones de {childName}</h2>
            </header>

            <section className="pending-status">
                <div className="status-card">
                    <h4>Tareas pendientes por aprobar: <strong>{pendingTasksCount}</strong></h4>
                </div>
            </section>

            <section className="mission-management">
                <h4>Gestión de Misiones</h4>
                <div className="management-grid">
                    <div className='missions-btn'>
                        <div className="left_btn">
                            <button 
                                className={`manage-item ${activeTab === 'Tareas' ? 'active' : ''}`}
                                onClick={() => handleTabChange('Tareas')}
                            >
                                Tareas
                            </button>
                            <button 
                                className={`manage-item ${activeTab === 'Cupones' ? 'active' : ''}`}
                                onClick={() => handleTabChange('Cupones')}
                            >
                                Cupones
                            </button>
                            <button 
                                className={`manage-item ${activeTab === 'Gran Premio' ? 'active' : ''}`}
                                onClick={() => handleTabChange('Gran Premio')}
                            >
                                Gran Premio
                            </button>
                        </div>

                        <div className="right_btn">
                            <button className="action-btn">
                                {getActionButtonText()}
                            </button>
                        </div>
                    </div>

                    {/* Renderizamos los nuevos botones debajo de las pestañas principales */}
                    <div className="filter-container">
                        {renderSubFilters()}
                    </div>

                    <div className='Lista'>
                        <p>
                            Mostrando: <strong>{activeTab}</strong> 
                            {subFilter === 'principal' ? ' (Pendientes/Sin canjear)' : ' (Aprobadas/Canjeados)'}
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

CenterPanel.propTypes = {
    childName: PropTypes.string.isRequired,
    pendingTasksCount: PropTypes.number.isRequired
};

export default CenterPanel;