import React, { useEffect, useState } from "react";
import { ChildHeader } from "../components/ChildHeader";
import { GoalSection } from "../components/GoalSection";
import { TaskSection } from "../components/TaskSection";
import { getChildDashboard } from "../services/childDashboard";
import "../styles/child-dashboard.css";

export const ChildDashboard = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const result = await getChildDashboard(1);

            if (!result) {
                setError(true);
                return;
            }

            setData(result);
        };

        loadData();
    }, []);

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

    const { child, tasks } = data;

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
                                            Tu racha de 3 días seguidos 🔥
                                        </h2>
                                    </div>

                                    <div className="dashboard-streak">
                                        <div className="dashboard-streak__days">
                                            <div className="dashboard-streak__day dashboard-streak__day--active">
                                                <span className="dashboard-streak__check">✓</span>
                                                <span className="dashboard-streak__label">Lun</span>
                                            </div>

                                            <div className="dashboard-streak__day dashboard-streak__day--active">
                                                <span className="dashboard-streak__check">✓</span>
                                                <span className="dashboard-streak__label">Mar</span>
                                            </div>

                                            <div className="dashboard-streak__day dashboard-streak__day--active">
                                                <span className="dashboard-streak__check">✓</span>
                                                <span className="dashboard-streak__label">Mié</span>
                                            </div>

                                            <div className="dashboard-streak__day">
                                                <span className="dashboard-streak__check">✓</span>
                                                <span className="dashboard-streak__label">Jue</span>
                                            </div>

                                            <div className="dashboard-streak__day">
                                                <span className="dashboard-streak__check">✓</span>
                                                <span className="dashboard-streak__label">Vie</span>
                                            </div>

                                            <div className="dashboard-streak__day">
                                                <span className="dashboard-streak__check">✓</span>
                                                <span className="dashboard-streak__label">Sáb</span>
                                            </div>

                                            <div className="dashboard-streak__day">
                                                <span className="dashboard-streak__check">✓</span>
                                                <span className="dashboard-streak__label">Dom</span>
                                            </div>
                                        </div>

                                        <div className="dashboard-streak__coins">🪙</div>
                                    </div>
                                </div>
                            </div>

                            <div className="dashboard-panel__bottom">
                                <div className="dashboard-placeholder dashboard-placeholder--shop">
                                    <div className="dashboard-placeholder__header">
                                        <span className="dashboard-placeholder__badge">1</span>
                                        <h2 className="dashboard-placeholder__title">
                                            Tienda
                                        </h2>
                                    </div>

                                    <div className="dashboard-shop">
                                        <div className="dashboard-shop__image">🎟️</div>
                                        <p className="dashboard-shop__text">
                                            Entradas al cine y más
                                        </p>
                                    </div>
                                </div>

                                <TaskSection tasks={tasks} />
                            </div>
                        </div>
                    </section>

                    <aside className="child-dashboard__right">
                        <GoalSection child={child} />
                    </aside>
                </main>
            </div>
        </div>
    );
};