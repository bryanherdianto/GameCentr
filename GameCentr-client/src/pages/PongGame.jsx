import React, { useState, useEffect, useRef } from 'react';
import './PongGame.css'; // Import the CSS file for styling
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCookies } from 'react-cookie';
import { createScorePost } from "../actions/Score.action";

const PongGame = () => {
    const initialBallState = { x: 300, y: 200, speedX: 5, speedY: 5 };
    const initialPaddleState = { left: 150, right: 150 };
    const [ball, setBall] = useState(initialBallState);
    const [paddles, setPaddles] = useState(initialPaddleState);
    const [gameOver, setGameOver] = useState(false);
    const [gameRunning, setGameRunning] = useState(false);
    const ballRef = useRef(null);
    const leftPaddleRef = useRef(150);
    const rightPaddleRef = useRef(150);
    const [bounces, setBounces] = useState(0);
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
        value: bounces,
        text: `Bounces: ${bounces}`,
        owner: cookies.user_id,
        game: "pong"
        });
        setScorePosted(true);
    };

    useEffect(() => {
        if (gameRunning) {
            const handleKeyPress = (e) => {
                switch (e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        rightPaddleRef.current = Math.max(rightPaddleRef.current - 10, 0);
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        rightPaddleRef.current = Math.min(rightPaddleRef.current + 10, 300);
                        break;
                    case 'w':
                        leftPaddleRef.current = Math.max(leftPaddleRef.current - 10, 0);
                        break;
                    case 's':
                        leftPaddleRef.current = Math.min(leftPaddleRef.current + 10, 300);
                        break;
                }

            };

            const updateGame = () => {
                setBall((prevBall) => {
                    let newX = prevBall.x + prevBall.speedX;
                    let newY = prevBall.y + prevBall.speedY;

                    const ballBox = {
                        left: newX,
                        right: newX + 20,
                        top: newY,
                        bottom: newY + 20,
                    };

                    // Get paddle positions from refs (replace paddles.left/right)
                    const paddleLeft = {
                        left: 0,
                        right: 20,
                        top: leftPaddleRef.current,
                        bottom: leftPaddleRef.current + 100,
                    };
                    const paddleRight = {
                        left: 580,
                        right: 600,
                        top: rightPaddleRef.current,
                        bottom: rightPaddleRef.current + 100,
                    };

                    // Paddle collision
                    if (
                        (ballBox.left <= paddleLeft.right &&
                            ballBox.right >= paddleLeft.left &&
                            ballBox.top <= paddleLeft.bottom &&
                            ballBox.bottom >= paddleLeft.top) ||
                        (ballBox.right >= paddleRight.left &&
                            ballBox.left <= paddleRight.right &&
                            ballBox.top <= paddleRight.bottom &&
                            ballBox.bottom >= paddleRight.top)
                    ) {
                        // Increase both X and Y speeds for more challenge
                        const speedIncrease = 1; // Adjust this value to control difficulty progression
                        
                        // Maintain direction but increase speed
                        const directionX = prevBall.speedX > 0 ? 1 : -1;
                        const directionY = prevBall.speedY > 0 ? 1 : -1;
                        
                        const newSpeedX = (Math.abs(prevBall.speedX) + speedIncrease) * -directionX; // Reverse X direction
                        const newSpeedY = (Math.abs(prevBall.speedY) + speedIncrease) * directionY; // Keep Y direction
                        
                        prevBall.speedX = newSpeedX;
                        prevBall.speedY = newSpeedY;
                        
                        newX += prevBall.speedX; // Apply new speed immediately
                        setBounces((b) => b + 1);
                    }

                    // Wall bounce
                    if (newY <= 0 || newY >= 380) {
                        // Increase both X and Y speeds for more challenge
                        const speedIncrease = 1; // Adjust this value to control difficulty progression
                        
                        // Maintain X direction but increase speed
                        const directionX = prevBall.speedX > 0 ? 1 : -1;
                        const directionY = prevBall.speedY > 0 ? 1 : -1;
                        
                        // Increase X speed slightly
                        prevBall.speedX = (Math.abs(prevBall.speedX) + speedIncrease) * directionX;
                        
                        // Reverse Y direction and increase speed
                        prevBall.speedY = (Math.abs(prevBall.speedY) + speedIncrease) * -directionY;
                        
                        newY += prevBall.speedY; // Apply new speed immediately
                    }

                    // Game over
                    if (newX < 0 || newX > 600) {
                        setGameOver(true);
                        pauseGame();
                    }

                    return { ...prevBall, x: newX, y: newY };
                });
            };


            const intervalId = setInterval(updateGame, 50);
            window.addEventListener('keydown', handleKeyPress);

            return () => {
                clearInterval(intervalId);
                window.removeEventListener('keydown', handleKeyPress);
            };
        }
    }, [gameRunning, paddles]);

    useEffect(() => {
        if (gameOver) {
            setBounces(0);
        }
    }, [gameOver]);

    const startGame = () => {
        setGameRunning(true);
    };

    const restartGame = () => {
        setBall(initialBallState);
        setPaddles(initialPaddleState);
        setGameOver(false);
    };

    const pauseGame = () => {
        setGameRunning(false);
    };

    return (
        <>
            <Navbar />
            <div className="ping-pong-container" tabIndex="0">
                <div
                    className={`paddle paddle-left ${gameRunning ? '' : 'paused'}`}
                    id="paddle-left"
                    style={{ top: `${leftPaddleRef.current}px` }}
                />
                <div
                    className={`paddle paddle-right ${gameRunning ? '' : 'paused'}`}
                    id="paddle-right"
                    style={{ top: `${rightPaddleRef.current}px`, left: '580px' }}
                />
                <div
                    className={`ball ${gameRunning ? '' : 'paused'}`}
                    ref={ballRef}
                    style={{ top: `${ball.y}px`, left: `${ball.x}px` }}
                />
                <div className="controls">
                    <button onClick={startGame}>Start</button>
                    <button onClick={restartGame}>Restart</button>
                    <button onClick={pauseGame}>Pause</button>
                </div>
                {gameOver && <div className="game-over">Game Over</div>}
            </div>
            <Footer />
        </>
    );
};

export default PongGame;