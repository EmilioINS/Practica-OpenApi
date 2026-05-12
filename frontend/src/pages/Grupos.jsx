import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, UsersRound, BookOpen, ChevronRight, X, UserPlus, Presentation, Trash2, UserMinus } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const Grupos = () => {
  const [grupos, setGrupos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [availableAlumnos, setAvailableAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  
  const [formData, setFormData] = useState({ nombre_grupo: '', id_materia: '' });
  const [teamFormData, setTeamFormData] = useState({ nombre_equipo: '', id_grupo: '' });
  const [selectedAlumnoId, setSelectedAlumnoId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gruposRes, materiasRes] = await Promise.all([
        api.get('/grupos'),
        api.get('/materias')
      ]);
      setGrupos(gruposRes.data || []);
      setMaterias(materiasRes.data.content || materiasRes.data || []);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableAlumnos = async () => {
    try {
      const response = await api.get('/alumnos/available');
      setAvailableAlumnos(response.data || []);
    } catch (error) {
      toast.error('Error al cargar alumnos disponibles');
    }
  };

  const handleShowDetails = async (id_grupo) => {
    try {
      setLoading(true);
      const response = await api.get(`/grupos/${id_grupo}`);
      setSelectedGrupo(response.data);
      setIsDetailsOpen(true);
    } catch (error) {
      toast.error('No se pudieron obtener los detalles del grupo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/grupos', formData);
      toast.success('Grupo creado con éxito');
      setIsModalOpen(false);
      setFormData({ nombre_grupo: '', id_materia: '' });
      fetchData();
    } catch (error) {
      toast.error('Error al crear el grupo');
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await api.post('/equipos', teamFormData);
      toast.success('Equipo creado con éxito');
      setIsTeamModalOpen(false);
      setTeamFormData({ nombre_equipo: '', id_grupo: '' });
      handleShowDetails(selectedGrupo.id_grupo);
    } catch (error) {
      toast.error('Error al crear el equipo');
    }
  };

  const handleOpenAssignModal = (equipo) => {
    setSelectedEquipo(equipo);
    fetchAvailableAlumnos();
    setIsAssignModalOpen(true);
  };

  const handleAssignAlumno = async (e) => {
    e.preventDefault();
    if (!selectedAlumnoId) return toast.warning('Selecciona un alumno');
    
    try {
      await api.put(`/alumnos/${selectedAlumnoId}/assign/${selectedEquipo.id_equipo}`);
      toast.success('Alumno asignado al equipo');
      setIsAssignModalOpen(false);
      setSelectedAlumnoId('');
      handleShowDetails(selectedGrupo.id_grupo);
    } catch (error) {
      toast.error('Error al asignar el alumno');
    }
  };

  const handleRemoveAlumno = async (id_alumno) => {
    try {
      await api.delete(`/alumnos/${id_alumno}/unassign`);
      toast.success('Alumno removido del equipo');
      handleShowDetails(selectedGrupo.id_grupo);
    } catch (error) {
      toast.error('Error al remover el alumno');
    }
  };

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="title-group">
          <p className="subtitle">Administra tus secciones y grupos de clase</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={22} />
          <span>Crear Grupo</span>
        </button>
      </div>

      {loading && !isDetailsOpen ? (
        <div className="loading-state">Cargando grupos...</div>
      ) : (
        <div className="grupos-grid">
          {grupos.length > 0 ? grupos.map((grupo) => (
            <div key={grupo.id_grupo} className="glass grupo-card">
              <div className="grupo-icon">
                <UsersRound size={28} />
              </div>
              <div className="grupo-info">
                <h3>{grupo.nombre_grupo}</h3>
                <div className="materia-tag">
                  <BookOpen size={14} />
                  <span>Materia ID: {grupo.id_materia}</span>
                </div>
              </div>
              <button className="details-btn" onClick={() => handleShowDetails(grupo.id_grupo)}>
                <span>Gestionar Grupo</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )) : (
            <div className="empty-state glass">
              <UsersRound size={60} color="var(--text-muted)" />
              <p>No has creado ningún grupo todavía.</p>
              <button className="text-btn" onClick={() => setIsModalOpen(true)}>Empezar ahora</button>
            </div>
          )}
        </div>
      )}

      {/* MODAL DETALLES DEL GRUPO */}
      <AnimatePresence>
        {isDetailsOpen && selectedGrupo && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass modal-content detail-modal"
            >
              <div className="modal-header">
                <div>
                  <h2 className="detail-title">{selectedGrupo.nombre_grupo}</h2>
                  <p className="detail-subtitle">{selectedGrupo.materia.nombre_materia}</p>
                </div>
                <button onClick={() => setIsDetailsOpen(false)} className="close-btn"><X /></button>
              </div>

              <div className="modal-body">
                <section className="detail-section">
                  <div className="section-header">
                    <h4>Equipos e Integrantes</h4>
                    <button className="btn-primary small" onClick={() => {
                      setTeamFormData({ nombre_equipo: '', id_grupo: selectedGrupo.id_grupo });
                      setIsTeamModalOpen(true);
                    }}>
                      <Plus size={16} />
                      Nuevo Equipo
                    </button>
                  </div>
                  
                  <div className="equipos-list">
                    {selectedGrupo.equipos.length > 0 ? selectedGrupo.equipos.map(equipo => (
                      <div key={equipo.id_equipo} className="equipo-container glass">
                        <div className="equipo-header">
                          <div className="equipo-title">
                            <span className="equipo-name">{equipo.nombre_equipo}</span>
                            <span className="count-badge">{equipo.integrantes.length} alumnos</span>
                          </div>
                          <button className="icon-btn primary" onClick={() => handleOpenAssignModal(equipo)}>
                            <UserPlus size={18} />
                          </button>
                        </div>
                        
                        <div className="integrantes-list">
                          {equipo.integrantes.length > 0 ? equipo.integrantes.map(alumno => (
                            <div key={alumno.id_alumno} className="alumno-item">
                              <div className="alumno-info">
                                <span className="alumno-name">{alumno.nombre}</span>
                                <span className="alumno-mat">{alumno.matricula}</span>
                              </div>
                              <button className="remove-btn" onClick={() => handleRemoveAlumno(alumno.id_alumno)}>
                                <UserMinus size={16} />
                              </button>
                            </div>
                          )) : (
                            <p className="empty-mini">Sin integrantes. Agrega alumnos a este equipo.</p>
                          )}
                        </div>
                      </div>
                    )) : (
                      <p className="empty-mini">No hay equipos creados. Agrega un equipo primero.</p>
                    )}
                  </div>
                </section>
              </div>

              <div className="modal-footer">
                <button className="btn-outline" onClick={() => setIsDetailsOpen(false)}>Cerrar Panel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL ASIGNAR ALUMNO */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <div className="modal-overlay assign-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass modal-content"
            >
              <div className="modal-header">
                <h3>Agregar Integrante</h3>
                <button onClick={() => setIsAssignModalOpen(false)} className="close-btn"><X /></button>
              </div>
              <p className="modal-desc">Asignando a: <strong>{selectedEquipo?.nombre_equipo}</strong></p>
              <form onSubmit={handleAssignAlumno} className="modal-form">
                <div className="input-group">
                  <label>Seleccionar Alumno Disponible</label>
                  <select 
                    value={selectedAlumnoId} 
                    onChange={(e) => setSelectedAlumnoId(e.target.value)}
                    required
                  >
                    <option value="">-- Elige un alumno --</option>
                    {availableAlumnos.map(a => (
                      <option key={a.id_alumno} value={a.id_alumno}>
                        {a.nombre} ({a.matricula})
                      </option>
                    ))}
                  </select>
                  <p className="hint">Solo aparecen alumnos que no pertenecen a ningún otro equipo.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setIsAssignModalOpen(false)} className="btn-outline">Cancelar</button>
                  <button type="submit" className="btn-primary">Asignar al Equipo</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL CREAR EQUIPO */}
      <AnimatePresence>
        {isTeamModalOpen && (
          <div className="modal-overlay team-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass modal-content"
            >
              <div className="modal-header">
                <h3>Nuevo Equipo</h3>
                <button onClick={() => setIsTeamModalOpen(false)} className="close-btn"><X /></button>
              </div>
              <form onSubmit={handleCreateTeam} className="modal-form">
                <div className="input-group">
                  <label>Nombre del Equipo</label>
                  <input 
                    type="text" 
                    value={teamFormData.nombre_equipo} 
                    onChange={(e) => setTeamFormData({...teamFormData, nombre_equipo: e.target.value})}
                    placeholder="Ej. Equipo Innovación"
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setIsTeamModalOpen(false)} className="btn-outline">Cancelar</button>
                  <button type="submit" className="btn-primary">Crear Equipo</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL CREAR GRUPO */}
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
                <h3>Crear Nuevo Grupo</h3>
                <button onClick={() => setIsModalOpen(false)} className="close-btn"><X /></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="input-group">
                  <label>Nombre del Grupo</label>
                  <input 
                    type="text" 
                    value={formData.nombre_grupo} 
                    onChange={(e) => setFormData({...formData, nombre_grupo: e.target.value})}
                    placeholder="Ej. Grupo 101 - Mañana"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Materia</label>
                  <select 
                    value={formData.id_materia} 
                    onChange={(e) => setFormData({...formData, id_materia: e.target.value})}
                    required
                  >
                    <option value="">Selecciona la materia</option>
                    {materias.map(m => (
                      <option key={m.id_materia} value={m.id_materia}>{m.nombre_materia}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-primary full-width">Crear Grupo</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; }
        .grupos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; }
        .grupo-card { padding: 32px; display: flex; flex-direction: column; gap: 24px; transition: var(--transition); }
        .grupo-card:hover { transform: translateY(-8px); border-color: var(--primary); }
        .grupo-icon { width: 56px; height: 56px; background: rgba(6, 182, 212, 0.1); color: var(--secondary); border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .grupo-info h3 { font-size: 1.4rem; margin-bottom: 8px; }
        .materia-tag { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.9rem; }
        .details-btn { margin-top: 8px; display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-main); cursor: pointer; transition: var(--transition); font-weight: 600; }
        .details-btn:hover { background: var(--primary); border-color: var(--primary); color: white; }

        .detail-modal { max-width: 700px !important; max-height: 90vh; overflow-y: auto; }
        .detail-title { font-size: 2.2rem; margin-bottom: 4px; }
        .detail-subtitle { color: var(--secondary); font-weight: 600; font-size: 1.1rem; }
        .detail-section { margin-top: 32px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .count-badge { background: var(--bg-card); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 800; color: var(--primary); }

        .equipos-list { display: flex; flex-direction: column; gap: 24px; }
        .equipo-container { padding: 0; overflow: hidden; border-radius: 20px; }
        .equipo-header { padding: 20px 24px; background: rgba(255, 255, 255, 0.03); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); }
        .equipo-title { display: flex; align-items: center; gap: 12px; }
        .equipo-name { font-weight: 700; font-size: 1.2rem; }
        
        .integrantes-list { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
        .alumno-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-radius: 12px; background: rgba(255, 255, 255, 0.02); transition: var(--transition); }
        .alumno-item:hover { background: rgba(255, 255, 255, 0.05); }
        .alumno-info { display: flex; flex-direction: column; }
        .alumno-name { font-weight: 600; font-size: 0.95rem; }
        .alumno-mat { font-size: 0.8rem; color: var(--text-muted); }

        .remove-btn { background: none; border: none; color: #ef4444; cursor: pointer; opacity: 0.6; transition: 0.2s; }
        .remove-btn:hover { opacity: 1; transform: scale(1.1); }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 24px; }
        .team-modal-overlay, .assign-modal-overlay { z-index: 1100; }
        .modal-content { width: 100%; max-width: 500px; padding: 40px; border-radius: 28px; }
        .modal-header { display: flex; justify-content: space-between; margin-bottom: 32px; }
        .modal-desc { margin-bottom: 24px; color: var(--text-muted); font-size: 1.1rem; }
        .hint { font-size: 0.8rem; color: var(--text-muted); font-style: italic; margin-top: 8px; }

        .icon-btn { width: 44px; height: 44px; border-radius: 12px; background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
        .icon-btn.primary { color: var(--primary); }
        .icon-btn:hover { transform: scale(1.05); border-color: var(--primary); }

        .close-btn { background: rgba(255, 255, 255, 0.05); border: none; color: var(--text-muted); cursor: pointer; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .btn-primary.small { padding: 10px 20px; font-size: 0.9rem; }
      `}</style>
    </div>
  );
};

export default Grupos;
