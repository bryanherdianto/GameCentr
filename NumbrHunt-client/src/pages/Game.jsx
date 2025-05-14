import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Game() {
    const navigate = useNavigate()

    // Game data
    const games = [
        {
            id: 'guess',
            title: 'Guess the Number',
            description: 'Try to guess the secret number between 1 and 100.',
            path: '/game/guess',
            color: 'from-blue-500 to-indigo-700',
            iconSrc: '/gtn.png',
        },
        {
            id: 'hangman',
            title: 'Hangman',
            description: 'Guess the word one letter at a time before the hangman is complete.',
            path: '/game/hangman',
            color: 'from-green-500 to-emerald-700',
            iconSrc: '/hangman.png',
        },
        {
            id: 'pong',
            title: 'Pong',
            description: 'Classic paddle game where you compete against each other. Use WASD for player 1 and arrow keys for player 2.',
            path: '/game/pong',
            color: 'from-red-500 to-rose-700',
            iconSrc: '/pong.png',
        },
        {
            id: 'typing',
            title: 'Typing Game',
            description: 'Test your typing speed and accuracy with this challenging game.',
            path: '/game/typing',
            color: 'from-amber-500 to-orange-700',
            iconSrc: '/typing.png',
        },
        {
            id: 'simonsays',
            title: 'Simon Says',
            description: 'Pattern memory game. Repeat the sequence!',
            path: '/game/simonsays',
            color: 'from-fuchsia-500 to-indigo-700',
            iconSrc: '/simon.png',
        },
        {
            id: 'memorymatch',
            title: 'Memory Match',
            description: 'Flip cards to match pairs. Test your memory!',
            path: '/game/memorymatch',
            color: 'from-yellow-500 to-amber-700',
            iconSrc: '/memorymatch.png',
        },
        {
            id: 'whackamole',
            title: 'Whack-a-Mole',
            description: 'Moles pop up randomly. Click to score! Test your reflexes.',
            path: '/game/whackamole',
            color: 'from-lime-500 to-green-700',
            iconSrc: '/whackamole.png',
        },
        {
            id: 'colorguess',
            title: 'Color Guess',
            description: 'Match the correct color! Options increase as you progress.',
            path: '/game/colorguess',
            color: 'from-[rgb(0,245,255)] to-[rgb(255,0,255)]',
            iconSrc: '/colorguess.png',
        },
        {
            id: 'patternrepeater',
            title: 'Pattern Repeater',
            description: 'Repeat the sequence of arrows using your arrow keys. Gets faster and longer!',
            path: '/game/patternrepeater',
            color: 'from-cyan-400 to-blue-600',
            iconSrc: '/patternrepeater.png',
        },
        {
            id: 'quickmath',
            title: 'Quick Math Challenge',
            description: 'Solve math equations under time pressure. 7 seconds per round!',
            path: '/game/quickmath',
            color: 'from-pink-400 to-yellow-400',
            iconSrc: '/quickmath.png',
        }
    ]

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                            Game Center
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:max-w-3xl">
                            Choose from our selection of fun and challenging games!
                        </p>
                    </div>

                    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {games.map((game) => {
                            const isColorGuess = game.id === 'colorguess';
                            return (
                                <div
                                    key={game.id}
                                    onClick={() => navigate(game.path)}
                                    className={`rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-2xl ${isColorGuess ? 'rainbow-bg' : `bg-gradient-to-br ${game.color}`}`}
                                >
                                    <div className="p-6 h-full flex flex-col">
                                        <div className="flex items-center justify-center bg-white bg-opacity-20 rounded-full w-16 h-16 mb-4 text-4xl">
                                            {game.iconSrc
                                                ? <img src={game.iconSrc} alt={game.title} className="w-12 h-12 object-contain" />
                                                : <span className="text-4xl">{game.icon}</span>
                                            }
                                        </div>
                                        {isColorGuess ? (
                                            <div className="bg-white rounded-xl p-3 mb-2">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{game.title}</h3>
                                                <p className="text-gray-700 text-opacity-90 mb-0">{game.description}</p>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                                                <p className="text-white text-opacity-80 mb-6 flex-grow">{game.description}</p>
                                            </>
                                        )}
                                        <div className="bg-white bg-opacity-20 py-2 px-4 rounded-lg inline-flex items-center justify-center text-gray-900 font-medium">
                                            Play Now
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Game