import React, { useState } from "react";
import { ChildRegistration } from "./ChildRegistration";
import { ChildTaskSetting } from "./ChildTaskSetting";
import { ChildSmallGoals } from "./ChildSmallGoals";
import { ChildGrandPrizeSet } from "./ChildGrandPrizeSet";
import { ChildSummary } from "./ChildSummary"; // ¡Importante importar el nuevo componente!
import "./ChildWizard.css";

export const ChildWizard = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false); // Para mostrar "Guardando..." en el paso 5
    const [saveError, setSaveError] = useState(null); // Por si falla el backend
    const [formData, setFormData] = useState({
        child: null,
        tasks: [],
        smallGoals: [],
        grandPrize: null
    });

    // Esta función solo avanza de paso y guarda datos locales (del paso 1 al 4)
    const handleNext = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    // Esta función se dispara cuando el paso 4 llama a onNextStep
    const handleTransitionToSummary = (finalGrandPrizeData) => {
        // 1. Guardamos el premio en el estado
        const updatedData = { ...formData, grandPrize: finalGrandPrizeData };
        setFormData(updatedData);
        // 2. Avanzamos al paso 5 para que el usuario vea la pantalla final
        setStep(5);
        // 3. Ejecutamos la subida a base de datos en segundo plano
        handleFinalSubmit(updatedData);
    };

    const handleFinalSubmit = async (fullData) => {
        setIsSaving(true);
        setSaveError(null);
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");

        const getHeaders = () => {
            const headers = { "Content-Type": "application/json" };
            if (token && token !== "null" && token !== "undefined") {
                headers["Authorization"] = `Bearer ${token}`;
            }
            return headers;
        };

        try {
            // 1. Crear el Niño
            const childData = {
                name: fullData.child.child.name,
                age: fullData.child.child.age,
                pin: fullData.child.child.pin,
                avatar: fullData.child.child.avatar || "default_avatar.png"
            };

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
            const childId = childResult.child.id;

            // 2. Crear todo lo demás en paralelo
            await Promise.all([
                fetch(`${baseUrl}api/child/${childId}/tasks`, {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify(fullData.tasks)
                }),
                fetch(`${baseUrl}api/child/${childId}/small-goals`, {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify(fullData.smallGoals)
                }),
                fetch(`${baseUrl}api/child/${childId}/grand-prize`, {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        name: fullData.grandPrize.name,
                        coins: parseInt(fullData.grandPrize.coins),
                        image_url: fullData.grandPrize.image_url || ""
                    })
                })
            ]);

            // Si todo va bien, quitamos el estado de "Cargando"
            setIsSaving(false);

        } catch (error) {
            console.error("❌ ERROR CRÍTICO BACKEND:", error.message);
            setSaveError(error.message);
            setIsSaving(false);
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
                    formData={formData} // 🔴 AÑADIMOS ESTO
                    onBack={handleBack}
                    onNextStep={(tasksData) => handleNext({ tasks: tasksData })}
                />
            )}

            {step === 3 && (
                <ChildSmallGoals
                    step={step}
                    formData={formData} // 🔴 AÑADIMOS ESTO
                    onBack={handleBack}
                    onNextStep={(goalsData) => handleNext({ smallGoals: goalsData })}
                />
            )}

            {step === 4 && (
                <ChildGrandPrizeSet
                    step={step}
                    formData={formData} // 🔴 AÑADIMOS ESTO
                    onBack={handleBack}
                    onNextStep={handleTransitionToSummary}
                />
            )}

            {step === 5 && (
                <ChildSummary
                    formData={formData}
                    isSaving={isSaving}
                    saveError={saveError}
                    onClose={onClose}
                />
            )}
        </div>
    );
};

