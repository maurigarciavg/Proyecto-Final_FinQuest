import React from "react";

export const ChildDashboard = () => {
    const tasks = [
        { id: 1, title: "Hacer la cama", coins: 10 },
        { id: 2, title: "Leer 20 minutos", coins: 20 },
        { id: 3, title: "Pasear al perro", coins: 15 }
    ];

    const rewards = [
        { id: 1, title: "Entradas al cine", cost: 50 },
        { id: 2, title: "Camiseta", cost: 100 },
        { id: 3, title: "Salida con amigos", cost: 150 }
    ];

    const childData = {
        name: "Alex",
        coins: 120,
        level: 3,
        goal: "Nintendo Switch",
        progress: 60
    };

    return (
        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
            <h1 style={{ marginBottom: "10px" }}>¡Hola, {childData.name}!</h1>
            <p><strong>Monedas:</strong> {childData.coins}</p>
            <p><strong>Nivel:</strong> {childData.level}</p>

            <div style={{ marginTop: "30px" }}>
                <h2>Tareas de casa</h2>
                <ul>
                    {tasks.map(task => (
                        <li key={task.id}>
                            {task.title} (+{task.coins} monedas)
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ marginTop: "30px" }}>
                <h2>Recompensas</h2>
                <ul>
                    {rewards.map(reward => (
                        <li key={reward.id}>
                            {reward.title} (-{reward.cost} monedas)
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ marginTop: "30px" }}>
                <h2>Gran Premio</h2>
                <p><strong>Objetivo:</strong> {childData.goal}</p>
                <p><strong>Progreso:</strong> {childData.progress}%</p>

                <div
                    style={{
                        width: "100%",
                        height: "24px",
                        backgroundColor: "#e5e7eb",
                        borderRadius: "12px",
                        overflow: "hidden",
                        marginTop: "10px"
                    }}
                >
                    <div
                        style={{
                            width: `${childData.progress}%`,
                            height: "100%",
                            backgroundColor: "#22c55e"
                        }}
                    />
                </div>
            </div>
        </div>
    );
};