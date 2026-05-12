import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, User, ChevronLeft, ChevronRight, Filter, X, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const Alumnos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState(null);
  const [formData, setFormData] = useState({ matricula: '', nombre: '', correo: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAlumnos();
  }, [page]);

  const fetchAlumnos = async () => {
    try {
      const response = await api.get(`/alumnos?page=${page}&size=${size}`);
      setAlumnos(response.data.content || response.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error('Error al cargar alumnos');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.matricula) newErrors.matricula = 'La matrícula es obligatoria';
    if (!formData.nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.correo) newErrors.correo = 'El correo es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editingAlumno) {
        await api.put(`/alumnos/${editingAlumno.id_alumno}`, formData);
        toast.success('Alumno actualizado con éxito');
      } else {
        await api.post('/alumnos', formData);
        toast.success('Alumno registrado con éxito');
      }
      setIsModalOpen(false);
      setEditingAlumno(null);
      setFormData({ matricula: '', nombre: '', correo: '', password: '' });
      fetchAlumnos();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al procesar la solicitud');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar a este alumno?')) {
      try {
        await api.delete(`/alumnos/${id}`);
        toast.success('Alumno eliminado con éxito');
        fetchAlumnos();
      } catch (error) {
        toast.error('Error al eliminar alumno');
      }
    }
  };

  const filteredAlumnos = alumnos.filter(a => 
    a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.matricula.includes(searchTerm)
  );

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="search-box glass">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o matrícula..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar alumnos"
          />
        </div>
        <div className="header-actions">
          <button className="btn-outline glass" aria-label="Filtrar">
            <Filter size={20} />
          </button>
          <button className="btn-primary" onClick={() => {
            setEditingAlumno(null);
            setFormData({ matricula: '', nombre: '', correo: '', password: '' });
            setIsModalOpen(true);
          }}>
            <Plus size={20} />
            <span>Nuevo Alumno</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Cargando alumnos...</div>
      ) : (
        <div className="table-wrapper">
          <div className="data-table-container glass">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Matrícula</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlumnos.length > 0 ? filteredAlumnos.map((alumno) => (
                  <tr key={alumno.id_alumno}>
                    <td><code className="badge">{alumno.matricula}</code></td>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">{alumno.nombre.charAt(0).toUpperCase()}</div>
                        <span>{alumno.nombre}</span>
                      </div>
                    </td>
                    <td>{alumno.correo}</td>
                    <td>
                      <span className="status-pill active">Activo</span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button className="text-btn" onClick={() => {
                          setEditingAlumno(alumno);
                          setFormData({ 
                            matricula: alumno.matricula, 
                            nombre: alumno.nombre, 
                            correo: alumno.correo, 
                            password: '' 
                          });
                          setIsModalOpen(true);
                        }} title="Editar">
                          <Edit2 size={18} />
                        </button>
                        <button className="text-btn delete-btn" onClick={() => handleDelete(alumno.id_alumno)} title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="empty-row">No se encontraron resultados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <p className="page-info">Mostrando página {page + 1} de {totalPages}</p>
            <div className="page-controls">
              <button 
                disabled={page === 0} 
                onClick={() => setPage(p => p - 1)}
                className="pagination-btn"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                disabled={page >= totalPages - 1} 
                onClick={() => setPage(p => p + 1)}
                className="pagination-btn"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA NUEVO ALUMNO */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass modal-content"
            >
              <div className="modal-header">
                <h3>{editingAlumno ? 'Editar Alumno' : 'Nuevo Alumno'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="close-btn"><X /></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="input-row">
                  <div className="input-group">
                    <label>Matrícula</label>
                    <input 
                      type="text" 
                      value={formData.matricula} 
                      onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                      placeholder="Ej. 20260001"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Nombre Completo</label>
                    <input 
                      type="text" 
                      value={formData.nombre} 
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Ej. Juan Pérez"
                      required
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Correo Electrónico</label>
                  <input 
                    type="email" 
                    value={formData.correo} 
                    onChange={(e) => setFormData({...formData, correo: e.target.value})}
                    placeholder="usuario@universidad.edu"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Contraseña (Opcional)</label>
                  <input 
                    type="password" 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Dejar vacío para usar matrícula"
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline">Cancelar</button>
                  <button type="submit" className="btn-primary">{editingAlumno ? 'Guardar Cambios' : 'Registrar Alumno'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 40px;
        }

        .header-actions {
          display: flex;
          gap: 16px;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 24px;
          border-radius: 16px;
        }

        .search-icon {
          color: var(--text-muted);
          margin-right: 16px;
        }

        .search-box input {
          flex: 1;
          background: none;
          border: none;
          box-shadow: none;
          padding: 16px 0;
          font-size: 1rem;
        }

        .table-wrapper {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .data-table-container {
          overflow-x: auto;
          padding: 12px;
          border-radius: 20px;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          min-width: 900px;
        }

        .data-table th {
          padding: 20px 28px;
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .data-table td {
          padding: 24px 28px;
          border-top: 1px solid var(--border-color);
        }

        .text-right {
          text-align: right;
        }

        .badge {
          background: rgba(139, 92, 246, 0.1);
          padding: 6px 12px;
          border-radius: 8px;
          font-family: 'Fira Code', monospace;
          color: var(--primary);
          font-weight: 600;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 0.9rem;
        }

        .status-pill {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .status-pill.active {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        .text-btn {
          background: none;
          border: none;
          color: var(--primary);
          cursor: pointer;
          font-weight: 600;
          padding: 8px;
          border-radius: 8px;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .text-btn:hover {
          background: rgba(139, 92, 246, 0.1);
        }

        .delete-btn {
          color: #ef4444;
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .empty-row {
          text-align: center;
          padding: 100px !important;
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 12px;
        }

        .page-info {
          font-size: 0.95rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .page-controls {
          display: flex;
          gap: 16px;
        }

        .pagination-btn {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          cursor: pointer;
          transition: var(--transition);
        }

        .pagination-btn:hover:not(:disabled) {
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-2px);
        }

        .pagination-btn:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }

        .modal-content {
          width: 100%;
          max-width: 600px;
          padding: 40px;
          border-radius: 24px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 640px) {
          .input-row { grid-template-columns: 1fr; }
        }

        .input-group label {
          display: block;
          margin-bottom: 10px;
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 12px;
        }

        .btn-outline {
          background: none;
          border: 1px solid var(--border-color);
          color: var(--text-main);
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--text-muted);
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .close-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
      `}</style>
    </div>
  );
};

export default Alumnos;
