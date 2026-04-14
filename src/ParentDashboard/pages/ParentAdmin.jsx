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



    // --- FUNCIONES DE GESTIÓN ---

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

                console.log(`¡Aprobada! Nuevo saldo: ${result.total_coins}`);

            }

        } catch (error) {

            console.error("Error al aprobar tarea:", error);

        }

    };



    const handleUndoTask = (taskId) => {

        setTasks(prev => prev.map(task =>

            task.id === taskId

                ? { ...task, done: false, status: 'pending', wasRejected: true }

                : task

        ));

    };



    const handleRedeem = async (id, type) => {

        const baseUrl = import.meta.env.VITE_BACKEND_URL;

        const endpoint = type === 'coupon' ? `api/coupons/${id}/redeem` : `api/prizes/${id}/redeem`;



        try {

            const response = await fetch(`${baseUrl}${endpoint}`, { method: 'POST' });

            if (response.ok) {
                if (type === 'coupon') {
                    // Esto es lo que hace que "salte" de pestaña:
                    setCupones(prev => prev.map(c =>
                        c.id === id ? { ...c, redeemed: true } : c
                    ));
                } else {
                    setGranPremio(prev => prev ? { ...prev, redeemed: true } : null);
                }
            }
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



    // --- NUEVAS: CRUD (Añadidas para que CenterPanel no falle) ---

    const handleEditItem = (id, type) => {

        console.log("Editando:", id, "en", type);

        // Aquí abrirías tu modal de edición

    };



    const handleDeleteItem = (id, type) => {

        console.log("Eliminando:", id, "de", type);

        if (type === 'Tareas') {

            setTasks(prev => prev.filter(t => t.id !== id));

        } else if (type === 'Cupones') {

            setCupones(prev => prev.filter(c => c.id !== id));

        }

        // Agrega lógica para Gran Premio si es necesario

    };



    const handleCreateItem = (type) => {

        console.log("Creando nuevo item para:", type);

        // Aquí abrirías tu modal de creación

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

                        done: t.status === "completed",

                        days: t.days || [], // Aquí llegarán tus ["L", "M", "X"]

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

                        onUndoTask={handleUndoTask}

                        onUndoRedeem={handleUndoRedeem}

                        // PASAMOS LAS PROPS QUE FALTABAN:

                        onEditItem={handleEditItem}

                        onDeleteItem={handleDeleteItem}

                        onCreateItem={handleCreateItem}

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