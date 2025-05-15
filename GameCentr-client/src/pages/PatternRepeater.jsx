import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCookies } from 'react-cookie';
import { createScorePost } from "../actions/Score.action";

const ARROWS = [
  { key: 'ArrowUp', label: '↑', color: 'bg-blue-400' },
  { key: 'ArrowDown', label: '↓', color: 'bg-green-400' },
  { key: 'ArrowLeft', label: '←', color: 'bg-yellow-400' },
  { key: 'ArrowRight', label: '→', color: 'bg-pink-400' },
];

const MAX_ROUNDS = 20;
const BASE_SPEED = 600; // ms (faster)
const SPEED_STEP = 40; // ms per round (faster progression)

function getRandomArrow() {
  return ARROWS[Math.floor(Math.random() * ARROWS.length)];
}

const PatternRepeater = () => {
  const [pattern, setPattern] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [showing, setShowing] = useState(false);
  const [currentShow, setCurrentShow] = useState(-1);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [message, setMessage] = useState('');
  const timeoutRef = useRef();
  const [cookies] = useCookies(["user_id"]);
  const [scorePosted, setScorePosted] = useState(false);

  useEffect(() => {
    if ((gameOver || win) && !scorePosted) {
      handleSubmitScore();
    }
    // eslint-disable-next-line
  }, [gameOver, win]);

  const handleSubmitScore = async () => {
    await createScorePost({
      value: score,
      text: win ? "Win!" : "Game Over",
      owner: cookies.user_id,
      game: "patternrepeater"
    });
    setScorePosted(true);
  };



  useEffect(() => {
    if (round === 1) startNewGame();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (showing) {
      setCurrentShow(-1);
      let i = 0;
      function showStep() {
        setCurrentShow(i);
        if (i < pattern.length) {
          timeoutRef.current = setTimeout(() => {
            setCurrentShow(-1);
            timeoutRef.current = setTimeout(() => {
              i++;
              if (i < pattern.length) showStep();
              else {
                setShowing(false);
                setCurrentShow(-1);
              }
            }, 200);
          }, BASE_SPEED - (round - 1) * SPEED_STEP);
        }
      }
      showStep();
      return () => clearTimeout(timeoutRef.current);
    }
    // eslint-disable-next-line
  }, [showing, pattern, round]);

  useEffect(() => {
    if (!showing && userInput.length > 0) {
      const idx = userInput.length - 1;
      if (userInput[idx] !== pattern[idx]) {
        setMessage('Wrong!');
        setGameOver(true);
        setTimeout(() => setMessage(''), 1000);
        return;
      }
      if (userInput.length === pattern.length) {
        setScore((s) => s + 1);
        if (round === MAX_ROUNDS) {
          setWin(true);
          setGameOver(true);
        } else {
          setTimeout(() => {
            setRound((r) => r + 1);
            nextRound(round + 1);
          }, 800);
        }
      }
    }
    // eslint-disable-next-line
  }, [userInput]);

  useEffect(() => {
    if (!showing && !gameOver && !win) {
      const handleKey = (e) => {
        if (ARROWS.some((a) => a.key === e.key)) {
          setUserInput((u) => [...u, e.key]);
        }
      };
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
  }, [showing, gameOver, win]);

  const startNewGame = () => {
    setPattern([getRandomArrow().key]);
    setUserInput([]);
    setRound(1);
    setScore(0);
    setGameOver(false);
    setWin(false);
    setMessage('');
    setTimeout(() => setShowing(true), 500);
  };

  const nextRound = (r) => {
    setPattern((p) => [...p, getRandomArrow().key]);
    setUserInput([]);
    setTimeout(() => setShowing(true), 600);
  };

  const handleRestart = () => {
    startNewGame();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-pink-100 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">Pattern Repeater</h1>
          <p className="mb-2 text-lg text-center">Memorize the sequence of arrows and repeat them using your arrow keys. The pattern gets longer and faster each round!</p>
          <div className="mb-2 text-lg font-semibold">Round: {round} / {MAX_ROUNDS}</div>
          <div className="mb-2 text-lg">Score: {score}</div>
          {/* Pattern display: only show the current arrow during the show phase */}
          <div className="flex gap-2 mb-6 min-h-[3rem]">
            {showing && currentShow !== -1 ? (
              (() => {
                const arrowObj = ARROWS.find((a) => a.key === pattern[currentShow]);
                return (
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-lg text-4xl font-bold border-4 ${arrowObj.color} border-indigo-700 animate-bounce`}
                  >
                    {arrowObj.label}
                  </div>
                );
              })()
            ) : (
              <div className="text-gray-400 text-lg italic w-full text-center">{showing ? '...' : 'Your turn! Use arrow keys.'}</div>
            )}
          </div>
          <div className="flex gap-4 mb-6">
            {ARROWS.map((a) => (
              <div key={a.key} className={`w-12 h-12 flex items-center justify-center rounded-lg text-2xl font-bold border ${a.color} border-gray-300`}>
                {a.label}
              </div>
            ))}
          </div>
          {gameOver || win ? (
            <>
              <div className={`font-bold mb-4 ${win ? 'text-green-600' : 'text-red-600'}`}>{win ? 'You Win!' : 'Game Over!'}</div>
              <div className="mb-2">Final Score: {score} / {MAX_ROUNDS}</div>
              <button onClick={handleRestart} className="px-6 py-2 bg-indigo-600 text-white rounded-md font-medium shadow hover:bg-indigo-700">Play Again</button>
            </>
          ) : (
            <div className="text-indigo-700 font-semibold mb-2 h-6">{showing ? 'Watch the pattern...' : 'Your turn! Use arrow keys.'}</div>
          )}
          {message && <div className="text-red-500 font-bold mt-2">{message}</div>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PatternRepeater;
