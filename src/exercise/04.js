// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React, { useMemo} from 'react'
import {useLocalStorageState} from '../utils'

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [currentSquares, setSquares] = useLocalStorageState(
    'game',
    Array(9).fill(null),
  )
  const [history, setMoves] = useLocalStorageState('moves', [])
  const [indexMove, setIndexMove] = useLocalStorageState('indexMove', null)
  const nextValue = useMemo(
    () => calculateNextValue(currentSquares),
    [currentSquares],
  )
  const winner = useMemo(
    () => calculateWinner(currentSquares),
    [currentSquares],
  )
  const status = useMemo(
    () => calculateStatus(winner, currentSquares, nextValue),
    [currentSquares, winner, nextValue],
  )

  function selectSquare(square) {
    let squaresCopy = [...currentSquares]

    if (squaresCopy[square] !== null || winner) {
      return
    } else {
      const historyCopy = history.slice(0, indexMove + 1)
      squaresCopy[square] = nextValue
      setSquares(squaresCopy)
      setMoves([...historyCopy, squaresCopy])
      setIndexMove(history.length)
    }
  }

  function gotoMove(move) {
    const currentMove = history[move]
    setIndexMove(move)
    setSquares(currentMove)
  }

  function restart() {
    setSquares(Array(9).fill(null))
    setIndexMove(0)
    setMoves([Array(9).fill(null)])
  }

  const moves = history?.map((move, item) => {
    const isCurrentStep = item === indexMove
    const desc = item === 0 ? 'Go to start' : `Go to move #${item}`
    return (
      <li key={item * 3}>
        <button onClick={() => gotoMove(item)} disabled={item === indexMove}>
          {desc}
          {isCurrentStep && '(current)'}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
