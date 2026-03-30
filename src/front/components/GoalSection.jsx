import React from "react";

export const GoalSection = ({ child }) => {
    return (
        <div className="card h-100 border-0 bg-light rounded-4">
            <div className="card-body p-4">
                <h2 className="h5 mb-3">Objetivo</h2>

                <div className="bg-white rounded-4 p-3 shadow-sm mb-3 border">
                    <div className="small text-muted mb-1">
                        Gran premio
                    </div>
                    <div className="fw-bold fs-5">
                        {child.goal}
                    </div>
                </div>

                <div className="mb-2 d-flex justify-content-between">
                    <span className="small text-muted">
                        Progreso
                    </span>
                    <span className="fw-semibold">
                        {child.progress}%
                    </span>
                </div>

                <div
                    className="progress rounded-pill"
                    style={{ height: "18px" }}
                >
                    <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${child.progress}%` }}
                        aria-valuenow={child.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    />
                </div>

                <p className="small text-muted mt-3 mb-0">
                    Sigue completando tareas para acercarte a tu meta.
                </p>
            </div>
        </div>
    );
};