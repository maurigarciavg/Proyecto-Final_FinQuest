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
import { LevelUpModal } from "../components/LevelUpModal"; 
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
    const [showLevelModal, setShowLevelModal] = useState(false); 
    const [rewardToast, setRewardToast] = useState(null);
    const [coinPopup, setCoinPopup] = useState(null);
    const { store } = useGlobalReducer();
    const [streakAnimationShown, setStreakAnimationShown] = useState(false);

    const loadData = async () => {
        const result = await getChildDashboard(childId);
        if (!result) {
            setError(true);
            return;
        }

        const xpNuevo = result.child.total_earned_coins || 0;
        const nivelNuevo = Math.floor(xpNuevo / 500) + 1;
        const storageKey = `last_seen_level_child_${childId}`;
        const nivelVistoAnteriormente = parseInt(localStorage.getItem(storageKey));

        if (nivelVistoAnteriormente && nivelNuevo > nivelVistoAnteriormente) {
            setShowLevelModal(true);
        }
        localStorage.setItem(storageKey, nivelNuevo);

        setData(result);

        if (result.streak_reward_given && !streakAnimationShown) {
            showRewardAnimation(result.streak_reward_amount || 10);
            setStreakAnimationShown(true);
        }
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
            const response = await fetch(`${baseUrl}api/tasks/${taskId}/validate`, { 
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ child_done: true })
            });
            if (response.ok) await loadData();
        } catch (err) {
            console.error("Error al completar tarea:", err);
        }
    };

    const handleRedeem = async (rewardId) => {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const response = await fetch(`${baseUrl}api/rewards/${rewardId}/redeem`, { method: "POST" });
            if (response.ok) {
                await loadData();
                setShowRewardModal(false);
                setRewardToast("🎁 ¡Cupón canjeado con éxito!");
                setTimeout(() => setRewardToast(null), 3000);
            }
        } catch (err) {
            console.error("Error al canjear recompensa:", err);
        }
    };

    const handleRedeemGrandPrize = async (prizeId) => {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const response = await fetch(`${baseUrl}api/grand-prize/${prizeId}/redeem`, { method: "POST" });
            if (response.ok) {
                confetti({ particleCount: 300, spread: 150, origin: { y: 0.5 } });
                await loadData();
                setRewardToast("🏆 ¡ENHORABUENA! Has conseguido tu Gran Premio.");
                setTimeout(() => setRewardToast(null), 5000);
            }
        } catch (err) {
            console.error("Error al canjear gran premio:", err);
        }
    };

    if (error) return <div className="child-dashboard">Error cargando dashboard</div>;
    if (!data) return <div className="child-dashboard">Cargando...</div>;

    const { child, tasks, rewards } = data;
    const totalXP = child.total_earned_coins || 0;
    const currentLevel = Math.floor(totalXP / 500) + 1;
    const xpInCurrentLevel = totalXP % 500;
    const levelProgress = (xpInCurrentLevel / 500) * 100;
    const xpRemaining = 500 - xpInCurrentLevel;
    const goalCoins = child.grand_prize?.coins || 1; 
    const prizeProgress = Math.min((child.total_coins / goalCoins) * 100, 100);

    const hasPlayedToday = (() => {
        if (!child.last_minigame_played_at) return false;
        const lastPlayed = new Date(child.last_minigame_played_at);
        const today = new Date();
        return lastPlayed.toDateString() === today.toDateString();
    })();

    return (
        <div className="child-dashboard">
            <div className="child-dashboard__container">
                <ChildHeader 
                    child={child} 
                    level={currentLevel} 
                    progress={levelProgress} 
                    xpRemaining={xpRemaining}
                    prizeProgress={prizeProgress} 
                />

                <main className="child-dashboard__content">
                    <section className="child-dashboard__left">
                        <div className="dashboard-panel">
                            <h1 className="dashboard-panel__title">¡Hola, {child.name}!</h1>

                            <div className="dashboard-panel__top">
                                <div className="dashboard-placeholder dashboard-placeholder--streak">
                                    <div className="dashboard-placeholder__streak-header">
                                        <h2 className="dashboard-placeholder__title">
                                            Tu racha de {child.streak} {child.streak === 1 ? "día" : "días"} 🔥
                                        </h2>
                                    </div>
                                    <div className="dashboard-streak">
                                        <div className="dashboard-streak__days">
                                            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((dia, index) => {
                                                const hoy = new Date().getDay();
                                                const hoyIndex = hoy === 0 ? 6 : hoy - 1;
                                                const diff = hoyIndex - index;
                                                const activo = diff >= 0 && diff < child.streak;
                                                return (
                                                    <div key={dia} className={`dashboard-streak__day${activo ? " dashboard-streak__day--active" : ""}`}>
                                                        <span className="dashboard-streak__check">✓</span>
                                                        <span className="dashboard-streak__label">{dia}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <img className="dashboard-streak__coins-image" src={monedas3} alt="Monedas" />
                                    </div>
                                </div>
                            </div>

                            <div className="dashboard-panel__bottom">
                                <div
                                    className="dashboard-placeholder dashboard-placeholder--shop card-hover-effect"
                                    onClick={() => setShowRewardModal(true)}
                                >
                                    <div className="dashboard-placeholder__header">
                                        <span className="dashboard-placeholder__badge">{rewards?.length || 0}</span>
                                        <h2 className="dashboard-placeholder__title">Tienda</h2>
                                    </div>
                                    <div className="dashboard-shop">
                                        <img className="dashboard-shop__image" src={tickets} alt="Tienda" />
                                        <p className="dashboard-shop__text">Canjea tus monedas</p>
                                    </div>
                                </div>

                                <div 
                                    className="task-summary-card card-hover-effect"
                                    onClick={() => setShowTaskModal(true)} 
                                >
                                    <TaskSection tasks={tasks} />
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className="child-dashboard__right">
                        <GoalSection
                            child={child}
                            prizeProgress={prizeProgress}
                            onMinigameClick={() => {
                                if (hasPlayedToday) {
                                    setRewardToast("⏳ Ya has jugado hoy. Vuelve mañana.");
                                    setTimeout(() => setRewardToast(null), 3000);
                                    return;
                                }
                                setShowGameModal(true);
                            }}
                            onRedeemPrize={() => handleRedeemGrandPrize(child.grand_prize?.id)}
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

            {rewardToast && <div className="reward-toast">{rewardToast}</div>}

            {showGameModal && <GameModal onClose={() => setShowGameModal(false)} onGameComplete={handleGameComplete} />}
            {showRewardModal && <RewardModal rewards={rewards} coins={child.total_coins} onClose={() => setShowRewardModal(false)} onRedeem={handleRedeem} />}
            {showTaskModal && <TaskModal tasks={tasks} onClose={() => setShowTaskModal(false)} onComplete={handleComplete} />}
            {showLevelModal && <LevelUpModal level={currentLevel} onClose={() => setShowLevelModal(false)} />}
        </div>
    );
};