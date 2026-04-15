// Importamos todas las imágenes de tareas que tenemos
import iconoDientes from "../assets/img/tasks/icono-dientes.png";
import iconoCama from "../assets/img/tasks/icono-cama.png";
import iconoLeer from "../assets/img/tasks/icono-leer.png";
import iconoDeberes from "../assets/img/tasks/icono-deberes.png";
import iconoMesa from "../assets/img/tasks/icono-mesa.png";
import iconoRecoger from "../assets/img/tasks/icono-recoger.png";
import iconoRopa from "../assets/img/tasks/icono-ropa.png";
import iconoMascota from "../assets/img/tasks/icono-mascota.png";
// ... importa las 20-30 que quieras

// Importamos la imagen genérica por defecto
import iconoGenerico from "../assets/img/tasks/icono-generico.png";

/**
 * Diccionario de Palabras Clave -> Imagen
 * Intenta usar palabras en singular y minúsculas para facilitar la búsqueda.
 */
const taskIconMap = {
    // Higiene
    "dientes": iconoDientes,
    "boca": iconoDientes,
    "ducha": iconoDientes, // Podrías tener uno de ducha específico
    "baño": iconoDientes,
    
    // Hogar y Orden
    "cama": iconoCama,
    "dormitorio": iconoCama,
    "habitacion": iconoCama,
    "mesa": iconoMesa,
    "platos": iconoMesa,
    "recoger": iconoRecoger,
    "ordenar": iconoRecoger,
    "juguetes": iconoRecoger,
    "ropa": iconoRopa,
    "lavadora": iconoRopa,
    
    // Estudios y Mente
    "leer": iconoLeer,
    "libro": iconoLeer,
    "lectura": iconoLeer,
    "deberes": iconoDeberes,
    "estudiar": iconoDeberes,
    "cole": iconoDeberes,
    "mochila": iconoDeberes,

    // Otros
    "perro": iconoMascota,
    "gato": iconoMascota,
    "mascota": iconoMascota,
    "plantas": iconoMascota, // Podrías usar un icono genérico de 'naturaleza'
};

/**
 * Función que recibe el título de la tarea y devuelve la imagen correspondiente.
 * @param {string} taskTitle - El título completo de la tarea (ej: "Cepillarse los dientes").
 * @returns {string} - La ruta de la imagen importada.
 */
export const getTaskIcon = (taskTitle) => {
    // 1. Validamos que haya título
    if (!taskTitle || typeof taskTitle !== 'string') {
        return iconoGenerico;
    }

    // 2. Convertimos el título a minúsculas y quitamos acentos (opcional pero recomendado)
    // para que "Dientes" y "dientes" coincidan.
    const normalizedTitle = taskTitle
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Quita acentos

    // 3. Buscamos si alguna palabra clave del mapa está DENTRO del título
    for (const key in taskIconMap) {
        // Usamos .includes() para buscar la palabra clave
        if (normalizedTitle.includes(key)) {
            return taskIconMap[key]; // Si coincide, devolvemos la imagen
        }
    }

    // 4. Si no hemos encontrado ninguna coincidencia, devolvemos la genérica
    return iconoGenerico;
};