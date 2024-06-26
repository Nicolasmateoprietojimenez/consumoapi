import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Listar from './componentes/listar';
import EmpleadoForm from './componentes/actualizar';
import Registrar from './componentes/registrar';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Listar/>} />
          <Route path="/actualizar/:documento" element={<EmpleadoForm/>} />
          <Route path="/registrar" element={<Registrar/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;