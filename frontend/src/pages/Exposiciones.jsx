import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Presentation, Calendar, MapPin, Clock, Plus, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const Exposiciones = () => {
  const [exposiciones, setExposiciones] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ tema: '', fecha: '', id_equipo: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [exposRes, equiposRes] = await Promise.all([
        api.get('/exposiciones'),
        api.get('/equipos')
      ]);
      setExposiciones(exposRes.data || []);
      setEquipos(equiposRes.data || []);
    } catch (error) {
      toast.error('Error al cargar datos del cronograma');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_equipo) {
      return toast.warning('Debes seleccionar un equipo para la exposición');
    }

    try {
      await api.post('/exposiciones', formData);
      toast.success('Exposición programada con éxito');
      setIsModalOpen(false);
      setFormData({ tema: '', fecha: '', id_equipo: '' });
      fetchData();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Error al programar la exposición';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="title-group">
          <p className="subtitle">Cronograma de presentaciones para el semestre</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={22} />
          <span>Programar Presentación</span>
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Cargando cronograma...</div>
      ) : (
        <div className="timeline-container">
          <div className="timeline">
            {exposiciones.length > 0 ? (
              exposiciones.map((expo) => (
                <div key={expo.id_exposicion} className="timeline-item">
                  <div className="timeline-date">
                    <span className="day">{new Date(expo.fecha).getDate() + 1}</span>
                    <span className="month">{new Date(expo.fecha).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="glass expo-card">
                    <div className="expo-content">
                      <h3>{expo.tema}</h3>
                      <div className="expo-meta">
                        <div className="meta-item">
                          <Clock size={18} />
                          <span>10:00 AM - 11:30 AM</span>
                        </div>
                        <div className="meta-item">
                          <MapPin size={18} />
                          <span>Aula de Conferencias 302</span>
                        </div>
                      </div>
                      <div className="team-badge">Equipo {expo.id_equipo}</div>
                    </div>
                    <div className="expo-actions">
                      <button className="btn-primary small">Iniciar Evaluación</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state glass">
                <Presentation size={56} color="var(--text-muted)" />
                <p>No hay exposiciones programadas en este momento.</p>
                <button className="text-btn" onClick={() => setIsModalOpen(true)}>Programar la primera</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL PARA NUEVA EXPOSICION */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="glass modal-content expo-modal"
            >
              <div className="modal-header">
                <h3>Programar Exposición</h3>
                <button onClick={() => setIsModalOpen(false)} className="close-btn"><X /></button>
              </div>
              
              {equipos.length === 0 ? (
                <div className="warning-box glass">
                  <AlertTriangle color="#f59e0b" size={32} />
                  <div className="warning-text">
                    <p><strong>No hay equipos creados.</strong></p>
                    <p>Antes de programar una exposición, debes crear al menos un equipo en la sección de Grupos.</p>
                  </div>
                  <button className="btn-primary full-width" onClick={() => setIsModalOpen(false)}>Entendido</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="modal-form">
                  <div className="input-group">
                    <label>Tema de la Exposición</label>
                    <input 
                      type="text" 
                      value={formData.tema} 
                      onChange={(e) => setFormData({...formData, tema: e.target.value})}
                      placeholder="Ej. Arquitectura de Microservicios"
                      required
                    />
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label>Fecha</label>
                      <input 
                        type="date" 
                        value={formData.fecha} 
                        onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Equipo Responsable</label>
                      <select 
                        value={formData.id_equipo} 
                        onChange={(e) => setFormData({...formData, id_equipo: e.target.value})}
                        required
                      >
                        <option value="">Selecciona un equipo</option>
                        {equipos.map(eq => (
                          <option key={eq.id_equipo} value={eq.id_equipo}>
                            {eq.nombre_equipo} (ID: {eq.id_equipo})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn-primary full-width">Confirmar Programación</button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 48px;
        }

        .subtitle { color: var(--text-muted); font-size: 1.1rem; }

        .timeline-container { padding: 20px 0; }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 40px;
          position: relative;
          padding-left: 100px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 44px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, var(--primary), var(--secondary), transparent);
          opacity: 0.3;
        }

        .timeline-item { display: flex; gap: 40px; position: relative; }

        .timeline-date {
          position: absolute;
          left: -100px;
          width: 90px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--bg-dark);
          z-index: 1;
          padding: 10px 0;
        }

        .day { font-size: 1.8rem; font-weight: 800; color: var(--text-main); }
        .month { font-size: 0.85rem; color: var(--primary); text-transform: uppercase; font-weight: 800; margin-top: 6px; }

        .expo-card {
          flex: 1;
          padding: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: var(--transition);
        }

        .expo-card:hover { transform: scale(1.01) translateX(10px); border-color: var(--primary); }

        .expo-content h3 { font-size: 1.4rem; margin-bottom: 16px; }

        .expo-meta { display: flex; gap: 32px; margin-bottom: 24px; }

        .meta-item { display: flex; align-items: center; gap: 10px; font-size: 0.95rem; color: var(--text-muted); }

        .team-badge {
          display: inline-block;
          padding: 6px 16px;
          background: rgba(6, 182, 212, 0.1);
          color: var(--secondary);
          border: 1px solid rgba(6, 182, 212, 0.2);
          border-radius: 24px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .empty-state {
          padding: 80px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
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
          max-width: 550px;
          padding: 40px;
          border-radius: 28px;
        }

        .modal-header { display: flex; justify-content: space-between; margin-bottom: 32px; }

        .modal-form { display: flex; flex-direction: column; gap: 28px; }

        .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

        .input-group label {
          display: block;
          margin-bottom: 12px;
          font-size: 0.95rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .warning-box {
          padding: 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          background: rgba(245, 158, 11, 0.05);
          border-color: rgba(245, 158, 11, 0.2);
        }

        .warning-text p { color: var(--text-main); margin-bottom: 8px; }

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

        .full-width { width: 100%; }
      `}</style>
    </div>
  );
};

export default Exposiciones;
