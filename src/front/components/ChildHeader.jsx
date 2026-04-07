import React from "react";

export const ChildHeader = ({ child }) => {
    return (
        <section className="child-topbar">
            <div className="child-topbar__profile">
                <div className="child-topbar__avatar">🦁</div>
                <div>
                    <p className="child-topbar__label">Perfil</p>
                    <h2 className="child-topbar__name">{child.name}</h2>
                </div>
            </div>

            <div className="child-topbar__stats">
                <div className="child-topbar__stat">
                    <div className="child-topbar__stat-head">
                        <span className="child-topbar__stat-title">
                            Nivel {child.level} 👑
                        </span>
                    </div>
                    <div className="progress-track">
                        <div className="progress-fill progress-fill--level" style={{ width: "78%" }}></div>
                    </div>
                </div>

                <div className="child-topbar__stat">
                    <div className="child-topbar__stat-head">
                        <span className="child-topbar__stat-title">
                            🪙 {child.coins} Monedas
                        </span>
                    </div>
                    <div className="progress-track">
                        <div
                            className="progress-fill progress-fill--coins"
                            style={{ width: `${Math.min(child.progress, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </section>
    );
};