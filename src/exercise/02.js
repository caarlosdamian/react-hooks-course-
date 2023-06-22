// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorage = (
  key,
  initialName = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return typeof initialName === 'function' ? initialName() : initialName
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKy = prevKeyRef.current
    if (prevKy !== key) {
      window.localStorage.removeItem(prevKy)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [state, key, serialize])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setState] = useLocalStorage('prueba')

  function handleChange(event) {
    setState(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
