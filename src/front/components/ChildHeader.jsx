import React from "react";
import defaultAvatar from "../assets/img/logo.png";
import monedasIcon from "../assets/img/monedas.png";

export const ChildHeader = ({ child }) => {
    const avatarSource = child.avatar ? child.avatar : defaultAvatar;

    return (
        <section className="child-topbar">
            <div className="child-topbar__profile">
                <img
                    className="child-topbar__avatar"
                    src={avatarSource}
                    alt={`Perfil de ${child.name || "usuario"}`}
                    onError={(e) => { e.target.src = defaultAvatar; }}
                />
                <div>
                    <p className="child-topbar__label">Perfil</p>
                    <h2 className="child-topbar__name">{child.name || "Perfil"}</h2>
                </div>
            </div>

            <div className="child-topbar__stats">
                {/* NIVEL */}
                <div className="child-topbar__stat">
                    <div className="child-topbar__stat-head">
                        <span className="child-topbar__stat-title">
                            Nivel {child.level ?? 1} 👑
                        </span>
                    </div>
                    <div className="progress-track">
                        <div
                            className="progress-fill progress-fill--level"
                            style={{ width: "78%" }}
                        ></div>
                    </div>
                </div>

                <div className="child-topbar__stat">
                    <div className="child-topbar__stat-head child-topbar__stat-head--coins">
                        <img
                            className="child-topbar__coins-icon"
                            src={monedasIcon}
                            alt="Monedas"
                        />
                        <span className="child-topbar__stat-title">
                            {child.total_coins ?? 0} Monedas
                        </span>
                    </div>
                    <div className="progress-track">
                        <div
                            className="progress-fill progress-fill--coins"
                            style={{ width: `${Math.min(child.progress ?? 40, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </section>
    );
};