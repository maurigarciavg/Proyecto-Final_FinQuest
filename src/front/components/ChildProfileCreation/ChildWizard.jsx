import React, { useState } from "react";
import { ChildRegistration } from "./ChildRegistration";
import { ChildTaskSetting } from "./ChildTaskSetting";
import { ChildSmallGoals } from "./ChildSmallGoals";
import { ChildGrandPrizeSet } from "./ChildGrandPrizeSet";
import { ChildSummary } from "./ChildSummary";
import "./ChildWizard.css";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const ChildWizard = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [formData, setFormData] = useState({
        child: null,
        tasks: [],
        smallGoals: [],
        grandPrize: null
    });
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    const handleNext = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const handleTransitionToSummary = (finalGrandPrizeData) => {
        // Creamos la versión final de los datos localmente
        const finalData = { ...formData, grandPrize: finalGrandPrizeData };
        setFormData(finalData);
        setStep(5);
        // Enviamos la variable local 'finalData' para asegurar que el backend reciba todo
        handleFinalSubmit(finalData);
    };

    const handleFinalSubmit = async (fullData) => {
        setIsSaving(true);
        setSaveError(null);

        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const session = JSON.parse(localStorage.getItem("jwt-example-session") || "{}");
        const token = session.token;

        // CAMBIA ESTA LÍNEA:
        const user = session.user; // Antes decía 'userObject'

        // Ahora esto ya no fallará
        if (!user?.id) {
            setSaveError("No se encontró la sesión del usuario.");
            setIsSaving(false);
            return;
        }

        const headers = {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        };

        try {
            // 👶 1. Crear el Perfil del Niño
            const childInfo = fullData.child?.child || fullData.child;
            const childPayload = {
                name: childInfo.name,
                age: parseInt(childInfo.age) || 0,
                pin: childInfo.pin?.toString(), // Aseguramos que sea string
                avatar: childInfo.avatar || "default_avatar.png"
            };

            const childResponse = await fetch(`${baseUrl}api/child/${user.id}`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(childPayload)
            });

            if (!childResponse.ok) {
                const errorData = await childResponse.json();
                throw new Error(errorData.message || "Error al crear el perfil del niño.");
            }

            const childResult = await childResponse.json();
            const childId = childResult.child.id;

            // 🛠️ 2. Guardado masivo paralelo (Tasks, Goals, Prize)
            const requests = [
                fetch(`${baseUrl}api/child/${childId}/tasks`, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(fullData.tasks)
                }),
                fetch(`${baseUrl}api/child/${childId}/small-goals`, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(fullData.smallGoals)
                })
            ];

            // Solo agregamos el Gran Premio si existe
            if (fullData.grandPrize) {
                requests.push(
                    fetch(`${baseUrl}api/child/${childId}/grand-prize`, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify({
                            name: fullData.grandPrize.name,
                            coins: parseInt(fullData.grandPrize.coins) || 0,
                            image_url: fullData.grandPrize.image_url || ""
                        })
                    })
                );
            }

            const responses = await Promise.all(requests);

            if (responses.some(r => !r.ok)) {
                throw new Error("El perfil se creó, pero hubo un error guardando las tareas o premios.");
            }

            // Si todo va bien, quitamos el estado de "Cargando"
            const meResponse = await fetch(`${baseUrl}api/me`, {
                headers: headers // Usa la variable que definiste en la línea 55
            });
            if (meResponse.ok) {
                const meData = await meResponse.json();
                dispatch({ type: "auth_success", payload: { token, user: meData.user } });
            }
            setIsSaving(false);

            // Redirección con éxito
            setTimeout(() => {
                if (onClose && typeof onClose === "function") {
                    onClose();
                }
                navigate("/parentadmin");
            }, 2000);

        } catch (error) {
            console.error("❌ ERROR CRÍTICO:", error.message);
            setSaveError(error.message);
            setIsSaving(false);
        }
    };

    return (
        <div className="wizard-container">
            {step === 1 && (
                <ChildRegistration
                    step={step}
                    onNextStep={handleNext}
                    onClose={onClose}
                />
            )}

            {step === 2 && (
                <ChildTaskSetting
                    step={step}
                    formData={formData}
                    onBack={handleBack}
                    onNextStep={(tasksData) => handleNext({ tasks: tasksData })}
                />
            )}

            {step === 3 && (
                <ChildSmallGoals
                    step={step}
                    formData={formData}
                    onBack={handleBack}
                    onNextStep={(goalsData) => handleNext({ smallGoals: goalsData })}
                />
            )}

            {step === 4 && (
                <ChildGrandPrizeSet
                    step={step}
                    formData={formData}
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