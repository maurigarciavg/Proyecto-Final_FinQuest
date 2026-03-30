import React, { useState } from 'react'; // 1. Importamos useState
import PropTypes from 'prop-types';
import "../style ParentDash/styleCePanel.css";

const CenterPanel = ({ childName, pendingTasksCount }) => {
    // 2. Definimos el estado para la pestaña activa (por defecto 'Tareas')
    const [activeTab, setActiveTab] = useState('Tareas');

    // 3. Función para determinar qué texto mostrar en el botón de acción
    const getActionButtonText = () => {
        switch (activeTab) {
            case 'Tareas': return '+ Nueva Tarea';
            case 'Cupones': return '+ Nuevo Cupón';
            case 'Gran Premio': return '+ Crear Gran Premio';
            default: return '+ Nuevo';
        }
    };

    return (
        <main className="center-panel">
            {/* 1. Titular */}
            <header className="center-header">
                <h1>Misiones de {childName}</h1>
            </header>

            {/* 2. Alerta de tareas */}
            <section className="pending-status">
                <div className="status-card">
                    <p>Tareas pendientes por aprobar: <strong>{pendingTasksCount}</strong></p>
                </div>
            </section>

            {/* 3. Gestión de Misiones */}
            <section className="mission-management">
                <h3>Gestión de Misiones</h3>
                <div className="management-grid">
                    <div className='missions-btn'>
                        <div className="left_btn">
                            {/* 4. Agregamos onClick para cambiar la pestaña y una clase 'active' para CSS */}
                            <button 
                                className={`manage-item ${activeTab === 'Tareas' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Tareas')}
                            >
                                Tareas
                            </button>
                            <button 
                                className={`manage-item ${activeTab === 'Cupones' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Cupones')}
                            >
                                Cupones
                            </button>
                            <button 
                                className={`manage-item ${activeTab === 'Gran Premio' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Gran Premio')}
                            >
                                Gran Premio
                            </button>
                        </div>

                        <div className="right_btn">
                            {/* 5. El botón ahora cambia dinámicamente */}
                            <button className="action-btn">
                                {getActionButtonText()}
                            </button>
                        </div>
                    </div>

                    <div className='Lista'>
                        {/* Aquí podrías mostrar contenido diferente según activeTab */}
                        <p>Mostrando lista de: {activeTab}</p>
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