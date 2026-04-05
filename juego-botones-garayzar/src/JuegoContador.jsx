import { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const styles = `
  body, html {
    height: 100%;
    margin: 0;
    background-color: #f0f2f5;
  }
  .main-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .btn-round {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    font-weight: bold;
    font-size: 1.1rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn-round:hover { transform: scale(1.05); }
  .btn-round i { font-size: 2rem; line-height: 1; }
  .counter-box {
    background-color: rgb(88, 206, 9);
    padding: 20px 30px;
    border-radius: 15px;
    min-width: 140px;
    text-align: center;
  }
  .counter-label { font-size: 0.9rem; letter-spacing: 1px; font-weight: 600; }
  .counter-value { font-size: 3.5rem; font-weight: 800; line-height: 1; margin-top: 10px; }
  .countdown-overlay {
    display: none;
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: rgba(0,0,0,0.7);
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  .countdown-overlay.show { display: flex; }
  .countdown-message {
    font-size: 5rem;
    font-weight: bold;
    color: white;
    text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
    animation: pulse 0.6s ease-in-out;
  }
  @keyframes pulse {
    0%   { transform: scale(0.5); opacity: 0; }
    50%  { transform: scale(1.1); }
    100% { transform: scale(1);   opacity: 1; }
  }
`;

export default function JuegoContador() {
  const [contadorActual, setContadorActual] = useState(0);
  const [contadorMaximo, setContadorMaximo] = useState(0);
  const [jugando, setJugando] = useState(false);
  const [btn1Disabled, setBtn1Disabled] = useState(false);
  const [countdownMessage, setCountdownMessage] = useState(null);

  const tiempoTimeout = useRef(null);
  const contadorRef = useRef(0);

  async function empezarJuego() {
    if (tiempoTimeout.current) {
      clearTimeout(tiempoTimeout.current);
      tiempoTimeout.current = null;
    }

    contadorRef.current = 0;
    setContadorActual(0);
    setJugando(false);
    setBtn1Disabled(true);

    const mensajes = ['Listos', 'Preparados', 'Ya'];
    for (let i = 0; i < mensajes.length; i++) {
      setCountdownMessage(mensajes[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setCountdownMessage(null);
    setBtn1Disabled(false);
    setJugando(true);
  }

  function sumarContador() {
    contadorRef.current += 1;
    setContadorActual(contadorRef.current);

    if (!tiempoTimeout.current) {
      tiempoTimeout.current = setTimeout(() => {
        setJugando(false);
        tiempoTimeout.current = null;

        const puntajeFinal = contadorRef.current;
        contadorRef.current = 0;
        setContadorActual(0);
        setContadorMaximo(prev => puntajeFinal > prev ? puntajeFinal : prev);
      }, 5000);
    }
  }

  return (
    <>
      <style>{styles}</style>
      {countdownMessage && (
        <div className="countdown-overlay show">
          <div className="countdown-message">{countdownMessage}</div>
        </div>
      )}

      <div className="container main-container">
        <div className="row w-100 justify-content-center text-center">

          <div className="col-12 col-md-5 d-flex justify-content-center align-items-center gap-4 mb-5 mb-md-0">
            <button
              className="btn btn-primary btn-round shadow"
              onClick={empezarJuego}
              disabled={btn1Disabled}
            >
              <i className="bi bi-plus-lg"></i>
              <span className="d-block mt-2">Empezar</span>
            </button>

            <button
              className="btn btn-danger btn-round shadow"
              onClick={sumarContador}
              disabled={!jugando}
            >
              <i className="bi bi-plus-lg"></i>
              <span className="d-block mt-2">Sumar 1</span>
            </button>
          </div>

          <div className="col-12 col-md-5 d-flex justify-content-center align-items-center gap-4">
            <div className="counter-box shadow-sm">
              <div className="counter-label text-muted">Contador</div>
              <div className="counter-value text-primary">{contadorActual}</div>
            </div>

            <div className="counter-box shadow-sm">
              <div className="counter-label text-muted">Contador Maximo</div>
              <div className="counter-value text-danger">{contadorMaximo}</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
