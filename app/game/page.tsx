'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Card {
  id: number
  pairId: number
  isFlipped: boolean
  isMatched: boolean
  imageUrl?: string
  emoji?: string
}

const EMOJIS = ['❤️', '💕', '💖', '💗', '💝', '💞', '💓', '💟', '💘', '💙', '💜', '🧡', '💛', '🤍', '🖤', '💚', '🤎', '💋', '🌹', '🌷', '🌺', '🌸', '🌻', '🌼', '🦋', '⭐', '🌟', '✨', '🎀', '🎁', '🎂', '🍓', '🍒', '🍑', '🍎', '🥰', '😍', '🥳', '🎉', '🎊']

export default function GamePage() {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [gridSize, setGridSize] = useState<number | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  // Load images on mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch('/api/images')
        const data = await response.json()
        setImages(data.images || [])
      } catch (error) {
        console.error('Error loading images:', error)
        setImages([])
      } finally {
        setLoading(false)
      }
    }
    loadImages()
  }, [])

  const generateCards = (imageUrls: string[]) => {
    // For 4x4 grid, we need 8 pairs (16 cards total)
    // Take first 8 images or shuffle and take 8
    const shuffledImages = [...imageUrls].sort(() => Math.random() - 0.5)
    const selectedImages = shuffledImages.slice(0, 8)
    const cardPairs: Card[] = []

    for (let i = 0; i < selectedImages.length; i++) {
      const imageUrl = selectedImages[i]
      cardPairs.push(
        { id: i * 2, pairId: i, isFlipped: false, isMatched: false, imageUrl },
        { id: i * 2 + 1, pairId: i, isFlipped: false, isMatched: false, imageUrl }
      )
    }

    // Shuffle cards
    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]]
    }

    return cardPairs
  }

  const generateCardsWithEmojis = (numPairs: number) => {
    const cardPairs: Card[] = []

    for (let i = 0; i < numPairs; i++) {
      const emoji = EMOJIS[i % EMOJIS.length]
      cardPairs.push(
        { id: i * 2, pairId: i, isFlipped: false, isMatched: false, emoji },
        { id: i * 2 + 1, pairId: i, isFlipped: false, isMatched: false, emoji }
      )
    }

    // Shuffle cards
    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]]
    }

    return cardPairs
  }

  const startGame = () => {
    const gridSize = 4 // Fixed 4x4 grid
    setGridSize(gridSize)
    
    if (images.length > 0) {
      // Use images - shuffle them each time
      setCards(generateCards(images))
    } else {
      // Fallback to emojis
      setCards(generateCardsWithEmojis((gridSize * gridSize) / 2))
    }
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameWon(false)
  }

  const handleCardClick = (cardId: number) => {
    const card = cards[cardId]

    // Don't allow clicking if card is already flipped, matched, or if 2 cards are already flipped
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return
    }

    const newCards = [...cards]
    newCards[cardId].isFlipped = true
    setCards(newCards)

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)
      const [firstId, secondId] = newFlippedCards
      const firstCard = newCards[firstId]
      const secondCard = newCards[secondId]

      if (firstCard.pairId === secondCard.pairId) {
        // Match found!
        setTimeout(() => {
          newCards[firstId].isMatched = true
          newCards[secondId].isMatched = true
          setCards([...newCards])
          setFlippedCards([])
          setMatches((prevMatches) => {
            const newMatches = prevMatches + 1
            // Check if game is won
            if (newMatches === (gridSize! * gridSize!) / 2) {
              setGameWon(true)
            }
            return newMatches
          })
        }, 500)
      } else {
        // No match, flip back
        setTimeout(() => {
          newCards[firstId].isFlipped = false
          newCards[secondId].isFlipped = false
          setCards([...newCards])
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8">
          <div className="text-6xl heartbeat">💖</div>
          <p className="text-xl text-pink-600">Nalagam slike...</p>
        </div>
      </div>
    )
  }

  if (gridSize === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-8">
            {images.length > 0 ? 'Pripravljeno za igro! ❤️' : 'Izberi težavnost ❤️'}
          </h1>
          
          {images.length > 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-4 border-pink-200 max-w-md mx-auto">
              <div className="text-6xl mb-4">💕</div>
              <div className="text-2xl font-bold text-red-500 mb-2">
                4x4
              </div>
              <div className="text-pink-600 mb-2">
                8 parov slik
              </div>
              <div className="text-sm text-pink-500 mb-6">
                (Iz {images.length} slik se bo izbralo 8 naključnih)
              </div>
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
              >
                Začni igro
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
              {[4, 6, 8].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setGridSize(size)
                    setCards(generateCardsWithEmojis((size * size) / 2))
                    setFlippedCards([])
                    setMoves(0)
                    setMatches(0)
                    setGameWon(false)
                  }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-4 border-pink-200 hover:border-red-400 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div className="text-6xl mb-4">💕</div>
                  <div className="text-2xl font-bold text-red-500 mb-2">
                    {size}x{size}
                  </div>
                  <div className="text-pink-600">
                    {(size * size) / 2} parov
                  </div>
                </button>
              ))}
            </div>
          )}

          <Link
            href="/"
            className="inline-block mt-8 text-xl text-pink-600 hover:text-red-500 transition-colors"
          >
            ← Nazaj
          </Link>
        </div>
      </div>
    )
  }

  if (gameWon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border-4 border-pink-200">
          <div className="text-8xl mb-4 heartbeat">🎉</div>
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
            Bravo! ❤️
          </h2>
          <p className="text-xl text-pink-600">
            Uspelo ti je v {moves} potezah!
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              Igraj ponovno
            </button>
            <button
              onClick={() => setGridSize(null)}
              className="bg-white border-4 border-pink-300 text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              Nova igra
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <Link
            href="/"
            className="text-xl text-pink-600 hover:text-red-500 transition-colors"
          >
            ← Domov
          </Link>
          <div className="flex gap-6 text-lg">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-pink-200">
              <span className="text-red-500 font-bold">Poteze: </span>
              <span className="text-pink-600">{moves}</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-pink-200">
              <span className="text-red-500 font-bold">Pari: </span>
              <span className="text-pink-600">{matches}/{(gridSize * gridSize) / 2}</span>
            </div>
          </div>
        </div>

          {/* Game Grid */}
        <div
          className="grid gap-3 md:gap-4 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            maxWidth: `${gridSize * 100}px`,
          }}
        >
          {cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Card({ card, onClick }: { card: Card; onClick: () => void }) {
  return (
    <div
      className={`relative cursor-pointer transition-transform duration-300 hover:scale-105 ${
        card.isMatched ? 'opacity-50' : ''
      }`}
      onClick={onClick}
      style={{ aspectRatio: '1' }}
    >
      <div className="card-container">
        <div className={`card-inner ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}>
          {/* Back of card */}
          <div className="card-face card-back bg-gradient-to-br from-red-400 to-pink-400 rounded-xl shadow-lg border-4 border-white flex items-center justify-center overflow-hidden">
            <span className="text-4xl md:text-5xl">💖</span>
          </div>

          {/* Front of card */}
          <div className="card-face card-front bg-white rounded-xl shadow-lg border-4 border-pink-200 flex items-center justify-center overflow-hidden relative">
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt="Memory card"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-4xl md:text-5xl heartbeat">{card.emoji}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
