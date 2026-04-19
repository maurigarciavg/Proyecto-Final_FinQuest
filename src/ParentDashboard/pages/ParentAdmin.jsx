import React, { useState, useEffect } from 'react';
import useGlobalReducer from '../../front/hooks/useGlobalReducer.jsx';
import LeftPanel from '../components/LeftPanel';
import CenterPanel from '../components/CenterPanel';
import RightPanel from '../components/RightPanel';
import { EntityManager } from "../../front/components/EntityManager";
import { EditItemModal } from "../../front/components/EditItemModal";
import "../style ParentDash/stylePAdmin.css";

export const ParentAdmin = () => {
    const { store } = useGlobalReducer();
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [selectedChildName, setSelectedChildName] = useState(""); // 🟢 Reseteado

    const [tasks, setTasks] = useState([]);
    const [cupones, setCupones] = useState([]);
    const [granPremio, setGranPremio] = useState(null);

    const [showManager, setShowManager] = useState(false);
    const [managerType, setManagerType] = useState("");

    const [showEditModal, setShowEditModal] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);

    const misHijos = store.user?.children || [];

    const fetchData = async () => {
        if (!selectedChildId) return;
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
                    done: t.status === "completed",
                    days: t.days || [],
                    date: t.date || null
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
            console.error("Error cargando datos:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedChildId]);

    const handleApproveTask = async (taskId) => {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const response = await fetch(`${baseUrl}api/tasks/${taskId}/validate`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ approved: true })
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error al aprobar tarea:", error);
        }
    };

    // 🟢 ACTUALIZADO: Ahora llama al backend para quitar puntos
    const handleUndoTask = async (taskId) => {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const response = await fetch(`${baseUrl}api/tasks/${taskId}/rollback`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error al revertir tarea:", error);
        }
    };

    const handleRedeem = async (id, type) => {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const endpoint = type === 'coupon' ? `api/coupons/${id}/redeem` : `api/prizes/${id}/redeem`;
        try {
            const response = await fetch(`${baseUrl}${endpoint}`, { method: 'POST' });
            if (response.ok) fetchData();
        } catch (error) {
            console.error("Error al canjear:", error);
        }
    };

    const handleUndoRedeem = (id, type) => {
        if (type === 'coupon') {
            setCupones(prev => prev.map(c => c.id === id ? { ...c, redeemed: false } : c));
        } else if (type === 'prize') {
            setGranPremio(prev => prev ? { ...prev, redeemed: false } : null);
        }
    };

    const handleEditItem = (item, type) => {
        setItemToEdit({ ...item, type });
        setShowEditModal(true);
    };

    const handleDeleteItem = async (id, type) => {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const session = JSON.parse(localStorage.getItem("jwt-example-session") || "{}");

        let endpoint = "";
        if (type === 'Tareas') endpoint = `api/tasks/${id}`;
        else if (type === 'Cupones') endpoint = `api/small-goals/${id}`;
        else if (type === 'Gran Premio') endpoint = `api/grand-prize/${id}`;

        try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${session.token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    const handleCreateItem = (type) => {
        if (!selectedChildId) return; // 🟢 Seguridad
        setManagerType(type);
        setShowManager(true);
    };

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
                        pendingTasksCount={tasks.filter(t => t.status === "pending_validation").length}
                        tasksList={tasks}
                        couponsList={cupones}
                        grandPrize={granPremio}
                        onApproveTask={handleApproveTask}
                        onRedeem={handleRedeem}
                        onUndoTask={handleUndoTask}
                        onUndoRedeem={handleUndoRedeem}
                        onEditItem={handleEditItem}
                        onDeleteItem={handleDeleteItem}
                        onCreateItem={handleCreateItem}
                    />
                </main>

                <section className="panel-right">
                    <RightPanel
                        grandPrizeName={granPremio?.name}
                        grandPrizeImage={granPremio?.image_url}
                        tasks={tasks}
                    />
                </section>
            </div>

            {showManager && (
                <EntityManager
                    type={managerType}
                    childId={selectedChildId}
                    onClose={() => setShowManager(false)}
                    onSave={() => fetchData()}
                />
            )}

            {showEditModal && (
                <EditItemModal
                    item={itemToEdit}
                    type={itemToEdit.type}
                    onClose={() => setShowEditModal(false)}
                    onSave={() => fetchData()}
                />
            )}
        </div>
    );
};