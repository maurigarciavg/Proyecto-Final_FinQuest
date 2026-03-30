import React from 'react';
import LeftPanel from '../components/LeftPanel';
import CenterPanel from '../components/CenterPanel';
import RightPanel from '../components/RightPanel';

export const ParentAdmin = () => { // Nota: Sugiero Mayúscula inicial para componentes
    // Datos de prueba
    const misHijos = [
        { id: 1, name: "Hijo 1" },
        { id: 2, name: "Hijo 2" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
                <aside className="lg:col-span-3 space-y-6">
                    {/* Pasamos las props necesarias */}
                    <LeftPanel parentName="Papá Pérez" childrenProfiles={misHijos} />
                </aside>

                <main className="lg:col-span-6 space-y-8">
                    {/* Pasamos las props necesarias */}
                    <CenterPanel childName="Hijo 1" pendingTasksCount={3} />
                </main>

                <section className="lg:col-span-3 space-y-6">
                    <RightPanel grandPrizeName="Cine en familia" />
                </section>
            </div>
        </div>
    );
};