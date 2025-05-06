import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Game from "./pages/Game";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Post from "./pages/Post";

export default function App() {
  const [cookies] = useCookies(['isLoggedIn']);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={cookies.isLoggedIn ? <Game /> : <Navigate to='/login' />} />
          <Route path="/post" element={cookies.isLoggedIn ? <Post /> : <Navigate to='/login' />} />
          <Route path="*" element={<Navigate to='/login' />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}