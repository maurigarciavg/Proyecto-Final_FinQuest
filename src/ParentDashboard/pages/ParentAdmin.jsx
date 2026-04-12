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
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const response = await fetch(`${baseUrl}api/tasks/${taskId}/validate`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ approved: true })
            });

            if (response.ok) {
                const result = await response.json();
                setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: true, status: 'completed' } : t));
                console.log(`¡Aprobada! Nuevo saldo del niño: ${result.total_coins}`);
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
                const response = await fetch(`${baseUrl}api/child-dashboard/${selectedChildId}`);

                if (response.ok) {
                    const data = await response.json();


                    setTasks(data.tasks.map(t => ({
                        id: t.id,
                        title: t.name,
                        points: t.coins,
                        status: t.status,
                        done: t.status === "completed"
                    })));

                    setCupones(data.rewards.map(r => ({
                        id: r.id,
                        name: r.name,
                        coins: r.coins || r.cost,
                        redeemed: false
                    })));

                    setGranPremio(data.child.grand_prize || null);
                }
            } catch (err) {
                console.error("Error cargando datos del niño:", err);
            }
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
                        pendingTasksCount={tasks.filter(t => t.status !== "completed").length}
                        tasksList={tasks}
                        couponsList={cupones}
                        grandPrize={granPremio}
                        onApproveTask={handleApproveTask}
                        onRedeem={handleRedeem}
                    />
                </main>
                <section className="panel-right">
                    <RightPanel
                        grandPrizeName={granPremio?.name}
                        grandPrizeImage={granPremio?.image_url || "https://cdn-icons-png.flaticon.com/512/3112/3112946.png"}
                        tasks={tasks}
                    />
                </section>
            </div>
        </div>
    );
};