import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import cashtor from "../assets/img/Castor-1.png";
import fondo1 from "../assets/img/fondo-landing.png";
import fondo2 from "../assets/img/fondo-landing2.png";
import logroImg from "../assets/logros.png";
import progresoImg from "../assets/progreso.png";
import puntosImg from "../assets/puntos.png";
import recompensaImg from "../assets/recompensas.png";
import tareasImg from "../assets/tareas.png";


export const Home = () => {
    const { store } = useGlobalReducer();

    return (
        <>
            {/* HERO */}
            <section className="hero-section">

                {/* FONDO */}
                <div
                    className="hero-bg"
                    style={{ backgroundImage: `url(${fondo1})` }}
                ></div>

                <div className="container">
                    <div className="row align-items-center">

                        <div className="col-lg-6">
                            <h1 className="hero-title">
                                Aprende a manejar tu dinero jugando
                            </h1>

                            <div className="hero-buttons d-flex flex-column mt-4">
                                <Link
                                    className="btn btn-primary-soft mb-3"
                                    to="/sign-in"
                                >
                                    INICIAR SESIÓN
                                </Link>

                                <Link
                                    className="btn btn-primary-yellow"
                                    to="/sign-up"
                                >
                                    REGISTRARSE
                                </Link>
                            </div>
                        </div>

                        {/* puedes dejar esto vacío o meter el castor luego */}
                        <div className="col-lg-6"></div>

                    </div>
                </div>
            </section>

            {/* NOSOTROS */}
            <section className="about-section">
                <div className="container">
                    <div className="row">

                        <div className="col-lg-8">
                            <h2 id="nosotros">Nosotros</h2>
                            <p className="about-text">
                                En FinQuest creemos que la educación financiera no debería ser complicada ni aburrida. 
                                Nuestro objetivo es ayudarte a entender y mejorar tu relación con el dinero a través de experiencias 
                                interactivas, decisiones reales y pequeños retos que generan cambios de verdad. Somos un equipo 
                                enfocado en transformar conceptos complejos en aprendizajes prácticos, para que cualquier 
                                persona —sin importar su nivel— pueda construir hábitos financieros más saludables y tomar 
                                el control de su futuro paso a paso. 
                            </p>
                            
                        </div>

                        <div className="col-lg-4 about-img-wrapper">
                            <img
                                src={cashtor}
                                alt="mascota"
                                className="about-img"
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="features-section">
                <div className="container">
                    <div className="row g-4 features-row">

                        <div className="col-md-4 col-lg-2 d-flex">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <img src={tareasImg} alt="icono" style={{ width: "40px" }} />
                                </div>
                                <h5>Lista de tareas</h5>
                                <p>Cree tareas personalizadas y asigne a cada una un valor en monedas según su importancia.</p>
                            </div>
                        </div>

                        <div className="col-md-4 col-lg-2 d-flex">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <img src={puntosImg} alt="icono" style={{ width: "40px" }} />
                                </div>
                                <h5>Sistema de puntos</h5>
                                <p>Cada tarea completada se convierte en monedas, fomentando el esfuerzo y la constancia.</p>
                            </div>
                        </div>

                        <div className="col-md-4 col-lg-2 d-flex">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <img src={logroImg} alt="icono" style={{ width: "40px" }} />
                                </div>
                                <h5>Niveles</h5>
                                <p>Motivación continua a través de niveles y logros que recompensan el progreso de su hijo.</p>
                            </div>
                        </div>

                        <div className="col-md-4 col-lg-2 d-flex">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <img src={recompensaImg} alt="icono" style={{ width: "40px" }} />
                                </div>
                                <h5>Recompensas</h5>
                                <p>Permita que su hijo canjee sus monedas por pequeños premios o aprenda a ahorrar para objetivos mayores.</p>
                            </div>
                        </div>

                        <div className="col-md-4 col-lg-2 d-flex">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <img src={progresoImg} alt="icono" style={{ width: "70px" }} />
                                </div>
                                <h5>Progreso</h5>
                                <p>Supervise el avance con gráficos y estadísticas que hacen visible el desarrollo de hábitos positivos.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA */}

            <section className="cta-section text-center">
                <Link className=" cta-btn  btn btn-lg" to="/sign-up">
                    Empieza ahora
                </Link>
                <img
                    src={fondo2}
                    alt="mascota"
                    className="hero-img"
                />
            </section>
        </>
    );
};