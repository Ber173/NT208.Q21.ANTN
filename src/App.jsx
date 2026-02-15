import { useState } from 'react'
import Submitted from './Submitted.json'
import Lottie from 'lottie-react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Lottie animationData={Submitted} />
      </div>
    </>
  )
}

export default App
