import React, { useState, useEffect } from 'react';
import useGlobalReducer from '../../front/hooks/useGlobalReducer.jsx'; 
import LeftPanel from '../components/LeftPanel';
import CenterPanel from '../components/CenterPanel';
import RightPanel from '../components/RightPanel';
import "../style ParentDash/stylePAdmin.css";

export const ParentAdmin = () => {
    const { store } = useGlobalReducer();
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [selectedChildName, setSelectedChildName] = useState("Hijo");

    const [tasks, setTasks] = useState([]);
    const [cupones, setCupones] = useState([]);
    const [granPremio, setGranPremio] = useState(null);

    const misHijos = store.user?.children || [];

    const handleApproveTask = async (taskId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${taskId}/complete`, {
                method: 'PATCH'
            });
            if (response.ok) {
                setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: true } : t));
            }
        } catch (error) {
            console.error("Error al aprobar tarea:", error);
        }
    };

    const handleRedeem = (id, type) => {
        if (type === 'coupon') {
            setCupones(prev => prev.map(c => c.id === id ? { ...c, redeemed: true } : c));
        } else {
            setGranPremio(prev => prev ? { ...prev, redeemed: true } : null);
        }
    };

    useEffect(() => {
        if (!selectedChildId) return;

        const fetchData = async () => {
            const baseUrl = import.meta.env.VITE_BACKEND_URL;
            try {
                // Tareas
                const resT = await fetch(`${baseUrl}/api/child/${selectedChildId}/tasks`);
                if (resT.ok) {
                    const data = await resT.json();
                    setTasks(Array.isArray(data) ? data.map(t => ({ id: t.id, title: t.name, points: t.coins, done: false })) : []);
                }

                // Cupones
                const resC = await fetch(`${baseUrl}/api/child/${selectedChildId}/small-goals`);
                if (resC.ok) {
                    const data = await resC.json();
                    setCupones(Array.isArray(data) ? data.map(c => ({ ...c, redeemed: false })) : []);
                }

                // Gran Premio
                const resP = await fetch(`${baseUrl}/api/child/${selectedChildId}/grand-prize`);
                if (resP.ok) {
                    const data = await resP.json();
                    const prize = Array.isArray(data) ? data[0] : data;
                    setGranPremio(prize && prize.id ? { ...prize, redeemed: false } : null);
                }
            } catch (err) { console.error("Error cargando datos:", err); }
        };
        fetchData();
    }, [selectedChildId]);

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-content">
                <aside className="panel-left">
                    <LeftPanel 
                        parentName={store.user?.name || "Papá"} 
                        childrenProfiles={misHijos} 
                        onSelectChild={(child) => {
                            setSelectedChildId(child.id);
                            setSelectedChildName(child.name);
                        }}
                    />
                </aside>
                <main className="panel-center">
                    <CenterPanel 
                        childName={selectedChildName} 
                        pendingTasksCount={tasks.filter(t => !t.done).length} 
                        tasksList={tasks}
                        couponsList={cupones}
                        grandPrize={granPremio}
                        onApproveTask={handleApproveTask}
                        onRedeem={handleRedeem}
                    />
                </main>
                <section className="panel-right">
                    {/* Imagen por defecto también aquí para el panel derecho */}
                    <RightPanel 
                        grandPrizeName={granPremio?.name} 
                        grandPrizeImage="https://cdn-icons-png.flaticon.com/512/3112/3112946.png"
                        tasks={tasks} 
                    />
                </section>
            </div>
        </div>
    );
};