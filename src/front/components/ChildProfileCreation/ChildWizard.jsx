import React, { useState } from "react";
import { ChildRegistration } from "./ChildRegistration";
import { ChildTaskSetting } from "./ChildTaskSetting";
import { ChildSmallGoals } from "./ChildSmallGoals";
import { ChildGrandPrizeSet } from "./ChildGrandPrizeSet";

export const ChildWizard = ({ onClose }) => {
    const [step, setStep] = useState(1);

    // Estado centralizado para recolectar datos de todos los subcomponentes
    const [formData, setFormData] = useState({
        child: null,
        tasks: [],
        smallGoals: [],
        grandPrize: null
    });

    const handleNext = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    // Función final que coordina las peticiones al API en cascada
    const handleFinalSubmit = async (finalGrandPrizeData) => {
        const rawUrl = import.meta.env.VITE_BACKEND_URL || "";
        const baseUrl = rawUrl.replace(/\/$/, "").replace("3000", "3001");

        const token = localStorage.getItem("token");

        // Lógica de Headers dinámica: Si no hay token real, no enviamos la cabecera para evitar errores 422/500
        const getHeaders = () => {
            const headers = { "Content-Type": "application/json" };
            if (token && token !== "null" && token !== "undefined") {
                headers["Authorization"] = `Bearer ${token}`;
            }
            return headers;
        };

        const childData = {
            ...formData.child,
            avatar: formData.child?.avatar || "default_avatar.png"
        };

        try {
            console.log("🚀 Iniciando envío a:", `${baseUrl}/api/child`);

            // PASO 1: Crear el Perfil del Niño
            const childResponse = await fetch(`${baseUrl}/api/child`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(childData)
            });

            if (!childResponse.ok) {
                const errorText = await childResponse.text();
                console.error("❌ ERROR DEL SERVIDOR (BACKEND):", errorText);
                throw new Error(errorText || `Error ${childResponse.status}`);
            }

            const childResult = await childResponse.json();
            const childId = childResult.child.id;
            console.log("✅ Niño creado con ID:", childId);

            // PASO 2: Enviar el resto de datos en paralelo
            await Promise.all([
                fetch(`${baseUrl}/api/child/${childId}/tasks`, {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify(formData.tasks)
                }),
                fetch(`${baseUrl}/api/child/${childId}/small-goals`, {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify(formData.smallGoals)
                }),
                fetch(`${baseUrl}/api/child/${childId}/grand-prize`, {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        name: finalGrandPrizeData.name,
                        coins: finalGrandPrizeData.coins,
                        image_url: finalGrandPrizeData.image_url || ""
                    })
                })
            ]);

            alert("¡Perfil de castor completado con éxito!");
            onClose();

        } catch (error) {
            console.error("❌ ERROR FINAL:", error.message);
            alert("Hubo un fallo al guardar. Revisa la consola del servidor (Python).");
        }
    };

    return (
        <div style={{ width: "550px", height: "650px", display: "flex", position: "relative" }}>
            {step === 1 && (
                <div className="w-100 h-100">
                    <ChildRegistration
                        onNextStep={(childData) => handleNext({ child: childData })}
                        onClose={onClose}
                    />
                </div>
            )}

            {step === 2 && (
                <div className="w-100 h-100">
                    <ChildTaskSetting
                        onBack={handleBack}
                        onNextStep={(tasksData) => handleNext({ tasks: tasksData })}
                    />
                </div>
            )}

            {step === 3 && (
                <div className="w-100 h-100">
                    <ChildSmallGoals
                        onBack={handleBack}
                        onNextStep={(goalsData) => handleNext({ smallGoals: goalsData })}
                    />
                </div>
            )}

            {step === 4 && (
                <div className="w-100 h-100">
                    <ChildGrandPrizeSet
                        onBack={handleBack}
                        onNextStep={handleFinalSubmit}
                    />
                </div>
            )}
        </div>
    );
};