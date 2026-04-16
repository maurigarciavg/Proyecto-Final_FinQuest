import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChildHeader } from "../components/ChildHeader";
import { GoalSection } from "../components/GoalSection";
import { TaskSection } from "../components/TaskSection";
import { getChildDashboard } from "../services/childDashboard";
import "../styles/child-dashboard.css";
import { TaskModal } from "../components/TaskModal";
import { RewardModal } from "../components/RewardModal";
import { GameModal } from "../components/GameModal";
import monedas3 from "../assets/img/monedas3.png";
import tickets from "../assets/img/tickets.png";
import useGlobalReducer from "../hooks/useGlobalReducer";
import confetti from "canvas-confetti";

export const ChildDashboard = () => {
    const { childId } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showRewardModal, setShowRewardModal] = useState(false);
    const [showGameModal, setShowGameModal] = useState(false);
    const [rewardToast, setRewardToast] = useState(null);
    const [coinPopup, setCoinPopup] = useState(null);
    const { store } = useGlobalReducer();

    const loadData = async () => {
        const result = await getChildDashboard(childId);
        if (!result) {
            setError(true);
            return;
        }
        setData(result);
    };

    useEffect(() => {
        if (childId) {
            loadData();
        }
    }, [childId]);

    const showRewardAnimation = (amount = 30) => {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });

        setCoinPopup(`+${amount} monedas`);
        setRewardToast(`🎉 ¡Has ganado ${amount} monedas!`);

        setTimeout(() => setCoinPopup(null), 1800);
        setTimeout(() => setRewardToast(null), 3200);
    };

    const handleGameComplete = async (pointsEarned) => {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const response = await fetch(`${baseUrl}api/child/${childId}/add-coins`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + (store.token || localStorage.getItem("token"))
                },
                body: JSON.stringify({ coins: pointsEarned })
            });

            if (response.ok) {
                await loadData();
                setShowGameModal(false);
                showRewardAnimation(pointsEarned);
            }
        } catch (err) {
            console.error("Error al guardar puntos del juego:", err);
        }
    };

    const handleComplete = async (taskId) => {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const response = await fetch(
                `${baseUrl}api/tasks/${taskId}/complete`,
                { method: "PATCH" }
            );

            if (response.ok) {
                await loadData();
            }
        } catch (err) {
            console.error("Error al completar tarea:", err);
        }
    };

    const handleRedeem = async (rewardId) => {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const response = await fetch(
                `${baseUrl}api/rewards/${rewardId}/redeem`,
                { method: "POST" }
            );

            if (response.ok) {
                await loadData();
                setShowRewardModal(false);
            }
        } catch (err) {
            console.error("Error al canjear recompensa:", err);
        }
    };

    if (error) {
        return (
            <div className="child-dashboard">
                <div className="child-dashboard__container">
                    <div className="child-dashboard__state">
                        <div className="child-dashboard__message child-dashboard__message--error">
                            No se pudo cargar el dashboard del hijo.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="child-dashboard">
                <div className="child-dashboard__container">
                    <div className="child-dashboard__state">
                        <div className="child-dashboard__message">
                            <div className="child-dashboard__spinner"></div>
                            <p>Cargando tu progreso...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { child, tasks, rewards } = data;

    return (
        <div className="child-dashboard">
            <div className="child-dashboard__container">
                <ChildHeader child={child} />

                <main className="child-dashboard__content">
                    <section className="child-dashboard__left">
                        <div className="dashboard-panel">
                            <h1 className="dashboard-panel__title">
                                ¡Hola, {child.name}!
                            </h1>

                            <div className="dashboard-panel__top">
                                <div className="dashboard-placeholder dashboard-placeholder--streak">
                                    <div className="dashboard-placeholder__streak-header">
                                        <h2 className="dashboard-placeholder__title">
                                            Tu racha de {child.streak} {child.streak === 1 ? "día" : "días"} 🔥
                                        </h2>
                                    </div>

                                    <div className="dashboard-streak">
                                        <div className="dashboard-streak__days">
                                            {(() => {
                                                const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
                                                const hoy = new Date().getDay();
                                                const hoyIndex = hoy === 0 ? 6 : hoy - 1;

                                                return dias.map((dia, index) => {
                                                    const diff = hoyIndex - index;
                                                    const activo = diff >= 0 && diff < child.streak;

                                                    return (
                                                        <div
                                                            key={dia}
                                                            className={`dashboard-streak__day${activo ? " dashboard-streak__day--active" : ""}`}
                                                        >
                                                            <span className="dashboard-streak__check">✓</span>
                                                            <span className="dashboard-streak__label">{dia}</span>
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>

                                        <img
                                            className="dashboard-streak__coins-image"
                                            src={monedas3}
                                            alt="Monedas de racha"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="dashboard-panel__bottom">
                                <div
                                    className="dashboard-placeholder dashboard-placeholder--shop"
                                    onClick={() => setShowRewardModal(true)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="dashboard-placeholder__header">
                                        <span className="dashboard-placeholder__badge">
                                            {rewards?.length || 0}
                                        </span>
                                        <h2 className="dashboard-placeholder__title">Tienda</h2>
                                    </div>

                                    <div className="dashboard-shop">
                                        <img
                                            className="dashboard-shop__image"
                                            src={tickets}
                                            alt="Tickets de tienda"
                                        />
                                        <p className="dashboard-shop__text">Canjea tus monedas</p>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setShowTaskModal(true)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <TaskSection tasks={tasks} />
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className="child-dashboard__right">
                        <GoalSection
                            child={child}
                            onMinigameClick={() => setShowGameModal(true)}
                        />
                    </aside>
                </main>
            </div>

            {coinPopup && (
                <div className="coins-popup">
                    <img src={monedas3} alt="Monedas" className="coins-popup__icon" />
                    <span>{coinPopup}</span>
                </div>
            )}

            {rewardToast && (
                <div className="reward-toast">
                    {rewardToast}
                </div>
            )}

            {showGameModal && (
                <GameModal
                    onClose={() => setShowGameModal(false)}
                    onGameComplete={handleGameComplete}
                />
            )}

            {showRewardModal && (
                <RewardModal
                    rewards={rewards}
                    coins={child.total_coins}
                    onClose={() => setShowRewardModal(false)}
                    onRedeem={handleRedeem}
                />
            )}

            {showTaskModal && (
                <TaskModal
                    tasks={tasks}
                    onClose={() => setShowTaskModal(false)}
                    onComplete={handleComplete}
                />
            )}
        </div>
    );
};