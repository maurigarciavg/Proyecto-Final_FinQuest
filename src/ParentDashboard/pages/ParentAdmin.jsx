import React from 'react';
import LeftPanel from '../components/LeftPanel';
import CenterPanel from '../components/CenterPanel';
import RightPanel from '../components/RightPanel';
import "../style ParentDash/stylePAdmin.css";

export const ParentAdmin = () => { // Nota: Sugiero Mayúscula inicial para componentes
    // Datos de prueba
    const misHijos = [
        { id: 1, name: "Hijo 1" },
        { id: 2, name: "Hijo 2" }
    ];


    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-content">
                {/* 1. Left Panel (25%) */}
                <aside className="panel-left">
                    <div className="card-container">
                        <LeftPanel parentName="Papá Pérez" childrenProfiles={misHijos} />
                    </div>
                </aside>

                {/* 2. Center Panel (50%) */}
                <main className="panel-center">
                    <div>
                        <CenterPanel childName="Hijo 1" pendingTasksCount={3} />
                    </div>
                </main>

                {/* 3. Right Panel (25%) */}
                <section className="panel-right">
                    <div className="card-container">
                        <RightPanel grandPrizeName="Cine en familia" />
                    </div>
                </section>
            </div>
        </div>
    );
};