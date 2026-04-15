/**
 * Diccionario de Palabras Clave -> Emoji
 * He mantenido las categorías para que te sea fácil ampliarlo.
 */
const taskEmojiMap = {
    // Higiene y Cuidado Personal
    "dientes": "🪥",
    "boca": "🦷",
    "ducha": "🚿",
    "baño": "🛁",
    "pelo": "💇",
    "cara": "🧼",
    "manos": "🙌",
    
    // Hogar y Orden
    "cama": "🛏️",
    "dormitorio": "🏠",
    "habitacion": "🏠",
    "mesa": "🍽️",
    "platos": "🥣",
    "cocina": "🍳",
    "recoger": "🧺",
    "ordenar": "📦",
    "juguetes": "🧸",
    "ropa": "👕",
    "lavadora": "🧼",
    "basura": "🗑️",
    "polvo": "🧹",
    
    // Estudios, Mente y Deporte
    "leer": "📖",
    "libro": "📚",
    "lectura": "📚",
    "deberes": "📝",
    "estudiar": "🧠",
    "cole": "🏫",
    "mochila": "🎒",
    "dibujar": "🎨",
    "pintar": "🖌️",
    "musica": "🎸",
    "deporte": "⚽",
    "bici": "🚲",

    // Otros (Mascotas, Plantas, etc.)
    "perro": "🐶",
    "gato": "🐱",
    "mascota": "🐾",
    "animal": "🐾",
    "pasear": "🦮",
    "plantas": "🪴",
    "jardin": "🌻",
    "agua": "💧",
    "fruta": "🍎",
    "verdura": "🥦",
    "comer": "🍴"
};

/**
 * Función que recibe el título de la tarea y devuelve un Emoji.
 * @param {string} taskTitle - El título de la tarea (ej: "Cepillarse los dientes").
 * @returns {string} - Un emoji representativo.
 */
export const getTaskIcon = (taskTitle) => {
    // 1. Validamos que haya título, si no, emoji de estrella por defecto
    if (!taskTitle || typeof taskTitle !== 'string') {
        return "✨";
    }

    // 2. Normalización: minúsculas y quitar acentos
    const normalizedTitle = taskTitle
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    // 3. Buscamos la palabra clave en el título
    // Usamos Object.keys para iterar de forma eficiente
    const keys = Object.keys(taskEmojiMap);
    for (const key of keys) {
        if (normalizedTitle.includes(key)) {
            return taskEmojiMap[key];
        }
    }

    // 4. Si no hay coincidencia, devolvemos un emoji genérico de "objetivo"
    return "🎯";
};