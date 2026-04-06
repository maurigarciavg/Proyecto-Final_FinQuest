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

    const handleFinalSubmit = async (finalData) => {
        // ... (Tu lógica de fetch al backend se mantiene igual)
        alert("¡Perfil de castor completado! 🦦");
        onClose();
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