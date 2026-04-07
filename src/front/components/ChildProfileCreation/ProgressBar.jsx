import React from "react";

export const ProgressBar = ({ step }) => {
    const percentage = (step / 4) * 100;

    return (
        <div className="w-100 mb-4">
            {/* Contenedor de Bootstrap */}
            <div className="progress" style={{ height: "12px", borderRadius: "20px", backgroundColor: "#d1fae5" }}>
                <div 
                    className="progress-bar progress-bar-striped progress-bar-animated" 
                    role="progressbar" 
                    style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: "#32a89b",
                        transition: "width 0.6s ease-in-out" 
                    }}
                ></div>
            </div>
            <p className="text-center mt-2 mb-0 fw-bold" style={{ color: "#32a89b", fontSize: "12px", letterSpacing: "1px" }}>
                PASO {step} DE 4
            </p>
        </div>
    );
};