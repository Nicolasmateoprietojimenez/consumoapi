import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Listar from './componentes/listar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/listar">Listar Empleados</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/listar" element={<Listar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
