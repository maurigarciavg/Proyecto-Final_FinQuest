import React, { useEffect, useState } from "react";
import { ChildHeader } from "../components/ChildHeader";
import { GoalSection } from "../components/GoalSection";
import { TaskSection } from "../components/TaskSection";
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
                        <ChildHeader child={child} />

                        <div className="row g-4">
                            <div className="col-12 col-md-7">
                                <TaskSection tasks={tasks} />
                            </div>

                            <div className="col-12 col-md-5">
                                <GoalSection child={child} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};