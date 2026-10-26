import { useRef, useState } from "react";
import "./App.css";

import quarterHeads from "./assets/quarter-heads.png";
import quarterTails from "./assets/quarter-tails.png";

import pumpkin from "./assets/pumpkin.png";
import ghost from "./assets/ghost.png";

import welcomeWeb from "./assets/welcome-web.png";

function App() {
  const [playerName, setPlayerName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [guess, setGuess] = useState("");
  const [isFlipping, setIsFlipping] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const pendingResult = useRef(null);
  const flipLocked = useRef(false);

  function handleNameChange(event) {
    setPlayerName(event.target.value.replace(/[^\p{L}]/gu, ""));
  }

  function handleStart(event) {
    event.preventDefault();
    setHasStarted(true);
  }

  function handleFlip() {
    if (!guess || flipLocked.current) return;

    flipLocked.current = true;
    const side = Math.random() < 0.5 ? "Heads" : "Tails";
    pendingResult.current = { side, won: guess === side };

    setResult(null);
    setIsFlipping(true);

    // Add full spins, then finish on the chosen face.
    setRotation((previous) => {
      const nextFullTurn = Math.ceil(previous / 360) * 360;
      return nextFullTurn + 1800 + (side === "Tails" ? 180 : 0);
    });
  }

  function handleLanding(event) {
    if (event.target !== event.currentTarget) return;
    if (!pendingResult.current) return;

    setResult(pendingResult.current);
    pendingResult.current = null;
    flipLocked.current = false;
    setIsFlipping(false);
  }

  const namePrefix = playerName ? `${playerName}, ` : "";

  return (
    <main className="game">
      <div className="pumpkin-decoration" aria-hidden="true">
        <img src={pumpkin} alt="" />
      </div>

      <img
        className="ghost-decoration"
        src={ghost}
        alt=""
        aria-hidden="true"
      />
      <section className="game-card">
        <h2 className="welcome-heading">
          <img src={welcomeWeb} alt="Welcome" />

          <span className="welcome-spider" aria-hidden="true">
            <svg viewBox="0 0 64 64">
              <g className="spider-legs">
                <path d="M27 27 L16 18 L8 20" />
                <path d="M25 32 L13 27 L4 32" />
                <path d="M25 37 L12 39 L6 48" />
                <path d="M27 41 L19 49 L18 58" />

                <path d="M37 27 L48 18 L56 20" />
                <path d="M39 32 L51 27 L60 32" />
                <path d="M39 37 L52 39 L58 48" />
                <path d="M37 41 L45 49 L46 58" />
              </g>

              <ellipse cx="32" cy="37" rx="10" ry="13" />
              <circle cx="32" cy="23" r="7" />
            </svg>
          </span>
        </h2>
        <div className="coin-stage" aria-hidden="true">
          <div
            className={`coin-toss ${isFlipping ? "is-tossing" : ""}`}
            onAnimationEnd={handleLanding}
          >
            <div
              className="coin"
              style={{ transform: `rotateX(${rotation}deg)` }}
            >
              <div className="coin-face coin-heads">
                <img src={quarterHeads} alt="" />
              </div>

              <div className="coin-face coin-tails">
                <img src={quarterTails} alt="" />
              </div>
            </div>
          </div>
        </div>

        <p className="eyebrow">A LITTLE LUCK. A LOT OF FUN.</p>
        <h1>Heads or Tails?</h1>
        <p className="edition">Fall Edition</p>

        {!hasStarted ? (
          <>
            <p className="description">
              Make your call. Give it a flip. Try your luck.
            </p>

            <form className="name-form" onSubmit={handleStart}>
              <label htmlFor="player-name">Player Name:</label>
              <input
                id="player-name"
                type="text"
                value={playerName}
                onChange={handleNameChange}
                placeholder="Enter your name"
                maxLength={25}
                autoComplete="given-name"
                aria-describedby="name-hint"
              />
              <p id="name-hint" className="hint">
                Optional · Letters only
              </p>
              <button type="submit" className="primary-button">
                Let’s Play →
              </button>
            </form>
          </>
        ) : (
          <div className="play-area">
            <p className="welcome">
              {playerName
                ? `Make your call, ${playerName}!`
                : "Make your call!"}
            </p>

            <div className="guess-options" role="group" aria-label="Your guess">
              {["Heads", "Tails"].map((side) => (
                <button
                  key={side}
                  type="button"
                  className={`guess-button ${guess === side ? "selected" : ""}`}
                  aria-pressed={guess === side}
                  disabled={isFlipping}
                  onClick={() => setGuess(side)}
                >
                  {side}
                </button>
              ))}
            </div>

            <div className="flip-button-wrapper">
              <button
                type="button"
                className="primary-button"
                disabled={!guess || isFlipping}
                onClick={handleFlip}
              >
                {isFlipping ? "Flipping…" : "Flip Coin"}
              </button>

              {!guess && !isFlipping && (
                <span className="flip-tooltip" aria-hidden="true">
                  Pick heads or tails
                </span>
              )}
            </div>

            <div className="result" role="status" aria-live="polite">
              {isFlipping ? (
                <p>{namePrefix}let’s see where it lands!</p>
              ) : result ? (
                <>
                  <p className={result.won ? "win-message" : ""}>
                    {result.won
                      ? `${namePrefix}${playerName ? "you" : "You"} won! 🎉`
                      : `${namePrefix}${playerName ? "not" : "Not"} this time—try again!`}
                  </p>
                  <p className="result-detail">
                    It landed on {result.side.toLowerCase()}!
                  </p>
                </>
              ) : (
                <p className="result-detail">
                  Choose heads or tails, then flip the coin.
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;