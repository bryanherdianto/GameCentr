import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCookies } from 'react-cookie';
import { createScorePost } from "../actions/Score.action";

const COLORS = ['red', 'green', 'blue', 'yellow'];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

const SimonSays = () => {
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [round, setRound] = useState(1);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [message, setMessage] = useState('');
  const [activeColor, setActiveColor] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cookies] = useCookies(["user_id"]);
  const [scorePosted, setScorePosted] = useState(false);

  useEffect(() => {
    if (gameOver && !scorePosted) {
      handleSubmitScore();
    }
    // eslint-disable-next-line
  }, [gameOver]);

  const handleSubmitScore = async () => {
    await createScorePost({
      value: round,
      text: `Round: ${round}`,
      owner: cookies.user_id,
      game: "simonsays"
    });
    setScorePosted(true);
  };
  
  useEffect(() => {
    if (!gameOver) startNewRound();
    // eslint-disable-next-line
  }, []);

  const startNewRound = () => {
    setMessage('Watch the pattern!');
    setUserInput([]);
    setIsUserTurn(false);
    setSequence((prev) => {
      const newSequence = [...prev, getRandomColor()];
      setTimeout(() => {
        playSequence(newSequence);
      }, 800);
      return newSequence;
    });
  };

  const playSequence = async (seq) => {
    for (let i = 0; i < seq.length; i++) {
      setActiveColor(seq[i]);
      await new Promise((res) => setTimeout(res, 600));
      setActiveColor(null);
      await new Promise((res) => setTimeout(res, 200));
    }
    setMessage('Your turn!');
    setIsUserTurn(true);
  };

  const handleColorClick = (color) => {
    if (!isUserTurn || gameOver || cooldown) return;
    setCooldown(true);
    setTimeout(() => setCooldown(false), 400);
    const newInput = [...userInput, color];
    setUserInput(newInput);
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 200);
    if (sequence[newInput.length - 1] !== color) {
      setMessage('Wrong! Game Over.');
      setGameOver(true);
      setIsUserTurn(false);
      return;
    }
    if (newInput.length === sequence.length) {
      setMessage('Correct! Next round...');
      setIsUserTurn(false);
      setTimeout(() => {
        setRound((r) => r + 1);
        startNewRound();
      }, 1000);
    }
  };

  const handleRestart = () => {
    setSequence([]);
    setUserInput([]);
    setRound(1);
    setIsUserTurn(false);
    setMessage('');
    setActiveColor(null);
    setGameOver(false);
    setTimeout(() => {
      setSequence([]); // ensure sequence is cleared before new round
      startNewRound();
    }, 500);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-indigo-900 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">Simon Says</h1>
          <p className="mb-2 text-lg">Pattern memory game. Repeat the sequence!</p>
          <div className="mb-4 text-xl font-semibold">Round: {round}</div>
          <div className="mb-6 text-center text-lg min-h-[2em]">{message}</div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {COLORS.map((color) => (
              <button
                key={color}
                className={`w-24 h-24 rounded-lg shadow-lg border-2 border-gray-300 focus:outline-none transition-all duration-150 ${
                  color === 'red'
                    ? 'bg-red-500'
                    : color === 'green'
                    ? 'bg-green-500'
                    : color === 'blue'
                    ? 'bg-blue-500'
                    : 'bg-yellow-400'
                } ${activeColor === color ? 'ring-4 ring-indigo-400 scale-110' : ''}`}
                onClick={() => handleColorClick(color)}
                disabled={!isUserTurn || gameOver}
                aria-label={color}
              />
            ))}
          </div>
          {gameOver && (
            <>
              <div className="text-red-600 font-bold mb-4">Game Over! You reached round {round}.</div>
              <button
                onClick={handleRestart}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md font-medium shadow hover:bg-indigo-700"
              >
                Restart
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SimonSays;