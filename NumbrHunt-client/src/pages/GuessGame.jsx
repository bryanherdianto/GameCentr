import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { createScorePost } from "../actions/Score.action";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function GuessGame() {
  const inputRef = useRef(null);
  const guessRef = useRef(null);
  const chancesRef = useRef(null);
  const scoreRef = useRef(null);
  const [randomNum, setRandomNum] = useState(Math.floor(Math.random() * 100));
  const [chance, setChance] = useState(10);
  const [disabled, setDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("Check");
  const [cookies, setCookies] = useCookies(["score", "user_id"]);
  const [score, setScore] = useState(0);
  const [post, setPost] = useState(false);
  const [scoreText, setScoreText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus(); // Focus input on mount

    if (!cookies.score) { // initialize score
      setCookies("score", 0, { path: '/' });
      setScore(0);
    } else {
      setScore(Number(cookies.score));
    }
  }, []);

  useEffect(() => {
    if (scoreRef.current) { // update score
      scoreRef.current.textContent = `Current Score = ${score}`;
    }
  }, [score]);

  // Function to reset the game
  const resetGame = () => {
    setRandomNum(Math.floor(Math.random() * 100));
    setChance(10);
    inputRef.current.disabled = false;
    chancesRef.current.textContent = 10;
    guessRef.current.textContent = "";
    guessRef.current.style.color = "#333";
    inputRef.current.value = "";
    setButtonText("Check");
    setDisabled(false);
    setPost(false);
  };

  const handleCheck = () => {
    if (disabled) {
      resetGame();
      return;
    }

    let newChance;
    const inputValue = Number(inputRef.current.value);
    setPost(false);

    if (inputValue === randomNum) {
      guessRef.current.textContent = "Congrats! You found the number.";
      guessRef.current.style.color = "#27ae60";
      setScore(score + 1);
      setCookies("score", score, { path: '/' });
      setButtonText("Replay");
      setDisabled(true);
      newChance = chance;
      inputRef.current.disabled = true;
      setPost(true);
    } else if (inputValue > randomNum && inputValue < 100) {
      guessRef.current.textContent = "Your guess is high";
      guessRef.current.style.color = "#333";
      newChance = chance - 1;
    } else if (inputValue < randomNum && inputValue > 0) {
      guessRef.current.textContent = "Your guess is low";
      guessRef.current.style.color = "#333";
      newChance = chance - 1;
    } else {
      guessRef.current.textContent = "Your number is invalid";
      guessRef.current.style.color = "#e74c3c";
      newChance = chance;
    }
    setChance(newChance);
    chancesRef.current.textContent = newChance;    if (newChance === 0 && inputValue !== randomNum) {
      guessRef.current.textContent = "You lost the game";
      guessRef.current.style.color = "#e74c3c";
      setScore(0);
      setCookies("score", 0, { path: '/' });
      setButtonText("Replay");
      setDisabled(true);
      inputRef.current.disabled = true;
      setPost(true);
    }
  };

  const postScore = () => {
    createScorePost({
      value: score,
      text: scoreText,
      owner: cookies.user_id,
    })
      .then((response) => {
        if (response.data != null) {
          alert("Successfully post score");
          setScore(0);
          navigate("/post");
        } else {
          alert("Failed to post score!");
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Guess a number from 1 to 100</h1>
            <p className="text-xl text-center font-semibold text-gray-700 mb-4" ref={scoreRef}></p>
            <p className="text-lg text-center font-medium mb-6 h-6" ref={guessRef}></p>

            <div className="grid grid-cols-1 sm:grid-cols-[3fr_1fr] gap-2 mb-6">
              <input
                type="number"
                ref={inputRef}
                disabled={disabled}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 text-lg"
                placeholder="Enter your guess"
              />
              <button
                onClick={handleCheck}
                className={`inline-flex justify-center rounded-md border border-transparent px-6 py-3 text-lg font-medium text-white shadow-sm ${disabled ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                {buttonText}
              </button>
            </div>

            <p className="text-lg text-center text-gray-700 mb-4">
              You have <span className="font-bold text-indigo-600" ref={chancesRef}>10</span> chances
            </p>

            {post && (
              <div className="mt-8 border-t pt-6 border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Post your score</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter comment"
                    onChange={(e) => setScoreText(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-4"
                  />
                  <button
                    onClick={postScore}
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Post Score
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}