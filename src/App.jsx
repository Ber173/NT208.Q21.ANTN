import { useState } from 'react'
import Submitted from './assets/animation/Submitted.json'
import Lottie from 'lottie-react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Lottie animationData={Submitted} />
        <h1 class="text-3xl font-bold underline">Hello world!</h1>
      </div>
    </>
  )
}

export default App
