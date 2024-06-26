import React, { useState } from 'react';

const Registrar = () => {
  const initialState = {
    documento: '',
    idEstado: '', // Assuming this is a state ID, adjust as needed
    tipoDocumento: '',
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    salarioBasico: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.documento || !formData.nombre || !formData.apellidos || !formData.correo || !formData.salarioBasico ) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/empleado/empleado/', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resJson = await response.json();
      if (response.status === 201) {
        setFormData(initialState); // Reset form fields
        setMessage('Empleado registrado exitosamente');
        setError('');
      } else {
        setMessage('Ocurrió un error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Ocurrió un error al procesar la solicitud');
    }
  };

  return (
    <>
      <h1>Formulario de Registro de Empleado</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Número de documento *</label>
          <input
            type="text"
            name="documento"
            value={formData.documento}
            placeholder="Número de documento"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Tipo de documento *</label>
          <select
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
          >
            <option value="">Selecciona tipo de documento</option>
            <option value="CC">CC</option>
            <option value="TI">TI</option>
            <option value="CE">CE</option>
            <option value="CD">CD</option>
          </select>
        </div>

        <div className="form-group">
          <label>Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            placeholder="Nombre"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Apellidos *</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            placeholder="Apellidos"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Correo *</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            placeholder="Correo"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            placeholder="Teléfono"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            placeholder="Dirección"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Ciudad</label>
          <input
            type="text"
            name="ciudad"
            value={formData.ciudad}
            placeholder="Ciudad"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Departamento</label>
          <input
            type="text"
            name="departamento"
            value={formData.departamento}
            placeholder="Departamento"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Salario Básico</label>
          <input
            type="number"
            name="salarioBasico"
            value={formData.salarioBasico}
            placeholder="Salario Básico"
            onChange={handleChange}
          />
        </div>

        <button type="submit">Registrar</button>

        {message && <div className="message">{message}</div>}
        {error && <div className="error">{error}</div>}
      </form>
    </>
  );
};

export default Registrar;