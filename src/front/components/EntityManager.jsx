import React, { useState } from "react";
import { getTaskIcon, getCouponIcon, getGrandPrizeIcon } from "../../front/Utils/getTaskIcon";

export const EntityManager = ({ type, data, childId, onClose, onSave }) => {
    const [items, setItems] = useState(data.map(item => ({
        ...item,
        name: item.name || item.title,
        coins: item.coins || item.points,
        days: item.days || ["L", "M", "X", "J", "V"]
    })));

    const [newItemForm, setNewItemForm] = useState({ name: "", coins: 10, days: ["L", "M", "X", "J", "V"] });
    const allDays = ["L", "M", "X", "J", "V", "S", "D"];

    const handleAddItem = () => {
        if (!newItemForm.name.trim()) return;
        const itemToAdd = { ...newItemForm, id: `new-${Date.now()}` };
        setItems([...items, itemToAdd]);
        setNewItemForm({ name: "", coins: 10, days: ["L", "M", "X", "J", "V"] });
    };

    const removeItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    const toggleDay = (id, day) => {
        setItems(items.map(i => i.id === id ? {
            ...i, 
            days: i.days.includes(day) ? i.days.filter(d => d !== day) : [...i.days, day]
        } : i));
    };

    const saveChanges = async () => {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const session = JSON.parse(localStorage.getItem("jwt-example-session") || "{}");
        
        let endpoint = "";
        if (type === 'Tareas') endpoint = `api/child/${childId}/tasks`;
        else if (type === 'Cupones') endpoint = `api/child/${childId}/small-goals`;
        else if (type === 'Gran Premio') endpoint = `api/child/${childId}/grand-prize`;

        try {
            // PASO 1: Borrar lo que había (Enviando una lista vacía o usando DELETE si tu API lo permite)
            // Si tu API no tiene DELETE, lo normal es que el POST con la nueva lista REEMPLACE.
            // Para forzar el reemplazo, enviamos la lista completa actual 'items'
            
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: "POST", // Cambia a PUT si tu backend lo soporta para actualizar
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.token}`
                },
                body: JSON.stringify(type === 'Gran Premio' ? (items[0] || {}) : items)
            });

            if (response.ok) {
                onSave(); // Refresca el ParentAdmin
            } else {
                const errorData = await response.json();
                console.error("Error del servidor:", errorData);
            }
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '20px', width: '95%', maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#32a89b', margin: 0 }}>Gestionar {type}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#ccc' }}>&times;</button>
                </div>

                {type !== 'Gran Premio' && (
                    <div style={{ background: '#f0fdfa', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #ccfbf1' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="text" placeholder="Nueva misión..." value={newItemForm.name} onChange={e => setNewItemForm({...newItemForm, name: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #99f6e4' }} />
                            <input type="number" value={newItemForm.coins} onChange={e => setNewItemForm({...newItemForm, coins: e.target.value})} style={{ width: '80px', padding: '12px', borderRadius: '8px', border: '1px solid #99f6e4' }} />
                            <button onClick={handleAddItem} style={{ background: '#32a89b', color: 'white', border: 'none', padding: '0 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Añadir</button>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {items.map(item => (
                        <div key={item.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>{type === 'Tareas' ? getTaskIcon(item.name) : type === 'Cupones' ? getCouponIcon(item.name) : getGrandPrizeIcon(item.name)}</span>
                                    <span style={{ fontWeight: '600' }}>{item.name}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{ background: '#fef3c7', padding: '4px 10px', borderRadius: '15px' }}>🪙 {item.coins}</span>
                                    <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            </div>
                            {type === 'Tareas' && (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {allDays.map(d => (
                                        <button key={d} onClick={() => toggleDay(item.id, d)} 
                                            style={{ 
                                                width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                                background: item.days?.includes(d) ? '#32a89b' : '#f3f4f6',
                                                color: item.days?.includes(d) ? 'white' : '#6b7280'
                                            }}>{d}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '35px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <button onClick={onClose} style={{ padding: '12px 25px', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}>Cancelar</button>
                    <button onClick={saveChanges} style={{ padding: '12px 25px', borderRadius: '10px', border: 'none', background: '#32a89b', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Guardar cambios</button>
                </div>
            </div>
        </div>
    );
};