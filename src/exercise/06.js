// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
  fetchPokemon,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState(null)

  React.useEffect(() => {
    if (pokemonName.length === 0) {
      return
    } else {
      setPokemon(null)
      fetchPokemon(pokemonName).then(response => setPokemon(response))
    }
  }, [pokemonName])

  return (
    <>
      {!pokemonName ? (
        <span>Submit a pokemon</span>
      ) : pokemon !== null ? (
        <PokemonDataView pokemon={pokemon} />
      ) : (
        <PokemonInfoFallback name={pokemonName} />
      )}
    </>
  )
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
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
