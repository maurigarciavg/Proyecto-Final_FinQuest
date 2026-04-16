import React, { useState, useEffect } from 'react';

const GiphyMemoryGame = ({ onGameComplete }) => {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [disabled, setDisabled] = useState(false);

    const API_KEY = "P9Bv81mqPRoibOFcZjswrkjRT2od0wCn";

    useEffect(() => {
        const fetchGifs = async () => {
            try {
                const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=pokemon&limit=8&rating=g`);
                const { data } = await response.json();
                
                // Mezclamos y duplicamos
                const pairCards = [...data, ...data].map((gif, index) => ({
                    ...gif,
                    uniqueId: Math.random() + index // ID mucho más seguro para React
                }));

                setCards(pairCards.sort(() => Math.random() - 0.5));
            } catch (error) {
                console.error("Error cargando GIFs:", error);
            }
        };
        fetchGifs();
    }, []);

    const handleCardClick = (card) => {
        // Validación extra: que no clique la misma carta que ya está boca arriba
        if (disabled || flippedCards.includes(card.uniqueId) || matchedCards.includes(card.id)) return;

        const newFlipped = [...flippedCards, card.uniqueId];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setDisabled(true);
            const [firstId, secondId] = newFlipped;
            const firstCard = cards.find(c => c.uniqueId === firstId);
            const secondCard = cards.find(c => c.uniqueId === secondId);

            if (firstCard.id === secondCard.id) {
                setMatchedCards(prev => [...prev, firstCard.id]);
                resetTurn();
            } else {
                setTimeout(() => resetTurn(), 1000);
            }
        }
    };

    const resetTurn = () => {
        setFlippedCards([]);
        setDisabled(false);
    };

    useEffect(() => {
        // Cuando llega a 8 parejas, el juego termina
        if (matchedCards.length === 8) {
            // Un pequeño delay para que dé tiempo a ver la última carta
            setTimeout(() => {
                if (onGameComplete) onGameComplete(30);
            }, 500);
        }
    }, [matchedCards, onGameComplete]);

    return (
        <div className="memory-game-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '10px', 
            perspective: '1000px' // Da efecto de profundidad
        }}>
            {cards.map((card) => {
                const isFlipped = flippedCards.includes(card.uniqueId) || matchedCards.includes(card.id);
                return (
                    <div 
                        key={card.uniqueId} 
                        onClick={() => handleCardClick(card)}
                        style={{ 
                            width: '100%', 
                            paddingTop: '100%', // Truco para que sean cuadrados perfectos
                            position: 'relative',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            transition: 'transform 0.6s',
                            transformStyle: 'preserve-3d',
                            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                        }}
                    >
                        {/* Parte trasera (la que se ve al inicio) */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            backgroundColor: '#3dc9b6', borderRadius: '8px', backfaceVisibility: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'white'
                        }}>?</div>

                        {/* Parte delantera (el GIF) */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            backgroundColor: '#eee', borderRadius: '8px', backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)', overflow: 'hidden'
                        }}>
                            <img src={card.images.fixed_height.url} alt="gif" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GiphyMemoryGame;
