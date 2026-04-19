import React from "react";
import defaultAvatar from "../assets/img/logo.png";
import monedasIcon from "../assets/img/monedas.png";

// Añadimos prizeProgress a las props que recibe el componente
export const ChildHeader = ({ child, level, progress, xpRemaining, prizeProgress }) => {
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
                    <p className="child-topbar__label">¡Sigue así!</p>
                    <h2 className="child-topbar__name">{child.name || "Perfil"}</h2>
                </div>
            </div>

            <div className="child-topbar__stats">
                {/* BARRA DE NIVEL (Izquierda - XP Acumulado) */}
                <div className="child-topbar__stat">
                    <div className="child-topbar__stat-head">
                        <span className="child-topbar__stat-title">
                            Nivel {level} 👑
                        </span>
                    </div>
                    <div className="progress-track">
                        <div
                            className="progress-fill progress-fill--level"
                            style={{ 
                                width: `${progress}%`, 
                                transition: "width 0.8s ease-in-out" 
                            }}
                        ></div>
                    </div>
                    <small style={{ fontSize: "0.75rem", color: "#5a5a5a", marginTop: "4px", display: "block" }}>
                        Faltan {xpRemaining} 🪙 para el nivel {level + 1}
                    </small>
                </div>

                {/* BARRA DE GRAN PREMIO (Derecha - Monedas actuales) */}
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
                        {/* 🟢 AHORA DINÁMICA: Refleja el progreso real hacia el Gran Premio */}
                        <div
                            className="progress-fill progress-fill--coins"
                            style={{ 
                                width: `${prizeProgress}%`, 
                                transition: "width 0.8s ease-in-out" 
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </section>
    );
};