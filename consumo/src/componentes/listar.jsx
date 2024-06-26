import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AiOutlinePlus, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'; // Importa el icono de "agregar" de react-icons

import './css/listar.css'

function Listar() {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/empleado/empleado/');
        setEmpleados(response.data);
      } catch (error) {
        console.error('Error fetching empleados:', error);
      }
    };

    fetchEmpleados();
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('¿Está seguro de que desea eliminar este empleado?');
    if (isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:8000/empleado/empleado/${id}/`);
        setEmpleados(empleados.filter(empleado => empleado.documento !== id));
      } catch (error) {
        console.error('Error deleting empleado:', error);
      }
    }
  };

  return (
    <div>
    <h3>
      <Link to="/registrar" className="registrar-btn">
        <AiOutlinePlus className="icon icon-agregate" /> Registrar empleado
      </Link>
    </h3>
      
      <table>
        <thead>
          <tr>
            <th>Documento</th>
            <th>Tipo de Documento</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>Departamento</th>
            <th>Salario Básico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.length > 0 ? (
            empleados.map(empleado => (
              <tr key={empleado.documento}>
                <td>{empleado.documento}</td>
                <td>{empleado.tipoDocumento}</td>
                <td>{empleado.nombre}</td>
                <td>{empleado.apellidos}</td>
                <td>{empleado.correo}</td>
                <td>{empleado.telefono}</td>
                <td>{empleado.direccion}</td>
                <td>{empleado.ciudad}</td>
                <td>{empleado.departamento}</td>
                <td>{empleado.salarioBasico}</td>
                <td>
                
                  <button className="eliminar-btn" onClick={() => handleDelete(empleado.documento)}>
                    <AiOutlineDelete className="icon icon-delete" />
                  </button>
                  <Link to={`/actualizar/${empleado.documento}`} className="editar-btn">
                    <AiOutlineEdit className="icon icon-editar" />
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No hay empleados para mostrar</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Listar;
