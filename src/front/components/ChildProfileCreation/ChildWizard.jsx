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
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const handleTransitionToSummary = (finalGrandPrizeData) => {
        const updatedData = { ...formData, grandPrize: finalGrandPrizeData };
        setFormData(updatedData);
        setStep(5);
        handleFinalSubmit(updatedData);
    };

    const handleFinalSubmit = async (fullData) => {
        setIsSaving(true);
        setSaveError(null);
        
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const session = JSON.parse(localStorage.getItem("jwt-example-session") || "{}");
        const token = session.token;
        const userObject = session.user;

        const getHeaders = () => {
            const headers = { "Content-Type": "application/json" };
            if (token && token !== "null" && token !== "undefined") {
                headers["Authorization"] = `Bearer ${token}`;
            }
            return headers;
        };

        try {
            // 👶 1. Payload del niño (Aseguramos que el avatar llegue aquí)
            const childPayload = {
                name: fullData.child.child.name,
                age: fullData.child.child.age,
                pin: fullData.child.child.pin,
                // Si no se eligió avatar, ponemos uno por defecto
                avatar: fullData.child.child.avatar || "default_avatar.png"
            };

            const childResponse = await fetch(`${baseUrl}api/child/${userObject.id}`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(childPayload)
            });

            if (!childResponse.ok) {
                const errorData = await childResponse.json();
                throw new Error(errorData.message || "Fallo al crear el perfil");
            }

            const childResult = await childResponse.json();
            const childId = childResult.child.id;

            // 🛠️ 2. Guardado masivo de tareas, cupones y premio final
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
            const meResponse = await fetch(`${baseUrl}api/me`, {
                headers: getHeaders()
            });
            if (meResponse.ok) {
                const meData = await meResponse.json();
                dispatch({ type: "auth_success", payload: { token, user: meData.user } });
            }
            setIsSaving(false);
            
            // Redirección al panel de administración del padre
            setTimeout(() => {
                window.location.href = "/parentadmin";
            }, 1500);

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
                    // Recibimos los datos incluyendo el avatar elegido
                    onNextStep={(childData) => handleNext({ child: childData })}
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