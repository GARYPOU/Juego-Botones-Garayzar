import { useEffect, useMemo, useRef, useState } from 'react'

const COUNTDOWN_STEPS = ['Preparados', 'Listos', 'Ya']
const GAME_DURATION = 5

function ScorePanel({ label, value, detail, tone }) {
  return (
    <article className={`jc-score jc-score-${tone}`}>
      <span className="jc-score-label">{label}</span>
      <strong className="jc-score-value">{value}</strong>
      <span className="jc-score-detail">{detail}</span>
    </article>
  )
}

function PulseBursts({ bursts }) {
  return (
    <div className="jc-bursts" aria-hidden="true">
      {bursts.map((burst) => (
        <span
          key={burst.id}
          className="jc-burst"
          style={{
            left: burst.x,
            top: burst.y,
            '--burst-hue': `${burst.hue}deg`,
          }}
        />
      ))}
    </div>
  )
}

export default function JuegoContadorGPT() {
  const [phase, setPhase] = useState('idle')
  const [countdownIndex, setCountdownIndex] = useState(-1)
  const [currentScore, setCurrentScore] = useState(0)
  const [maxScore, setMaxScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [statusText, setStatusText] = useState('Esperando una nueva partida')
  const [newRecord, setNewRecord] = useState(false)
  const [buttonPressed, setButtonPressed] = useState(false)
  const [bursts, setBursts] = useState([])

  const countdownTimeoutRef = useRef(null)
  const gameIntervalRef = useRef(null)
  const clickAnimationTimeoutRef = useRef(null)
  const burstTimeoutsRef = useRef([])
  const scoreRef = useRef(0)
  const burstIdRef = useRef(0)

  useEffect(() => {
    return () => {
      clearTimeout(countdownTimeoutRef.current)
      clearInterval(gameIntervalRef.current)
      clearTimeout(clickAnimationTimeoutRef.current)
      burstTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
    }
  }, [])

  useEffect(() => {
    if (phase !== 'countdown') {
      return undefined
    }

    if (countdownIndex < COUNTDOWN_STEPS.length - 1) {
      countdownTimeoutRef.current = setTimeout(() => {
        setCountdownIndex((previousIndex) => previousIndex + 1)
      }, 1000)

      return () => clearTimeout(countdownTimeoutRef.current)
    }

    countdownTimeoutRef.current = setTimeout(() => {
      setPhase('playing')
      setTimeLeft(GAME_DURATION)
      setStatusText('Hace clicks sin parar hasta que el temporizador llegue a cero')
    }, 1000)

    return () => clearTimeout(countdownTimeoutRef.current)
  }, [phase, countdownIndex])

  useEffect(() => {
    if (phase !== 'playing') {
      return undefined
    }

    gameIntervalRef.current = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(gameIntervalRef.current)
          setPhase('finished')
          return 0
        }

        return previousTime - 1
      })
    }, 1000)

    return () => clearInterval(gameIntervalRef.current)
  }, [phase])

  useEffect(() => {
    if (phase !== 'finished') {
      return
    }

    const finalScore = scoreRef.current
    const beatRecord = finalScore > maxScore

    setNewRecord(beatRecord)
    setMaxScore((previousMax) => (finalScore > previousMax ? finalScore : previousMax))
    setStatusText(
      beatRecord
        ? `Nuevo récord: ${finalScore} clicks en ${GAME_DURATION} segundos`
        : `Partida terminada. Tu marca fue ${finalScore} clicks`
    )
  }, [phase, maxScore])

  const countdownMessage =
    phase === 'countdown' && countdownIndex >= 0
      ? COUNTDOWN_STEPS[countdownIndex]
      : ''

  const progressPercent = useMemo(() => {
    return Math.max(0, (timeLeft / GAME_DURATION) * 100)
  }, [timeLeft])

  const startDisabled = phase === 'countdown' || phase === 'playing'
  const clickDisabled = phase !== 'playing'

  function startGame() {
    clearTimeout(countdownTimeoutRef.current)
    clearInterval(gameIntervalRef.current)
    clearTimeout(clickAnimationTimeoutRef.current)

    scoreRef.current = 0
    setCurrentScore(0)
    setTimeLeft(GAME_DURATION)
    setButtonPressed(false)
    setNewRecord(false)
    setPhase('countdown')
    setCountdownIndex(0)
    setStatusText('La cuenta regresiva ya comenzó')
  }

  function registerClick(event) {
    if (phase !== 'playing') {
      return
    }

    const buttonBounds = event.currentTarget.getBoundingClientRect()
    const nextScore = scoreRef.current + 1
    const burst = {
      id: burstIdRef.current++,
      x: event.clientX - buttonBounds.left,
      y: event.clientY - buttonBounds.top,
      hue: 170 + (nextScore * 21) % 120,
    }

    scoreRef.current = nextScore
    setCurrentScore(nextScore)
    setBursts((previousBursts) => [...previousBursts, burst])

    const timeoutId = setTimeout(() => {
      setBursts((previousBursts) => previousBursts.filter((item) => item.id !== burst.id))
      burstTimeoutsRef.current = burstTimeoutsRef.current.filter((item) => item !== timeoutId)
    }, 520)

    burstTimeoutsRef.current.push(timeoutId)

    setButtonPressed(true)
    clearTimeout(clickAnimationTimeoutRef.current)
    clickAnimationTimeoutRef.current = setTimeout(() => {
      setButtonPressed(false)
    }, 110)
  }

  return (
    <>
      <style>{`
        .jc-shell {
          --bg-1: #05131a;
          --bg-2: #0a2230;
          --card: rgba(7, 23, 31, 0.78);
          --line: rgba(164, 239, 255, 0.18);
          --text: #eafcff;
          --muted: rgba(214, 242, 248, 0.72);
          --cyan: #6ef2ff;
          --mint: #a5ff8f;
          --coral: #ff7f66;
          --amber: #ffd166;
          min-height: 100vh;
          width: 100%;
          display: grid;
          place-items: center;
          padding: 28px;
          background:
            radial-gradient(circle at 15% 18%, rgba(110, 242, 255, 0.22), transparent 28%),
            radial-gradient(circle at 84% 20%, rgba(255, 127, 102, 0.22), transparent 26%),
            radial-gradient(circle at 50% 88%, rgba(165, 255, 143, 0.18), transparent 24%),
            linear-gradient(145deg, var(--bg-1), var(--bg-2));
          color: var(--text);
          overflow: hidden;
          position: relative;
          isolation: isolate;
        }

        .jc-shell::before,
        .jc-shell::after {
          content: '';
          position: absolute;
          border-radius: 999px;
          filter: blur(14px);
          opacity: 0.55;
          z-index: -1;
        }

        .jc-shell::before {
          width: 220px;
          height: 220px;
          background: rgba(110, 242, 255, 0.16);
          top: 64px;
          left: 48px;
          animation: jcFloat 8s ease-in-out infinite;
        }

        .jc-shell::after {
          width: 260px;
          height: 260px;
          background: rgba(255, 127, 102, 0.12);
          right: 42px;
          bottom: 36px;
          animation: jcFloat 10s ease-in-out infinite reverse;
        }

        .jc-board {
          width: min(100%, 1080px);
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 24px;
          align-items: stretch;
        }

        .jc-panel,
        .jc-stage {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 32px;
          backdrop-filter: blur(18px);
          box-shadow: 0 26px 70px rgba(0, 0, 0, 0.28);
        }

        .jc-panel {
          padding: 34px;
          display: flex;
          flex-direction: column;
          gap: 26px;
        }

        .jc-eyebrow {
          display: inline-flex;
          width: fit-content;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          color: var(--muted);
          font-size: 0.82rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .jc-title {
          margin: 0;
          font-size: clamp(2.4rem, 5vw, 4.6rem);
          line-height: 0.94;
          letter-spacing: -0.05em;
          color: #f6fffb;
        }

        .jc-title strong {
          display: block;
          color: var(--cyan);
          text-shadow: 0 0 22px rgba(110, 242, 255, 0.28);
        }

        .jc-copy {
          margin: 0;
          max-width: 34ch;
          color: var(--muted);
          font-size: 1.02rem;
          line-height: 1.65;
        }

        .jc-score-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .jc-score {
          padding: 18px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 148px;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.035);
        }

        .jc-score-cyan {
          box-shadow: inset 0 0 0 1px rgba(110, 242, 255, 0.08);
        }

        .jc-score-amber {
          box-shadow: inset 0 0 0 1px rgba(255, 209, 102, 0.12);
        }

        .jc-score-label,
        .jc-score-detail {
          color: var(--muted);
        }

        .jc-score-label {
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .jc-score-value {
          font-size: clamp(2.8rem, 6vw, 4rem);
          line-height: 1;
          letter-spacing: -0.05em;
          color: #ffffff;
        }

        .jc-score-detail {
          font-size: 0.95rem;
        }

        .jc-status {
          padding: 18px 20px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #f3ffff;
          min-height: 78px;
          display: flex;
          align-items: center;
          font-size: 1rem;
          line-height: 1.55;
        }

        .jc-controls {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .jc-button {
          min-height: 66px;
          padding: 16px 20px;
          border: 0;
          border-radius: 18px;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
        }

        .jc-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .jc-button:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .jc-button-start {
          background: linear-gradient(135deg, #6ef2ff, #49cde7);
          color: #03242c;
          box-shadow: 0 16px 28px rgba(110, 242, 255, 0.28);
        }

        .jc-button-click {
          background: linear-gradient(135deg, #ff7f66, #ffb347);
          color: #231208;
          box-shadow: 0 16px 28px rgba(255, 127, 102, 0.24);
        }

        .jc-button-click.jc-button-active {
          transform: scale(0.97);
        }

        .jc-stage {
          position: relative;
          overflow: hidden;
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 560px;
        }

        .jc-stage-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.85), transparent 92%);
          pointer-events: none;
        }

        .jc-stage-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
          position: relative;
          z-index: 1;
        }

        .jc-stage-tag {
          display: inline-flex;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--muted);
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .jc-time {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: min(240px, 100%);
        }

        .jc-time-meta {
          display: flex;
          justify-content: space-between;
          color: var(--muted);
          font-size: 0.86rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .jc-time-track {
          width: 100%;
          height: 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        .jc-time-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--mint), var(--cyan));
          box-shadow: 0 0 18px rgba(110, 242, 255, 0.42);
          transition: width 0.9s linear;
        }

        .jc-stage-center {
          flex: 1;
          position: relative;
          z-index: 1;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 28px 0;
        }

        .jc-orb {
          width: min(100%, 320px);
          aspect-ratio: 1;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at 28% 28%, rgba(255, 255, 255, 0.84), transparent 18%),
            radial-gradient(circle at 50% 50%, rgba(110, 242, 255, 0.34), transparent 58%),
            linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow:
            inset 0 0 60px rgba(110, 242, 255, 0.18),
            0 0 0 22px rgba(255, 255, 255, 0.025),
            0 30px 70px rgba(0, 0, 0, 0.32);
          animation: jcPulse 3s ease-in-out infinite;
          position: relative;
        }

        .jc-orb::before,
        .jc-orb::after {
          content: '';
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .jc-orb::after {
          inset: -16px;
          border-color: rgba(110, 242, 255, 0.12);
        }

        .jc-orb-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px;
          align-items: center;
        }

        .jc-orb-kicker {
          color: var(--muted);
          font-size: 0.85rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .jc-orb-value {
          margin: 0;
          font-size: clamp(4rem, 10vw, 7rem);
          line-height: 0.9;
          letter-spacing: -0.07em;
          color: #ffffff;
        }

        .jc-orb-text {
          margin: 0;
          max-width: 18ch;
          color: var(--muted);
          font-size: 0.98rem;
          line-height: 1.5;
        }

        .jc-countdown {
          font-size: clamp(2.5rem, 8vw, 5rem);
          line-height: 0.95;
          letter-spacing: -0.05em;
          color: var(--amber);
          text-shadow: 0 0 24px rgba(255, 209, 102, 0.25);
          animation: jcReveal 260ms ease;
        }

        .jc-stage-footer {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .jc-stage-footer strong {
          color: #ffffff;
        }

        .jc-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          white-space: nowrap;
        }

        .jc-bursts {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          border-radius: inherit;
        }

        .jc-burst {
          position: absolute;
          width: 18px;
          height: 18px;
          margin-left: -9px;
          margin-top: -9px;
          border-radius: 999px;
          background: hsl(var(--burst-hue) 100% 72% / 0.95);
          box-shadow:
            0 0 0 0 hsl(var(--burst-hue) 100% 72% / 0.5),
            0 0 24px hsl(var(--burst-hue) 100% 72% / 0.7);
          animation: jcBurst 520ms ease-out forwards;
        }

        @keyframes jcPulse {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }

          50% {
            transform: translateY(-6px) scale(1.02);
          }
        }

        @keyframes jcFloat {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }

          50% {
            transform: translateY(-18px) translateX(12px);
          }
        }

        @keyframes jcReveal {
          from {
            opacity: 0;
            transform: scale(0.86);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes jcBurst {
          0% {
            transform: scale(0.6);
            opacity: 1;
          }

          100% {
            transform: scale(4.4);
            opacity: 0;
          }
        }

        @media (max-width: 920px) {
          .jc-board {
            grid-template-columns: 1fr;
          }

          .jc-stage {
            min-height: 480px;
          }
        }

        @media (max-width: 640px) {
          .jc-shell {
            padding: 16px;
          }

          .jc-panel,
          .jc-stage {
            border-radius: 24px;
            padding: 22px;
          }

          .jc-score-grid,
          .jc-controls {
            grid-template-columns: 1fr;
          }

          .jc-stage-top,
          .jc-stage-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .jc-time {
            width: 100%;
          }

          .jc-orb {
            width: min(100%, 270px);
          }
        }
      `}</style>

      <main className="jc-shell">
        <div className="jc-board">
          <section className="jc-panel">
            <span className="jc-eyebrow">JuegoContador</span>

            <header>
              <h1 className="jc-title">
                Velocidad,
                <strong>ritmo y récord.</strong>
              </h1>
            </header>

            <p className="jc-copy">
              Tenés una sola misión: hacer la mayor cantidad de clicks posibles en 5 segundos.
              El juego te marca la cuenta regresiva, el tiempo restante y tu mejor marca en vivo.
            </p>

            <div className="jc-score-grid">
              <ScorePanel
                label="Clicks actuales"
                value={currentScore}
                detail={phase === 'playing' ? 'Seguís sumando' : 'Se reinicia en cada partida'}
                tone="cyan"
              />
              <ScorePanel
                label="Puntaje máximo"
                value={maxScore}
                detail={newRecord ? 'Acabás de romper tu récord' : 'Tu mejor resultado histórico'}
                tone="amber"
              />
            </div>

            <div className="jc-status" aria-live="polite">
              {statusText}
            </div>

            <div className="jc-controls">
              <button
                type="button"
                className="jc-button jc-button-start"
                onClick={startGame}
                disabled={startDisabled}
              >
                {phase === 'countdown' ? 'Preparando...' : 'Iniciar partida'}
              </button>

              <button
                type="button"
                className={`jc-button jc-button-click ${buttonPressed ? 'jc-button-active' : ''}`}
                onClick={registerClick}
                disabled={clickDisabled}
              >
                Clickear ahora
              </button>
            </div>
          </section>

          <section className="jc-stage">
            <div className="jc-stage-grid" />
            <PulseBursts bursts={bursts} />

            <div className="jc-stage-top">
              <span className="jc-stage-tag">
                {phase === 'playing'
                  ? 'Partida en curso'
                  : phase === 'countdown'
                    ? 'Cuenta regresiva'
                    : phase === 'finished'
                      ? 'Resultado final'
                      : 'Listo para jugar'}
              </span>

              <div className="jc-time">
                <div className="jc-time-meta">
                  <span>Tiempo</span>
                  <strong>{timeLeft}s</strong>
                </div>
                <div className="jc-time-track">
                  <div className="jc-time-fill" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="jc-stage-center">
              <div className="jc-orb">
                <div className="jc-orb-content">
                  {phase === 'countdown' ? (
                    <>
                      <span className="jc-orb-kicker">Cuenta regresiva</span>
                      <h2 className="jc-countdown">{countdownMessage}</h2>
                      <p className="jc-orb-text">Cuando aparezca “Ya”, el botón de click se habilita durante 5 segundos.</p>
                    </>
                  ) : phase === 'finished' ? (
                    <>
                      <span className="jc-orb-kicker">Partida terminada</span>
                      <h2 className="jc-orb-value">{currentScore}</h2>
                      <p className="jc-orb-text">
                        {newRecord
                          ? 'Superaste tu mejor marca. Volvé a intentarlo para llevarla todavía más alto.'
                          : 'Tu récord sigue vigente. Reiniciá y probá mejorar tu ritmo.'}
                      </p>
                    </>
                  ) : phase === 'playing' ? (
                    <>
                      <span className="jc-orb-kicker">Clicks en vivo</span>
                      <h2 className="jc-orb-value">{currentScore}</h2>
                      <p className="jc-orb-text">Cada toque suma al instante. Aprovechá cada segundo.</p>
                    </>
                  ) : (
                    <>
                      <span className="jc-orb-kicker">Modo espera</span>
                      <h2 className="jc-orb-value">0</h2>
                      <p className="jc-orb-text">Presioná iniciar, mirá la cuenta regresiva y después atacá el botón de clicks.</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <footer className="jc-stage-footer">
              <span>
                Objetivo: <strong>batir tu propio récord</strong> con la mayor cantidad posible de clicks.
              </span>
              <span className="jc-chip">Ventana activa: {GAME_DURATION} segundos</span>
            </footer>
          </section>
        </div>
      </main>
    </>
  )
}