import { useState, useEffect, useRef, useCallback } from 'react'

const COUNTDOWN_MESSAGES = ['Preparados', 'Listos', 'Ya']
const GAME_DURATION = 5

/* ───────────────── helpers ───────────────── */
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(value)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (value !== display) {
      setAnimating(true)
      const t = setTimeout(() => {
        setDisplay(value)
        setAnimating(false)
      }, 150)
      return () => clearTimeout(t)
    }
  }, [value])

  return (
    <span
      style={{
        display: 'inline-block',
        transition: 'transform 0.15s ease, opacity 0.15s ease',
        transform: animating ? 'scale(1.5)' : 'scale(1)',
        opacity: animating ? 0.4 : 1,
      }}
    >
      {display}
    </span>
  )
}

/* ───────────────── Particle burst ───────────────── */
function Particle({ x, y, color }) {
  const angle = Math.random() * 360
  const distance = 40 + Math.random() * 60
  const tx = Math.cos((angle * Math.PI) / 180) * distance
  const ty = Math.sin((angle * Math.PI) / 180) * distance

  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        pointerEvents: 'none',
        zIndex: 9999,
        animation: 'particleBurst 0.6s ease-out forwards',
        '--tx': `${tx}px`,
        '--ty': `${ty}px`,
      }}
    />
  )
}

/* ───────────────── Main component ───────────────── */
export default function JuegoContadorSonnet() {
  const [phase, setPhase] = useState('idle')       // idle | countdown | playing | finished
  const [countdownIndex, setCountdownIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [maxScore, setMaxScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [newRecord, setNewRecord] = useState(false)
  const [particles, setParticles] = useState([])
  const [btnPulse, setBtnPulse] = useState(false)

  const scoreRef = useRef(0)
  const particleIdRef = useRef(0)

  /* ── countdown logic ── */
  useEffect(() => {
    if (phase !== 'countdown') return

    if (countdownIndex < COUNTDOWN_MESSAGES.length - 1) {
      const t = setTimeout(() => setCountdownIndex((i) => i + 1), 1000)
      return () => clearTimeout(t)
    }
    // "Ya" shown → start playing after 1 s
    const t = setTimeout(() => {
      scoreRef.current = 0
      setScore(0)
      setTimeLeft(GAME_DURATION)
      setPhase('playing')
    }, 1000)
    return () => clearTimeout(t)
  }, [phase, countdownIndex])

  /* ── game timer ── */
  useEffect(() => {
    if (phase !== 'playing') return

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval)
          setPhase('finished')
          setMaxScore((prev) => {
            const current = scoreRef.current
            if (current > prev) {
              setNewRecord(true)
              return current
            }
            setNewRecord(false)
            return prev
          })
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [phase])

  /* ── burst particles on click ── */
  const spawnParticles = useCallback((e) => {
    const colors = ['#f72585', '#7209b7', '#3a86ff', '#06d6a0', '#ffd60a']
    const count = 8
    const newParticles = Array.from({ length: count }, () => ({
      id: particleIdRef.current++,
      x: e.clientX,
      y: e.clientY,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setParticles((p) => [...p, ...newParticles])
    setTimeout(() => {
      setParticles((p) =>
        p.filter((pt) => !newParticles.some((np) => np.id === pt.id))
      )
    }, 650)
  }, [])

  /* ── click handler ── */
  const handleClick = useCallback(
    (e) => {
      if (phase !== 'playing') return
      scoreRef.current += 1
      setScore(scoreRef.current)
      setBtnPulse(true)
      setTimeout(() => setBtnPulse(false), 100)
      spawnParticles(e)
    },
    [phase, spawnParticles]
  )

  /* ── start handler ── */
  const handleStart = () => {
    setNewRecord(false)
    setCountdownIndex(0)
    setPhase('countdown')
  }

  /* ── derived state ── */
  const isIdle = phase === 'idle'
  const isCountdown = phase === 'countdown'
  const isPlaying = phase === 'playing'
  const isFinished = phase === 'finished'
  const startDisabled = isCountdown || isPlaying
  const clickDisabled = !isPlaying

  const timerPercent = (timeLeft / GAME_DURATION) * 100
  const timerColor =
    timeLeft > 3 ? '#06d6a0' : timeLeft > 1 ? '#ffd60a' : '#f72585'

  return (
    <>
      {/* ── global styles injected once ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          min-height: 100vh;
          background: #0a0a1a;
        }

        @keyframes particleBurst {
          0%   { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }

        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes floatUp {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        @keyframes countdownPop {
          0%   { transform: scale(0.5); opacity: 0; }
          60%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes recordShine {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px 4px rgba(247,37,133,0.5); }
          50%       { box-shadow: 0 0 40px 12px rgba(247,37,133,0.9); }
        }

        @keyframes timerShrink {
          from { width: var(--start-w); }
          to   { width: 0%; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── particles layer ── */}
      {particles.map((p) => (
        <Particle key={p.id} x={p.x} y={p.y} color={p.color} />
      ))}

      {/* ── main layout ── */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', sans-serif",
          background: 'radial-gradient(ellipse at 20% 30%, #1a0533 0%, #0a0a1a 50%, #001233 100%)',
          padding: '24px',
          gap: '32px',
        }}
      >
        {/* ── title ── */}
        <div style={{ textAlign: 'center', animation: 'floatUp 4s ease-in-out infinite' }}>
          <h1
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
              fontWeight: 900,
              background: 'linear-gradient(90deg, #f72585, #7209b7, #3a86ff, #06d6a0)',
              backgroundSize: '300% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 4s ease infinite',
              letterSpacing: '0.05em',
              textShadow: 'none',
            }}
          >
            JUEGO CONTADOR
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.85rem',
              marginTop: '6px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            ¿Cuántos clicks en 5 segundos?
          </p>
        </div>

        {/* ── card ── */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '28px',
            padding: 'clamp(28px, 5vw, 48px)',
            width: '100%',
            maxWidth: '480px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '28px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* ── score row ── */}
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            {/* current score */}
            <ScoreTile label="Clicks" value={<AnimatedNumber value={score} />} accent="#3a86ff" />

            {/* max score */}
            <ScoreTile
              label="Máximo"
              value={<AnimatedNumber value={maxScore} />}
              accent={newRecord ? '#ffd60a' : '#7209b7'}
              glow={newRecord}
            />
          </div>

          {/* ── countdown display ── */}
          {isCountdown && (
            <div
              key={countdownIndex}
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 'clamp(2.5rem, 10vw, 5rem)',
                fontWeight: 900,
                animation: 'countdownPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
                background:
                  countdownIndex === 2
                    ? 'linear-gradient(135deg, #f72585, #ffd60a)'
                    : 'linear-gradient(135deg, #3a86ff, #7209b7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textAlign: 'center',
              }}
            >
              {COUNTDOWN_MESSAGES[countdownIndex]}
            </div>
          )}

          {/* ── timer bar (playing) ── */}
          {isPlaying && (
            <div style={{ width: '100%', animation: 'fadeSlideIn 0.3s ease' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                <span>Tiempo restante</span>
                <span
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 700,
                    color: timerColor,
                    fontSize: '1rem',
                    transition: 'color 0.3s',
                  }}
                >
                  {timeLeft}s
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: '100px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${timerPercent}%`,
                    background: `linear-gradient(90deg, ${timerColor}, ${timerColor}88)`,
                    borderRadius: '100px',
                    transition: 'width 0.9s linear, background 0.3s',
                    boxShadow: `0 0 10px ${timerColor}`,
                  }}
                />
              </div>
            </div>
          )}

          {/* ── result message (finished) ── */}
          {isFinished && (
            <div
              style={{
                textAlign: 'center',
                animation: 'fadeSlideIn 0.4s ease',
              }}
            >
              {newRecord ? (
                <>
                  <div
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: 'clamp(1rem, 3vw, 1.4rem)',
                      fontWeight: 900,
                      background: 'linear-gradient(90deg, #ffd60a, #f72585, #ffd60a)',
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'recordShine 1.5s linear infinite',
                    }}
                  >
                    ¡NUEVO RÉCORD!
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '4px' }}>
                    {score} clicks — ¡Impresionante!
                  </div>
                </>
              ) : (
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
                  Lograste <strong style={{ color: '#3a86ff' }}>{score}</strong> clicks.
                  {score < maxScore && (
                    <span> El récord es <strong style={{ color: '#7209b7' }}>{maxScore}</strong>. ¡Podés superarlo!</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── idle message ── */}
          {isIdle && (
            <div
              style={{
                color: 'rgba(255,255,255,0.35)',
                fontSize: '0.9rem',
                textAlign: 'center',
                animation: 'fadeSlideIn 0.4s ease',
              }}
            >
              Presioná <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Iniciar</strong> para comenzar
            </div>
          )}

          {/* ── buttons ── */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* START */}
            <button
              onClick={handleStart}
              disabled={startDisabled}
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.1em',
                padding: '16px 32px',
                borderRadius: '14px',
                border: 'none',
                cursor: startDisabled ? 'not-allowed' : 'pointer',
                background: startDisabled
                  ? 'rgba(255,255,255,0.06)'
                  : 'linear-gradient(135deg, #7209b7, #3a86ff)',
                color: startDisabled ? 'rgba(255,255,255,0.25)' : '#fff',
                transition: 'all 0.25s ease',
                boxShadow: startDisabled ? 'none' : '0 8px 30px rgba(114,9,183,0.45)',
                transform: startDisabled ? 'none' : 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                if (!startDisabled) e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {isCountdown ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid #fff',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  Iniciando...
                </span>
              ) : (
                '▶  INICIAR'
              )}
            </button>

            {/* CLICK */}
            <button
              onClick={handleClick}
              disabled={clickDisabled}
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                letterSpacing: '0.05em',
                padding: '22px 32px',
                borderRadius: '18px',
                border: 'none',
                cursor: clickDisabled ? 'not-allowed' : 'pointer',
                background: clickDisabled
                  ? 'rgba(255,255,255,0.04)'
                  : 'linear-gradient(135deg, #f72585, #b5179e)',
                color: clickDisabled ? 'rgba(255,255,255,0.15)' : '#fff',
                transition: 'all 0.1s ease',
                boxShadow: isPlaying
                  ? '0 10px 40px rgba(247,37,133,0.5)'
                  : 'none',
                transform: btnPulse ? 'scale(0.95)' : 'scale(1)',
                animation: isPlaying ? 'pulseGlow 1.5s ease-in-out infinite' : 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            >
              {isPlaying ? '👆 ¡CLICK!' : '👆 CLICK'}
            </button>
          </div>
        </div>

        {/* ── footer ── */}
        <p
          style={{
            color: 'rgba(255,255,255,0.15)',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          JuegoContador — Powered by React
        </p>
      </div>
    </>
  )
}

/* ───────────────── ScoreTile sub-component ───────────────── */
function ScoreTile({ label, value, accent, glow }) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${accent}18, ${accent}08)`,
        border: `1px solid ${accent}40`,
        borderRadius: '16px',
        padding: '16px',
        textAlign: 'center',
        boxShadow: glow ? `0 0 24px ${accent}80` : 'none',
        transition: 'box-shadow 0.3s',
      }}
    >
      <div
        style={{
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '6px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(2rem, 6vw, 3rem)',
          color: accent,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  )
}
