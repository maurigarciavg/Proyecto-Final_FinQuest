import React, { useEffect, useState } from "react";
import { getChildDashboard } from "../services/childDashboard";

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
            <div className="container py-5">
                <div className="alert alert-danger">
                    No se pudo cargar el dashboard del hijo.
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div
                className="container py-5 d-flex justify-content-center align-items-center"
                style={{ minHeight: "60vh" }}
            >
                <div className="text-center">
                    <div className="spinner-border mb-3" role="status"></div>
                    <p className="mb-0">Cargando tu progreso...</p>
                </div>
            </div>
        );
    }

    const { child, tasks } = data;

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                    <div className="card shadow-sm border-0 rounded-4 p-4">
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

                        <div className="row g-4">
                            <div className="col-12 col-md-7">
                                <div className="card h-100 border-0 bg-light rounded-4">
                                    <div className="card-body p-4">
                                        <h2 className="h5 mb-3">Tareas de casa</h2>

                                        {tasks.length === 0 ? (
                                            <p className="text-muted mb-0">
                                                No hay tareas disponibles.
                                            </p>
                                        ) : (
                                            <div className="d-flex flex-column gap-3">
                                                {tasks.map((task) => (
                                                    <div
                                                        key={task.id}
                                                        className="d-flex justify-content-between align-items-center bg-white rounded-4 p-3 shadow-sm border"
                                                    >
                                                        <div>
                                                            <div className="fw-semibold">
                                                                {task.title}
                                                            </div>
                                                            <div className="small text-muted">
                                                                Tarea disponible
                                                            </div>
                                                        </div>

                                                        <span className="badge text-bg-warning px-3 py-2">
                                                            +{task.coins}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-5">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};