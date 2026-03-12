
# 📝 Task Manager – Fullstack Application

Aplicação fullstack de gerenciamento de tarefas com autenticação de usuários.  
Cada usuário pode criar, visualizar, concluir e excluir **apenas as suas próprias tarefas**, com segurança garantida no backend.

Este projeto foi desenvolvido com foco em **aprendizado real de frontend + backend** e integração com o banco de dados.

OBS: Backend desativado devido a não utilização constante do sistema.
---

## 🚀 Funcionalidades

- Cadastro de usuário (email e senha)
- Login e logout
- Criar tarefas
- Listar tarefas do usuário autenticado
- Marcar tarefa como concluída / pendente
- Excluir tarefas
- Proteção de dados por usuário (RLS)

---

## 🧰 Tecnologias utilizadas

### Frontend
- **React**
- **Vite**
- **JavaScript**
- **CSS puro**
  - Flexbox
  

### Backend
  - Supabase
  - Authentication (email/senha)
  - PostgreSQL
  - Row Level Security (RLS)
  - Policies para SELECT, INSERT, UPDATE e DELETE

---

## 🏗️ Arquitetura e conceitos aplicados

- Aplicação **fullstack**
- Autenticação baseada em sessão
- Segurança no nível do banco de dados
- UI reagindo ao estado de autenticação

---

## 🔐 Segurança

A aplicação utiliza Row Level Security (RLS) no PostgreSQL, garantindo que:

- Cada usuário só possa:
  - Ver suas próprias tarefas
  - Criar tarefas para si
  - Atualizar suas tarefas
  - Excluir suas tarefas
- Mesmo que alguém tente manipular requisições no frontend, o banco bloqueia acessos indevidos.


git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
