import { useState, useEffect } from 'react'
import './App.css'
import { supabase } from './lib/supabase'

function App() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])

  // auth
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authMessage, setAuthMessage] = useState('')

  // task form
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  /* =========================
     BACKEND
  ========================= */

  async function fetchTasks(currentUser) {
    if (!currentUser) return

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return
    setTasks(data)
  }

  async function handleAuth(e) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    setAuthMessage('')

    if (isSignup) {
      // CADASTRO
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      setAuthLoading(false)

      if (error) {
        setAuthError(error.message)
        return
      }

      setAuthMessage(
        'Conta criada! Verifique seu email para confirmar.'
      )
      setIsSignup(false)
      setEmail('')
      setPassword('')
    } else {
      // LOGIN
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      setAuthLoading(false)

      if (error) {
        setAuthError(error.message)
        return
      }

      setEmail('')
      setPassword('')
    }
  }

  async function handleCreateTask(e) {
    e.preventDefault()
    if (!title.trim() || !user) return

    const { error } = await supabase.from('tasks').insert([
      {
        title,
        description,
        user_id: user.id,
      },
    ])

    if (error) return

    setTitle('')
    setDescription('')
    fetchTasks(user)
  }

  async function handleToggleTask(taskId, currentStatus) {
    if (!user) return

    await supabase
      .from('tasks')
      .update({ completed: !currentStatus })
      .eq('id', taskId)
      .eq('user_id', user.id)

    fetchTasks(user)
  }

  async function handleDeleteTask(taskId) {
    if (!user) return

    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir esta tarefa?'
    )
    if (!confirmDelete) return

    await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', user.id)

    fetchTasks(user)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setTasks([])
  }

  /* =========================
     AUTH LISTENER
  ========================= */

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchTasks(session.user)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user)
          fetchTasks(session.user)
        } else {
          setUser(null)
          setTasks([])
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  /* =========================
     UI
  ========================= */

  return (
    <div style={{ maxWidth: 420, margin: '60px auto' }}>
      <h2 className="saudacao">Bem vindo ao meu sistema de gerenciamento de tarefas!</h2>
      {!user ? (
        <>
          <h2>{isSignup ? 'Criar conta' : 'Login'}</h2>

          <form className="auth-form" onSubmit={handleAuth}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" disabled={authLoading}>
              {authLoading
                ? 'Aguarde...'
                : isSignup
                ? 'Cadastrar'
                : 'Entrar'}
            </button>
          </form>

          {authError && (
            <p style={{ color: 'red' }}>{authError}</p>
          )}

          {authMessage && (
            <p style={{ color: 'green' }}>{authMessage}</p>
          )}

          <p style={{ marginTop: 12 }}>
            {isSignup
              ? 'Já tem conta?'
              : 'Não tem conta ainda?'}{' '}
            <button
              onClick={() => {
                setIsSignup(!isSignup)
                setAuthError('')
                setAuthMessage('')
              }}
            >
              {isSignup ? 'Entrar' : 'Cadastrar'}
            </button>
          </p>
        </>
      ) : (
        <>
          <button onClick={handleLogout}>Sair</button>

          <h2>Minhas tarefas</h2>

          <form onSubmit={handleCreateTask}>
            <input
              type="text"
              placeholder="Título da tarefa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Descrição"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

            <button type="submit">Adicionar tarefa</button>
          </form>

          <p>Total de tarefas: {tasks.length}</p>

          {tasks.length === 0 ? (
            <p>Nenhuma tarefa encontrada</p>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  <strong
                    style={{
                      textDecoration: task.completed
                        ? 'line-through'
                        : 'none',
                    }}
                  >
                    {task.title}
                  </strong>
                  <p>{task.description}</p>

                  <button
                    onClick={() =>
                      handleToggleTask(
                        task.id,
                        task.completed
                      )
                    }
                  >
                    {task.completed
                      ? 'Desmarcar'
                      : 'Concluir'}
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteTask(task.id)
                    }
                    style={{ marginLeft: 8 }}
                  >
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

export default App
