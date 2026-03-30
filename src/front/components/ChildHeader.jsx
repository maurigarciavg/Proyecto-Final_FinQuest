import React from "react";

export const ChildHeader = ({ child }) => {
    return (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <div>
                <h1 className="h3 mb-1">¡Hola, {child.name}!</h1>
                <p className="text-muted mb-0">
                    Aquí puedes ver tu progreso.
                </p>
            </div>

            <div className="d-flex gap-3 flex-wrap">
                <div className="bg-warning bg-opacity-25 rounded-4 px-4 py-3 text-center">
                    <div className="small text-muted">Monedas</div>
                    <div className="fw-bold fs-4">{child.coins}</div>
                </div>

                <div className="bg-light rounded-4 px-4 py-3 text-center">
                    <div className="small text-muted">Nivel</div>
                    <div className="fw-bold fs-4">{child.level}</div>
                </div>
            </div>
        </div>
    );
};