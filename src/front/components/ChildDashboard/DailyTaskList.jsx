import React, { useState, useEffect } from "react";

export const DailyTaskList = ({ childId }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Lógica del Traductor: Averiguamos qué letra toca hoy
    const getTodayLetter = () => {
        const days = ["D", "L", "M", "X", "J", "V", "S"];
        return days[new Date().getDay()]; 
    };

    const today = getTodayLetter();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const baseUrl = process.env.BACKEND_URL.replace(/\/$/, "");
                const response = await fetch(`${baseUrl}api/child/${childId}/tasks`);
                if (response.ok) {
                    const data = await response.json();
                    
                    // 2. Lógica de Filtrado: Solo tareas que incluyan el día de hoy
                    // El backend nos devuelve 'days' como un array gracias al serialize que hicimos
                    const filtered = data.filter(task => task.days.includes(today));
                    
                    setTasks(filtered);
                }
            } catch (error) {
                console.error("Error cargando tareas:", error);
            } finally {
                setLoading(false);
            }
        };

        if (childId) fetchTasks();
    }, [childId, today]);

    if (loading) return <div className="spinner-border text-success"></div>;

    return (
        <div className="p-3 bg-white rounded-3 shadow-sm">
            <h4 className="fw-bold mb-3" style={{ color: "#32a89b" }}>
                Tareas para hoy ({today})
            </h4>
            {tasks.length === 0 ? (
                <p className="text-muted italic">¡Día libre! No hay tareas para hoy.</p>
            ) : (
                <ul className="list-group list-group-flush">
                    {tasks.map(task => (
                        <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center border-0 mb-2 bg-light rounded-pill px-4">
                            <span className="fw-semibold text-secondary">{task.name}</span>
                            <span className="badge rounded-pill bg-warning text-dark">🪙 {task.coins}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};