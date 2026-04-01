import React, { useState } from "react";
import { ChildRegistration } from "./ChildRegistration";
import { ChildTaskSetting } from "./ChildTaskSetting";
import { ChildSmallGoals } from "./ChildSmallGoals"; 
import { ChildGrandPrizeSet } from "./ChildGrandPrizeSet"; // ✅ Nombre actualizado

export const ChildWizard = ({ onClose }) => {
    const [step, setStep] = useState(1);

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    return (
        <div style={{ 
            width: "550px", 
            height: "650px", 
            display: "flex",
            position: "relative" 
        }}>
            
            {step === 1 && (
                <div className="w-100 h-100">
                    <ChildRegistration onNextStep={handleNext} onClose={onClose} />
                </div>
            )}

            {step === 2 && (
                <div className="w-100 h-100">
                    <ChildTaskSetting 
                        onBack={handleBack} 
                        onNextStep={handleNext} 
                    />
                </div>
            )}

            {step === 3 && (
                <div className="w-100 h-100">
                    <ChildSmallGoals 
                        onBack={handleBack} 
                        onNextStep={handleNext} 
                    />
                </div>
            )}

            {step === 4 && (
                <div className="w-100 h-100">
                    {/* ✅ Componente actualizado */}
                    <ChildGrandPrizeSet 
                        onBack={handleBack} 
                        onNextStep={(data) => {
                            console.log("Finalizando registro:", data);
                            alert("¡Perfil de castor completado con éxito!");
                            onClose(); 
                        }} 
                    />
                </div>
            )}
        </div>
    );
};