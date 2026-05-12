import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, BookOpen, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';

const Materias = () => {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [formData, setFormData] = useState({ nombre_materia: '', clave_materia: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMaterias();
  }, []);

  const fetchMaterias = async () => {
    try {
      const response = await api.get('/materias');
      setMaterias(response.data.content || []);
    } catch (error) {
      toast.error('Error al cargar las materias');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre_materia) newErrors.nombre_materia = 'El nombre es obligatorio';
    if (!formData.clave_materia) newErrors.clave_materia = 'La clave es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (selectedMateria) {
        await api.put(`/materias/${selectedMateria.id_materia}`, formData);
        toast.success('Materia actualizada con éxito');
      } else {
        await api.post('/materias', formData);
        toast.success('Materia creada con éxito');
      }
      setIsModalOpen(false);
      fetchMaterias();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar la materia');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/materias/${selectedMateria.id_materia}`);
      toast.success('Materia eliminada');
      fetchMaterias();
    } catch (error) {
      toast.error('No se pudo eliminar la materia');
    }
  };

  const openModal = (materia = null) => {
    setSelectedMateria(materia);
    setFormData(materia ? { ...materia } : { nombre_materia: '', clave_materia: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="search-box glass">
          <Search size={22} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o clave..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <Plus size={22} />
          <span>Nueva Materia</span>
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Cargando materias...</div>
      ) : (
        <div className="data-grid">
          {materias.length === 0 ? (
            <div className="empty-state glass">
              <BookOpen size={64} color="var(--text-muted)" />
              <p>No hay materias registradas en el sistema.</p>
              <button className="text-btn" onClick={() => openModal()}>Crear la primera</button>
            </div>
          ) : (
            materias.filter(m => m.nombre_materia.toLowerCase().includes(searchTerm.toLowerCase()) || m.clave_materia.toLowerCase().includes(searchTerm.toLowerCase())).map((materia) => (
              <div key={materia.id_materia} className="glass data-card">
                <div className="card-content">
                  <div className="card-icon">
                    <BookOpen size={28} />
                  </div>
                  <div className="card-info">
                    <h3>{materia.nombre_materia}</h3>
                    <p className="clave-text">Clave: {materia.clave_materia}</p>
                  </div>
                </div>
                <div className="card-actions">
                  <button onClick={() => openModal(materia)} className="action-btn edit" title="Editar">
                    <Edit2 size={20} />
                  </button>
                  <button onClick={() => { setSelectedMateria(materia); setIsConfirmOpen(true); }} className="action-btn delete" title="Eliminar">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL PARA CREAR/EDITAR */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass modal-content"
            >
              <div className="modal-header">
                <h3>{selectedMateria ? 'Editar Materia' : 'Nueva Materia'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="close-btn"><X /></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="input-group">
                  <label>Nombre de la Materia</label>
                  <input 
                    type="text" 
                    value={formData.nombre_materia} 
                    onChange={(e) => setFormData({...formData, nombre_materia: e.target.value})}
                    className={errors.nombre_materia ? 'error' : ''}
                    placeholder="Ej. Programación Avanzada"
                  />
                  {errors.nombre_materia && <span className="error-text">{errors.nombre_materia}</span>}
                </div>
                <div className="input-group">
                  <label>Clave de Materia</label>
                  <input 
                    type="text" 
                    value={formData.clave_materia} 
                    onChange={(e) => setFormData({...formData, clave_materia: e.target.value})}
                    className={errors.clave_materia ? 'error' : ''}
                    placeholder="Ej. PROG-102"
                  />
                  {errors.clave_materia && <span className="error-text">{errors.clave_materia}</span>}
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline">Cancelar</button>
                  <button type="submit" className="btn-primary">
                    {selectedMateria ? 'Guardar Cambios' : 'Crear Materia'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="¿Eliminar Materia?"
        message={`¿Estás seguro de que deseas eliminar la materia "${selectedMateria?.nombre_materia}"? Esta acción no se puede deshacer.`}
      />

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 40px;
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
          padding: 18px 0;
          font-size: 1rem;
        }

        .data-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 32px;
        }

        .data-card {
          padding: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: var(--transition);
        }

        .data-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
        }

        .card-content {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .card-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05));
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .card-info h3 {
          font-size: 1.25rem;
          margin-bottom: 6px;
        }

        .clave-text {
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .card-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition);
        }

        .action-btn:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        .action-btn.delete:hover {
          color: #ef4444;
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }

        .modal-content {
          width: 100%;
          max-width: 500px;
          padding: 40px;
          border-radius: 28px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .input-group label {
          display: block;
          margin-bottom: 12px;
          font-size: 0.95rem;
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

        .error-text {
          color: #ef4444;
          font-size: 0.8rem;
          margin-top: 6px;
          display: block;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-state {
          grid-column: 1 / -1;
          padding: 120px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default Materias;
