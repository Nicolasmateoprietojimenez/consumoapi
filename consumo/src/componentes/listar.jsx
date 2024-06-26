import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Listar() {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/empleado/empleado/');
        setEmpleados(response.data); // Asegúrate de que response.data es un array de empleados
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
      <h1>Listado de Empleados</h1>
      <ul>
        {Array.isArray(empleados) && empleados.length > 0 ? (
          empleados.map(empleado => (
            <li key={empleado.documento}>
              {empleado.nombre} - {empleado.apellidos}
              <button onClick={() => handleDelete(empleado.documento)}>Eliminar</button>
            </li>
          ))
        ) : (
          <li>No hay empleados para mostrar</li>
        )}
      </ul>
    </div>
  );
}

export default Listar;
