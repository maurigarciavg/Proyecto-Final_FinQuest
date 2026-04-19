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
        const finalData = { ...formData, grandPrize: finalGrandPrizeData };
        setFormData(finalData);
        setStep(5);
        handleFinalSubmit(finalData);
    };

    const handleFinalSubmit = async (fullData) => {
        setIsSaving(true);
        setSaveError(null);

        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        // Importante: Asegúrate de que esta clave coincide con la que usas en el resto de la App
        const session = JSON.parse(localStorage.getItem("jwt-example-session") || "{}");
        const token = session.token;
        const user = session.user;

        if (!user?.id) {
            setSaveError("No se encontró la sesión del usuario. Por favor, vuelve a iniciar sesión.");
            setIsSaving(false);
            return;
        }

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        try {
            // 👶 1. Crear el Perfil del Niño
            // USAMOS LA RUTA CORRECTA: /api/parent/ID/child
            const childInfo = fullData.child?.child || fullData.child;
            const childPayload = {
                name: childInfo.name,
                age: parseInt(childInfo.age) || 0,
                pin: childInfo.pin?.toString(),
                avatar: childInfo.avatar || "default_avatar.png"
            };

            const childResponse = await fetch(`${baseUrl}api/parent/${user.id}/child`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(childPayload)
            });

            if (!childResponse.ok) {
                // Si falla, intentamos leer el error del JSON, si no, capturamos el texto
                const errorData = await childResponse.json().catch(() => null);
                throw new Error(errorData?.message || "Error 405/500: La ruta de creación no existe o está mal configurada.");
            }

            const childResult = await childResponse.json();
            const childId = childResult.id;

            // 🛠️ 2. Guardado masivo (Tasks, Goals, Prize)
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
                throw new Error("El niño se creó, pero falló el guardado de misiones o premios.");
            }

            // 🔄 Actualizamos el estado global para que el padre vea al nuevo niño inmediatamente
            const meResponse = await fetch(`${baseUrl}api/me`, { headers });
            if (meResponse.ok) {
                const meData = await meResponse.json();
                dispatch({ type: "auth_success", payload: { token, user: meData.user } });
            }

            setIsSaving(false);

            // Éxito: cerramos y navegamos
            setTimeout(() => {
                if (onClose) onClose();
                navigate("/parentadmin");
            }, 1500);

        } catch (error) {
            console.error("❌ ERROR EN EL WIZARD:", error.message);
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