import React, { useState } from "react";
import { ChildRegistration } from "./ChildRegistration";
import { ChildTaskSetting } from "./ChildTaskSetting";
import { ChildSmallGoals } from "./ChildSmallGoals";
import { ChildGrandPrizeSet } from "./ChildGrandPrizeSet";
import "./ChildWizard.css"; // Aquí está toda la magia ahora

export const ChildWizard = ({ onClose }) => {
    const [step, setStep] = useState(1);
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

   const handleFinalSubmit = async (finalGrandPrizeData) => {
    const rawUrl = import.meta.env.VITE_BACKEND_URL || "";
    const baseUrl = rawUrl.replace(/\/$/, "").replace("3000", "3001");
    const token = localStorage.getItem("token");

    const getHeaders = () => {
        const headers = { "Content-Type": "application/json" };
        if (token && token !== "null" && token !== "undefined") {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return headers;
    };

    try {
        // 1. Crear el Niño (Perfil base)
        // IMPORTANTE: Enviamos name, age, pin directamente, no dentro de {child: ...}
        const childData = {
            name: formData.child.child.name, // Ajustado según cómo guardas el estado
            age: formData.child.child.age,
            pin: formData.child.child.pin,
            avatar: formData.child.child.avatar || "default_avatar.png"
        };

        console.log("Enviando datos del niño:", childData);

        const childResponse = await fetch(`${baseUrl}/api/child`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(childData)
        });

        if (!childResponse.ok) {
            const errorData = await childResponse.json();
            throw new Error(errorData.message || "Fallo al crear el perfil");
        }

        const childResult = await childResponse.json();
        const childId = childResult.child.id; // Aquí obtenemos el ID generado en Python

        // 2. Crear todo lo demás en paralelo usando el childId real
        await Promise.all([
            fetch(`${baseUrl}/api/child/${childId}/tasks`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(formData.tasks) // formData.tasks ya es una lista []
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
                    coins: parseInt(finalGrandPrizeData.coins),
                    image_url: finalGrandPrizeData.image_url || ""
                })
            })
        ]);

        alert("¡Perfil de castor guardado en la base de datos! 🦦💎");
        onClose();

    } catch (error) {
        console.error("❌ ERROR CRÍTICO BACKEND:", error.message);
        alert("Error al guardar: " + error.message);
    }
};

    return (
        <div className="wizard-container">
            {step === 1 && (
                <ChildRegistration
                    step={step}
                    onNextStep={(childData) => handleNext({ child: childData })}
                    onClose={onClose}
                />
            )}

            {step === 2 && (
                <ChildTaskSetting
                    step={step}
                    onBack={handleBack}
                    onNextStep={(tasksData) => handleNext({ tasks: tasksData })}
                />
            )}

            {step === 3 && (
                <ChildSmallGoals
                    step={step}
                    onBack={handleBack}
                    onNextStep={(goalsData) => handleNext({ smallGoals: goalsData })}
                />
            )}

            {step === 4 && (
                <ChildGrandPrizeSet
                    step={step}
                    onBack={handleBack}
                    onNextStep={handleFinalSubmit}
                />
            )}
        </div>
    );
};

