import React from "react";
import "./Footer.css"; // Asegúrate de crear este archivo o usar el anterior

export const Footer = () => (
    <footer className="footer-finquest mt-auto">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 py-4">
            <div>
                <p className="footer-brand-name mb-1">FinQuest — La aventura de ahorrar</p>
                <p className="footer-team mb-0">
                    Desarrollado con ❤️ por: <strong>Alexandra, Diego, Daniel y Mauri</strong>
                </p>
            </div>
            <div className="text-md-end">
                <p className="footer-copy mb-0">
                    © {new Date().getFullYear()} Todos los derechos reservados
                </p>
                <small className="text-muted">Proyecto Final 4Geeks Academy</small>
            </div>
        </div>
    </footer>
);