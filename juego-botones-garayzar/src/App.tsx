import JuegoContador from './JuegoContador.jsx'
import JuegoContadorGPT from './JuegoContadorGPT.jsx'
import JuegoContadorSonnet from './JuegoContadorSonnet.jsx'

const AVAILABLE_GAMES = {
  juegocontador: JuegoContador,
  juegocontadorgpt: JuegoContadorGPT,
  juegocontadorsonnet: JuegoContadorSonnet,
}

const ACTIVE_GAME = 'juegocontadorgpt'

function App() {
  const SelectedGame = AVAILABLE_GAMES[ACTIVE_GAME]

  return (
    <>
      <SelectedGame />
    </>
  )
}

export default App
