import { useState } from 'react'
import './styles/Generator.css'
import Generator from './components/Generator'
import useFetch from './hooks/useFetch'


function App() {
  const [count, setCount] = useState(0)
  const baseUrl = 'https://everchic-service.onrender.com/api/v1'
  // const baseUrl = 'http://localhost:8080/api/v1'
  const [infoApi, getApi, createRegister, deleteRegister, updateRegister, autenticOrder, generateOrder] = useFetch(baseUrl)

  return (
    <>
    <Generator generateOrder={generateOrder} infoApi={infoApi}/>
    </>
  )
}

export default App
