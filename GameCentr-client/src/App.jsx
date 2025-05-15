import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import GuessGame from "./pages/GuessGame";
import HangmanGame from './pages/HangmanGame';
import Game from "./pages/Game";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Post from "./pages/Post";
import PongGame from './pages/PongGame';
import TypingGame from './pages/TypingGame';
import SimonSays from './pages/SimonSays';
import MemoryMatch from './pages/MemoryMatch';
import WhackAMole from './pages/WhackAMole';
import ColorGuess from './pages/ColorGuess';
import PatternRepeater from './pages/PatternRepeater';
import QuickMathChallenge from './pages/QuickMathChallenge';

export default function App() {
  const [cookies] = useCookies(['isLoggedIn']);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={cookies.isLoggedIn ? <Game /> : <Navigate to='/login' />} />
          <Route path="/game/guess" element={cookies.isLoggedIn ? <GuessGame /> : <Navigate to='/login' />} />
          <Route path="/game/hangman" element={cookies.isLoggedIn ? <HangmanGame /> : <Navigate to='/login' />} />
          <Route path="/game/pong" element={cookies.isLoggedIn ? <PongGame /> : <Navigate to='/login' />} />
          <Route path="/game/typing" element={cookies.isLoggedIn ? <TypingGame /> : <Navigate to='/login' />} />
          <Route path="/game/simonsays" element={cookies.isLoggedIn ? <SimonSays /> : <Navigate to='/login' />} />
          <Route path="/game/memorymatch" element={cookies.isLoggedIn ? <MemoryMatch /> : <Navigate to='/login' />} />
          <Route path="/game/whackamole" element={cookies.isLoggedIn ? <WhackAMole /> : <Navigate to='/login' />} />
          <Route path="/game/colorguess" element={cookies.isLoggedIn ? <ColorGuess /> : <Navigate to='/login' />} />
          <Route path="/game/patternrepeater" element={cookies.isLoggedIn ? <PatternRepeater /> : <Navigate to='/login' />} />
          <Route path="/game/quickmath" element={cookies.isLoggedIn ? <QuickMathChallenge /> : <Navigate to='/login' />} />
          <Route path="/post" element={cookies.isLoggedIn ? <Post /> : <Navigate to='/login' />} />
          <Route path="*" element={<Navigate to='/login' />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}