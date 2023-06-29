// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
  fetchPokemon,
} from '../pokemon'

const states = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}


function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: states.idle,
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (pokemonName.length === 0) {
      return
    } else {
      setState(prev => ({...prev, status: states.pending}))
      fetchPokemon(pokemonName)
        .then(pokemon => {
          setState(prev => ({...prev, status: states.resolved, pokemon}))
        })
        .catch(err => {
          setState(prev => ({...prev, status: states.rejected, error: err}))
        })
    }
  }, [pokemonName])

  if (state.status === states.idle) {
    return <span>Submit a pokemon</span>
  } else if (state.status === states.pending) {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (state.status === states.resolved) {
    return <PokemonDataView pokemon={null} />
  } else if (state.status === states.rejected) {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{state.error.message}</pre>
      </div>
    )
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary  fallback={<p>Something went wrong</p>}>
        <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
