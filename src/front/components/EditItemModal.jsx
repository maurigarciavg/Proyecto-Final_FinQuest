import React, { useState } from "react";

export const EditItemModal = ({ item, type, onClose, onSave }) => {
    const [editForm, setEditForm] = useState({ 
        ...item,
        name: item.name || item.title || "",
        coins: item.coins || item.points || 10,
        days: item.days || [] 
    });
    
    const allDays = ["L", "M", "X", "J", "V", "S", "D"];

    const handleUpdate = async () => {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const session = JSON.parse(localStorage.getItem("jwt-example-session") || "{}");
        
        // 🟢 CORRECCIÓN: Ahora distinguimos las 3 rutas posibles (usando nombres técnicos)
        let endpoint = "";
        if (type === 'tasks' || type === 'Tareas') {
            endpoint = `api/tasks/${item.id}`;
        } else if (type === 'small-goals' || type === 'Cupones') {
            endpoint = `api/small-goals/${item.id}`;
        } else if (type === 'grand-prize' || type === 'Gran Premio') {
            endpoint = `api/grand-prize/${item.id}`;
        }

        try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.token}`
                },
                body: JSON.stringify({
                    name: editForm.name,
                    coins: parseInt(editForm.coins),
                    days: (type === 'Tareas' || type === 'tasks') ? editForm.days : null,
                    image_url: editForm.image_url || "" // Importante para el Gran Premio
                })
            });

            if (response.ok) {
                onSave();
                onClose();
            } else {
                console.error("Error al actualizar en el servidor");
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', zIndex: 11000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                <h3 style={{ color: '#32a89b', marginTop: 0, marginBottom: '20px' }}>Editar {type === 'grand-prize' ? 'Gran Premio' : type.slice(0,-1)}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>Nombre</label>
                        <input 
                            type="text" 
                            value={editForm.name} 
                            onChange={e => setEditForm({...editForm, name: e.target.value})} 
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} 
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>Monedas (🪙)</label>
                        <input 
                            type="number" 
                            value={editForm.coins} 
                            onChange={e => setEditForm({...editForm, coins: e.target.value})} 
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} 
                        />
                    </div>
                    
                    {(type === 'Tareas' || type === 'tasks') && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>Días programados</label>
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
                                {allDays.map(d => (
                                    <button 
                                        key={d} 
                                        onClick={() => {
                                            const days = editForm.days.includes(d) 
                                                ? editForm.days.filter(day => day !== d) 
                                                : [...editForm.days, d];
                                            setEditForm({...editForm, days});
                                        }} 
                                        style={{ 
                                            flex: 1,
                                            padding: '8px 0', 
                                            borderRadius: '6px', 
                                            border: 'none', 
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            background: editForm.days.includes(d) ? '#32a89b' : '#eee',
                                            color: editForm.days.includes(d) ? 'white' : '#666',
                                            transition: '0.2s'
                                        }}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button 
                            onClick={onClose} 
                            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd', background: 'white', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleUpdate} 
                            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#32a89b', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};