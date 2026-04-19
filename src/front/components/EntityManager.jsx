import React, { useState } from "react";

export const EntityManager = ({ type, childId, onClose, onSave }) => {
    const [newItem, setNewItem] = useState({ name: "", coins: 10, days: ["L", "M", "X", "J", "V"] });
    const allDays = ["L", "M", "X", "J", "V", "S", "D"];

    const handleSave = async () => {
        if (!newItem.name.trim()) return;
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const session = JSON.parse(localStorage.getItem("jwt-example-session") || "{}");
        
        // 🟢 CORRECCIÓN: Ruta dinámica que incluye 'grand-prize'
        let endpoint = "";
        let body = "";

        if (type === 'tasks' || type === 'Tareas') {
            endpoint = `api/child/${childId}/tasks`;
            body = JSON.stringify([newItem]); // Las tareas van en lista []
        } else if (type === 'small-goals' || type === 'Cupones') {
            endpoint = `api/child/${childId}/small-goals`;
            body = JSON.stringify([newItem]); // Los cupones van en lista []
        } else if (type === 'grand-prize' || type === 'Gran Premio') {
            endpoint = `api/child/${childId}/grand-prize`;
            body = JSON.stringify(newItem); // ⚠️ El Gran Premio va como objeto solo {}
        }

        try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.token}`
                },
                body: body
            });
            if (response.ok) {
                onSave(); 
                onClose();
            }
        } catch (error) {
            console.error("Error al añadir:", error);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '500px' }}>
                <h2 style={{ color: '#32a89b', marginBottom: '20px' }}>Añadir {type === 'grand-prize' ? 'Gran Premio' : 'Nueva ' + type.slice(0,-1)}</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="text" placeholder="Nombre..." value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <input type="number" value={newItem.coins} onChange={e => setNewItem({...newItem, coins: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    
                    {(type === 'Tareas' || type === 'tasks') && (
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                            {allDays.map(d => (
                                <button key={d} onClick={() => {
                                    const days = newItem.days.includes(d) ? newItem.days.filter(day => day !== d) : [...newItem.days, d];
                                    setNewItem({...newItem, days});
                                }} style={{ width: '35px', height: '35px', borderRadius: '5px', border: 'none', background: newItem.days.includes(d) ? '#32a89b' : '#eee', color: newItem.days.includes(d) ? 'white' : '#666', cursor: 'pointer' }}>{d}</button>
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}>Cancelar</button>
                        <button onClick={handleSave} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#32a89b', color: 'white', fontWeight: 'bold' }}>Añadir</button>
                    </div>
                </div>
            </div>
        </div>
    );
};