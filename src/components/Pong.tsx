import './Pong.css';
import React, { useEffect, useRef, useState } from 'react';

const Pong: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // UI state
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [, setScores] = useState({ player: 0, computer: 0 });

  // Game constants
  const width = 500;
  const height = 500;
  const paddleHeight = 10;
  const paddleWidth = 50;
  const paddleDiff = 25;
  const ballRadius = 5;
  const winningScore = 5;

  // Game refs
  const paddleBottomX = useRef(225);
  const paddleTopX = useRef(225);
  const playerMoved = useRef(false);
  const paddleContact = useRef(false);

  // Refs for instant score tracking
  const playerScoreRef = useRef(0);
  const computerScoreRef = useRef(0);

  const ballX = useRef(250);
  const ballY = useRef(250);

  const speedY = useRef<number>(
    window.matchMedia('(max-width: 600px)').matches ? -2 : -1
  );
  const speedX = useRef<number>(speedY.current);
  const trajectoryX = useRef(0);
  const computerSpeed = useRef<number>(
    window.matchMedia('(max-width: 600px)').matches ? 4 : 3
  );

  // =====================
  // Drawing
  // =====================
  const renderCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    // Dashed midline
    ctx.beginPath();
    ctx.setLineDash([4]);
    ctx.moveTo(0, 250);
    ctx.lineTo(500, 250);
    ctx.strokeStyle = 'grey';
    ctx.stroke();

    // Paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(paddleBottomX.current, height - 20, paddleWidth, paddleHeight);
    ctx.fillRect(paddleTopX.current, 10, paddleWidth, paddleHeight);

    // Ball
    ctx.beginPath();
    ctx.arc(ballX.current, ballY.current, ballRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Scores
    ctx.font = '32px Courier New';
    ctx.fillText(playerScoreRef.current.toString(), 20, height / 2 + 50);
    ctx.fillText(computerScoreRef.current.toString(), 20, height / 2 - 30);
  };

  // =====================
  // Ball Mechanics
  // =====================
  const ballReset = () => {
    ballX.current = width / 2;
    ballY.current = height / 2;
    speedY.current = -3;
    speedX.current = 3;
    paddleContact.current = false;
  };

  const ballMove = () => {
    ballY.current += -speedY.current;
    if (playerMoved.current && paddleContact.current) {
      ballX.current += speedX.current;
    }
  };

  const ballBoundaries = () => {
    // Ball bounces off left wall
    if (ballX.current < 0 && speedX.current < 0)
      speedX.current = -speedX.current;

    // Ball bounces off right wall
    if (ballX.current > width && speedX.current > 0)
      speedX.current = -speedX.current;

    // ===== Player Paddle =====
    if (ballY.current > height - paddleDiff) {
      if (
        ballX.current > paddleBottomX.current &&
        ballX.current < paddleBottomX.current + paddleWidth
      ) {
        // Ball hits player paddle
        paddleContact.current = true;
        if (playerMoved.current) {
          speedY.current -= 1;
          if (speedY.current < -5) {
            speedY.current = -5;
            computerSpeed.current = 6;
          }
        }
        speedY.current = -speedY.current;
        trajectoryX.current =
          ballX.current - (paddleBottomX.current + paddleDiff);
        speedX.current = trajectoryX.current * 0.3;
      } else if (ballY.current > height) {
        // Player misses → Computer scores
        ballReset();
        computerScoreRef.current++;

        // Update React state for UI
        setScores({
          player: playerScoreRef.current,
          computer: computerScoreRef.current,
        });
      }
    }
    // Computer paddle
    if (ballY.current < paddleDiff) {
      if (
        ballX.current > paddleTopX.current &&
        ballX.current < paddleTopX.current + paddleWidth
      ) {
        // Ball hits computer paddle
        if (playerMoved.current) {
          speedY.current += 1;
          if (speedY.current > 5) speedY.current = 5;
        }
        speedY.current = -speedY.current;
      } else if (ballY.current < 0) {
        // Computer misses → Player scores
        ballReset();
        playerScoreRef.current++;

        // Update React state for UI
        setScores({
          player: playerScoreRef.current,
          computer: computerScoreRef.current,
        });
      }
    }
  };

  // =====================
  // Computer AI
  // =====================
  const computerAI = () => {
    if (playerMoved.current) {
      if (paddleTopX.current + paddleDiff < ballX.current) {
        paddleTopX.current += computerSpeed.current;
      } else {
        paddleTopX.current -= computerSpeed.current;
      }
    }
  };

  // =====================
  // Game Over Check
  // =====================
  const checkGameOver = () => {
    if (
      playerScoreRef.current === winningScore ||
      computerScoreRef.current === winningScore
    ) {
      if (!isGameOver) {
        setIsGameOver(true);
        setWinner(
          playerScoreRef.current === winningScore ? 'Player 1' : 'Computer'
        );
      }
    }
  };

  // =====================
  // Animation Loop (never stops)
  // =====================
  const animate = (ctx: CanvasRenderingContext2D) => {
    renderCanvas(ctx);

    if (!isGameOver) {
      ballMove();
      ballBoundaries();
      computerAI();
      checkGameOver();
    }

    requestAnimationFrame(() => animate(ctx));
  };

  // =====================
  // Restart Game
  // =====================
  const startGame = () => {
    playerScoreRef.current = 0;
    computerScoreRef.current = 0;
    setScores({ player: 0, computer: 0 });
    setIsGameOver(false);
    setWinner('');
    playerMoved.current = false;
    paddleContact.current = false;
    paddleBottomX.current = 225;
    paddleTopX.current = 225;
    ballReset();
  };

  // =====================
  // Setup
  // =====================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleMouseMove = (e: MouseEvent) => {
      playerMoved.current = true;
      const rect = canvas.getBoundingClientRect();
      paddleBottomX.current = e.clientX - rect.left - paddleDiff;
      if (paddleBottomX.current < 0) paddleBottomX.current = 0;
      if (paddleBottomX.current > width - paddleWidth) {
        paddleBottomX.current = width - paddleWidth;
      }
      canvas.style.cursor = 'none';
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    animate(ctx); // start the infinite loop once

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          display: 'block',
          margin: '0 auto',
          background: 'black',
        }}
      />
      {isGameOver && (
        <div
          style={{
            position: 'absolute',
            top: '100px',
            width: '100%',
            color: 'white',
          }}
        >
          <h1>{winner} Wins!</h1>
          <button
            style={{
              fontSize: '18px',
              padding: '10px 20px',
              cursor: 'pointer',
            }}
            onClick={startGame}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Pong;
