import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"
import TaskList from "./pages/TaskList"
import AddTask from "./pages/AddTask"
import TaskDetail from "./pages/TaskDetail"
import { GlobalProvider } from "./context/GlobalContext"

function App() {

  return (
    <GlobalProvider>
      <BrowserRouter>
      
        <nav>
          <NavLink to="/">Lista Task</NavLink>
          <NavLink to="/add">Aggiungi Task</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<TaskList/>}/>
          <Route path="/add" element={<AddTask/>}/>
          <Route path="/task/:id" element={<TaskDetail/>}/>
        </Routes>

      </BrowserRouter>
    </GlobalProvider>
  )
}

export default App
