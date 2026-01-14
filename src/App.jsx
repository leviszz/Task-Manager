import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'
import { supabase } from './lib/supabase'


function App() {
  const [count, setCount] = useState(0)
  console.log('Supabase client:', supabase)


  async function testLogin() {
      const {data, error} = await supabase.auth.signUp({
          email: 'teste@gmail.com',
        password: '12345678',
      })
      console.log('LOGIN DATA', data)
      console.log('LOGIN ERROR', error)

  }



  async function createTask() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log('Nenhum usuário logado')
    return
  }

  const { data, error } = await supabase.from('tasks').insert([
    {
      title: 'Minha primeira tarefa',
      description: 'Criada direto do React',
      user_id: user.id,
    },
  ])

  console.log('TASK DATA:', data)
  console.log('TASK ERROR:', error)
}



async function fetchTasks() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log('Nenhum usuário logado')
    return
  }

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  console.log('TASKS DATA:', data)
  console.log('TASKS ERROR:', error)
}



async function completeTask() {
  const taskId = '8ad54ee1-cedd-49cb-b9f9-d8dadec3260e'

  const { data, error } = await supabase
    .from('tasks')
    .update({ completed: true })
    .eq('id', taskId)

  console.log('UPDATE DATA:', data)
  console.log('UPDATE ERROR:', error)
}



async function deleteTask() {
  const taskId = '97ee22ea-1fbf-49b7-9bd0-b0909c20a855'

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  console.log('DELETE ERROR:', error)
}




  useEffect(() => {
  //testLogin()
  //createTask()
  //fetchTasks()
  //completeTask()
  deleteTask()
}, [])


  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
