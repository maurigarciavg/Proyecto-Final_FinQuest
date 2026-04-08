import React, { useState } from 'react';
import LeftPanel from '../components/LeftPanel';
import CenterPanel from '../components/CenterPanel';
import RightPanel from '../components/RightPanel';
import "../style ParentDash/stylePAdmin.css";

export const ParentAdmin = () => {
    // 1. Datos de los hijos
    const misHijos = [
    { id: 1, name: "Hijo 1", lastConnection: new Date() }, // Si usas fechas
    { id: 2, name: "Hijo 2", lastConnection: new Date() }
];

   
    const [tasks, setTasks] = useState([
        { id: 101, title: "Lavar platos", date: "2026-04-06", points: 10 },
        { id: 102, title: "Hacer la cama", date: "2026-04-06", points: 5 },
        { id: 103, title: "Estudiar", date: "2026-04-07", points: 20 },
    ]);

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-content">
                
                {/* 1. Left Panel (Identidad y Selección) */}
                <aside className="panel-left">
                    <div className="card-container">
                        <LeftPanel parentName="Papá Pérez" childrenProfiles={misHijos} />
                    </div>
                </aside>

                {/* 2. Center Panel (Gestión de Tareas) */}
                <main className="panel-center">
                    <div className="card-container">
                        <CenterPanel childName="Hijo 1" pendingTasksCount={3} />
                    </div>
                </main>

                {/* 3. Right Panel (Premios y Calendario con Tareas) */}
                <section className="panel-right">
                    <div className="card-container">
                        <RightPanel 
                            grandPrizeName="Cine en familia" 
                            tasks={tasks} 
                        />
                    </div>
                </section>

            </div>
        </div>
    );
};