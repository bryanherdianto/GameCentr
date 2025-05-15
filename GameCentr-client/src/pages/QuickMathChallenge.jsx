import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCookies } from 'react-cookie';
import { createScorePost } from "../actions/Score.action";

const OPERATORS = [
  { op: '+', fn: (a, b) => a + b },
  { op: '-', fn: (a, b) => a - b },
  { op: '×', fn: (a, b) => a * b },
  { op: '÷', fn: (a, b) => Math.floor(a / b) },
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEquation(round) {
  // Increase difficulty as rounds progress
  let a, b, op;
  if (round < 5) {
    a = getRandomInt(1, 10);
    b = getRandomInt(1, 10);
    op = OPERATORS[getRandomInt(0, 1)]; // + or -
  } else if (round < 10) {
    a = getRandomInt(5, 20);
    b = getRandomInt(1, 15);
    op = OPERATORS[getRandomInt(0, 2)]; // +, -, ×
  } else {
    op = OPERATORS[getRandomInt(0, 3)];
    if (op.op === '÷') {
      b = getRandomInt(2, 12);
      a = b * getRandomInt(2, 12); // ensure integer division
    } else {
      a = getRandomInt(10, 99);
      b = getRandomInt(2, 99);
    }
  }
  return {
    a,
    b,
    op: op.op,
    answer: op.fn(a, b),
  };
}

const MAX_ROUNDS = 15;
const TIME_LIMIT = 7; // seconds

const QuickMathChallenge = () => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [equation, setEquation] = useState(generateEquation(1));
  const [input, setInput] = useState('');
  const [timer, setTimer] = useState(TIME_LIMIT);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [anim, setAnim] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const timerRef = useRef();
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
      value: score,
      text: `Score: ${score}`,
      owner: cookies.user_id,
      game: "quickmath"
    });
    setScorePosted(true);
  };
  
  useEffect(() => {
    if (gameOver || win) return;
    setTimer(TIME_LIMIT);
    setAnim(false);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [round, equation, gameOver, win]);

  const handleTimeout = () => {
    if (gameOver || win) return;
    setInputDisabled(true);
    setMistakes((m) => m + 1);
    setAnim(true);
    setTimeout(() => {
      if (round === MAX_ROUNDS) {
        setGameOver(true);
      } else {
        setRound((r) => r + 1);
        setEquation(generateEquation(round + 1));
        setInput('');
        setInputDisabled(false);
      }
    }, 1000);
  };

  const handleInput = (e) => {
    setInput(e.target.value.replace(/[^0-9\-]/g, ''));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gameOver || win || inputDisabled) return;
    setInputDisabled(true);
    if (parseInt(input) === equation.answer) {
      setScore((s) => s + 1);
      setAnim(true);
      setTimeout(() => {
        if (round === MAX_ROUNDS) {
          setWin(true);
        } else {
          setRound((r) => r + 1);
          setEquation(generateEquation(round + 1));
          setInput('');
          setInputDisabled(false);
        }
      }, 500);
    } else {
      setMistakes((m) => m + 1);
      setAnim(true);
      setTimeout(() => {
        if (round === MAX_ROUNDS) {
          setGameOver(true);
        } else {
          setRound((r) => r + 1);
          setEquation(generateEquation(round + 1));
          setInput('');
          setInputDisabled(false);
        }
      }, 1000);
    }
  };

  const handleRestart = () => {
    setRound(1);
    setScore(0);
    setMistakes(0);
    setEquation(generateEquation(1));
    setInput('');
    setGameOver(false);
    setWin(false);
    setAnim(false);
    setTimer(TIME_LIMIT);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-pink-100 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-pink-700 mb-4">Quick Math Challenge</h1>
          <p className="mb-2 text-lg text-center">Solve each equation within <span className="font-bold">{TIME_LIMIT} seconds</span>! The challenge gets harder as you progress.</p>
          <div className="mb-2 text-lg font-semibold">Round: {round} / {MAX_ROUNDS}</div>
          <div className="mb-2 text-lg">Score: {score} | Mistakes: {mistakes}</div>
          <div className="mb-6 flex flex-col items-center">
            <div className={`text-4xl font-extrabold mb-2 transition-all duration-300 ${anim ? (parseInt(input) === equation.answer ? 'text-green-500 scale-110' : 'text-red-500 animate-shake') : 'text-indigo-700'}`}
              onAnimationEnd={() => setAnim(false)}
            >
              {equation.a} {equation.op} {equation.b} = ?
            </div>
            <div className="w-40 h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div className="h-4 bg-pink-400 transition-all duration-500" style={{ width: `${(timer / TIME_LIMIT) * 100}%` }} />
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
              <input
                type="text"
                inputMode="numeric"
                className="border-2 border-pink-400 rounded-md px-4 py-2 text-xl w-28 text-center focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={input}
                onChange={handleInput}
                disabled={gameOver || win || anim || inputDisabled}
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-pink-500 text-white rounded-md font-bold shadow hover:bg-pink-600 disabled:opacity-50"
                disabled={gameOver || win || anim || inputDisabled || input === ''}
              >
                Go
              </button>
            </form>
          </div>
          {(gameOver || win) && (
            <>
              <div className={`font-bold mb-4 ${win ? 'text-green-600' : 'text-red-600'}`}>{win ? 'You Win!' : 'Game Over!'}</div>
              <div className="mb-2">Final Score: {score} / {MAX_ROUNDS}</div>
              <div className="mb-4">Total Mistakes: {mistakes}</div>
              <button onClick={handleRestart} className="px-6 py-2 bg-pink-600 text-white rounded-md font-medium shadow hover:bg-pink-700">Play Again</button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default QuickMathChallenge;