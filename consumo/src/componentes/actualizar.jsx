import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './css/actualizar.css'
const EmpleadoForm = () => {
  const { documento } = useParams();
  const [empleado, setEmpleado] = useState({
    documento: '',
    tipoDocumento: '',
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    salarioBasico: '',
    idEstado: ''
  });

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/empleado/empleado/${documento}/`)
      .then(response => {
        setEmpleado(response.data);
      })
      .catch(error => {
        console.error('Hubo un error al obtener los datos del empleado:', error);
      });
  }, [documento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpleado(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://127.0.0.1:8000/empleado/empleado/${documento}/`, empleado)
      .then(response => {
        alert('Datos actualizados exitosamente');
      })
      .catch(error => {
        console.error('Hubo un error al actualizar los datos del empleado:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Documento:</label>
        <input type="text" name="documento" value={empleado.documento} onChange={handleChange} disabled />
      </div>
      <div>
        <label>Tipo de Documento:</label>
        <input type="text" name="tipoDocumento" value={empleado.tipoDocumento} onChange={handleChange} />
      </div>
      <div>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={empleado.nombre} onChange={handleChange} />
      </div>
      <div>
        <label>Apellidos:</label>
        <input type="text" name="apellidos" value={empleado.apellidos} onChange={handleChange} />
      </div>
      <div>
        <label>Correo:</label>
        <input type="email" name="correo" value={empleado.correo} onChange={handleChange} />
      </div>
      <div>
        <label>Teléfono:</label>
        <input type="text" name="telefono" value={empleado.telefono} onChange={handleChange} />
      </div>
      <div>
        <label>Dirección:</label>
        <input type="text" name="direccion" value={empleado.direccion} onChange={handleChange} />
      </div>
      <div>
        <label>Ciudad:</label>
        <input type="text" name="ciudad" value={empleado.ciudad} onChange={handleChange} />
      </div>
      <div>
        <label>Departamento:</label>
        <input type="text" name="departamento" value={empleado.departamento} onChange={handleChange} />
      </div>
      <div>
        <label>Salario Básico:</label>
        <input type="number" name="salarioBasico" value={empleado.salarioBasico} onChange={handleChange} />
      </div>
      <div>
        <label>ID Estado:</label>
        <input type="number" name="idEstado" value={empleado.idEstado} onChange={handleChange} />
      </div>
      <button type="submit">Actualizar</button>
      <Link to={`/`}>Volver</Link>
    </form>

    
  );
};

export default EmpleadoForm;
