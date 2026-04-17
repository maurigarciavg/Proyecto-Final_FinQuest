/**
 * DICCIONARIOS DE EMOJIS
 */

const taskEmojiMap = {
    // Higiene y Cuidado Personal
    "dientes": "🪥", "boca": "🦷", "ducha": "🚿", "baño": "🛁", "pelo": "💇", "cara": "🧼", "manos": "🙌",
    // Hogar y Orden
    "cama": "🛏️", "dormitorio": "🏠", "habitacion": "🏠", "mesa": "🍽️", "platos": "🥣", "cocina": "🍳",
    "recoger": "🧺", "ordenar": "📦", "juguetes": "🧸", "ropa": "👕", "lavadora": "🧼", "basura": "🗑️", "polvo": "🧹",
    // Estudios, Mente y Deporte
    "leer": "📖", "libro": "📚", "lectura": "📚", "deberes": "📝", "estudiar": "🧠", "cole": "🏫", 
    "mochila": "🎒", "dibujar": "🎨", "pintar": "🖌️", "musica": "🎸", "deporte": "⚽", "bici": "🚲",
    // Otros
    "perro": "🐶", "gato": "🐱", "mascota": "🐾", "animal": "🐾", "pasear": "🦮", "plantas": "🪴",
    "jardin": "🌻", "agua": "💧", "fruta": "🍎", "verdura": "🥦", "comer": "🍴"
};

const couponEmojiMap = {
    "videojuegos": "🎮", "tablet": "📱", "movil": "📱", "tele": "📺", "youtube": "📺", 
    "pelicula": "🍿", "cine": "🎬", "dibujos": "🖍️", "minecraft": "⛏️", "roblox": "🧱",
    "helado": "🍦", "chuches": "🍭", "caramelos": "🍬", "chocolate": "🍫", "pizza": "🍕", 
    "hamburguesa": "🍔", "patatas": "🍟", "postre": "🍰", "batido": "🥤", "donuts": "🍩",
    "parque": "🛝", "piscina": "🏊", "playa": "🏖️", "campo": "🌳", "bici": "🚲", 
    "patinete": "🛴", "amigos": "👫", "balon": "⚽", "futbol": "⚽", "baloncesto": "🏀",
    "dormir": "😴", "tarde": "⏰", "despacio": "🐌", "ropa": "👗", "disfraz": "🎭", 
    "cuento": "📖", "juego": "🎲", "baño": "🧼", "musica": "🎵"
};

const grandPrizeEmojiMap = {
    "consola": "🎮", "switch": "🎮", "playstation": "🎮", "xbox": "🎮", 
    "lego": "🧱", "playmobil": "🏰", "barbie": "👱‍♀️", "muñeca": "🪆",
    "tablet": "🔋", "ordenador": "💻", "portatil": "💻",
    "bicicleta": "🚲", "patines": "🛼", "skate": "🛹",
    "viaje": "✈️", "avion": "✈️", "hotel": "🏨", "disney": "🏰",
    "fiesta": "🥳", "cumpleaños": "🎂", "concierto": "🎸"
};

/**
 * FUNCIÓN MOTOR (Lógica interna para buscar emojis)
 */
const findEmoji = (title, map, defaultEmoji) => {
    if (!title || typeof title !== 'string') {
        return "✨";
    }

    const normalized = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    for (const key in map) {
        if (normalized.includes(key)) {
            return map[key];
        }
    }
    return defaultEmoji;
};

/**
 * EXPORTS PARA LOS COMPONENTES
 */

// Para las tareas diarias
export const getTaskIcon = (taskTitle) => findEmoji(taskTitle, taskEmojiMap, "🎯");

// Para los premios pequeños/canjeables
export const getCouponIcon = (couponTitle) => findEmoji(couponTitle, couponEmojiMap, "🎟️");

// Para el premio final del niño
export const getGrandPrizeIcon = (prizeTitle) => findEmoji(prizeTitle, grandPrizeEmojiMap, "🏆");