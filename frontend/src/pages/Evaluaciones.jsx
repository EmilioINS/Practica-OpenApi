import { useState, useEffect } from 'react';
import api from '../api/axios';
import { ClipboardCheck, Star, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Evaluaciones = () => {
  const [exposiciones, setExposiciones] = useState([]);
  const [criterios, setCriterios] = useState([]);
  const [selectedExpo, setSelectedExpo] = useState(null);
  const [comentarios, setComentarios] = useState('');
  const [calificaciones, setCalificaciones] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeCriterioIndex, setActiveCriterioIndex] = useState(0);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [exposRes, criteriosRes, userRes, alumnosRes] = await Promise.all([
        api.get('/exposiciones'),
        api.get('/evaluaciones/criterios'),
        api.get('/auth/me'),
        api.get('/alumnos?size=1000')
      ]);
      
      setExposiciones(exposRes.data || []);
      setCriterios(criteriosRes.data || []);
      
      const loggedUser = userRes.data;
      const matchingStudent = (alumnosRes.data?.content || alumnosRes.data || []).find(
        student => student.matricula === loggedUser.username
      );
      
      setCurrentUser({
        ...loggedUser,
        id_alumno: matchingStudent ? matchingStudent.id_alumno : null,
        nombre_alumno: matchingStudent ? matchingStudent.nombre : loggedUser.username
      });
      
      // Initialize ratings
      const initialRatings = {};
      criteriosRes.data.forEach(c => {
        initialRatings[c.id] = 0;
      });
      setCalificaciones(initialRatings);
      
    } catch (error) {
      toast.error('Error al cargar datos de evaluación');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleRating = (criterioId, rating) => {
    setCalificaciones(prev => ({ ...prev, [criterioId]: rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExpo) return toast.warning('Selecciona una exposición');
    
    // Check if user is a student
    if (!currentUser?.id_alumno) {
      return toast.error('Solo los alumnos registrados pueden evaluar exposiciones');
    }

    // Check if all ratings are filled
    if (Object.values(calificaciones).some(v => v === 0)) {
      return toast.warning('Por favor califica todos los criterios de la rúbrica');
    }

    setLoading(true);
    try {
      const detalles = Object.entries(calificaciones).map(([id, val]) => ({
        id_criterio: parseInt(id),
        calificacion: val
      }));

      await api.post('/evaluaciones', {
        id_exposicion: selectedExpo.id_exposicion,
        id_alumno_evaluador: currentUser.id_alumno,
        comentarios,
        detalles
      });

      toast.success('¡Evaluación registrada con éxito!');
      setComentarios('');
      // Reset ratings
      const resetRatings = {};
      criterios.forEach(c => resetRatings[c.id] = 0);
      setCalificaciones(resetRatings);
      setSelectedExpo(null);
      setActiveCriterioIndex(0);
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error al registrar evaluación';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex-center" style={{ height: '60vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Cargando rúbrica y datos...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade evaluation-container">
      <div className="glass form-card">
        <div className="form-header">
          <div className="form-icon">
            <ClipboardCheck size={28} color="white" />
          </div>
          <div className="header-text">
            <h3>Registrar Evaluación</h3>
            <p>Participa en la co-evaluación de tus compañeros</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="evaluation-form">
          <div className="input-group">
            <label>Seleccionar Exposición</label>
            <select 
              value={selectedExpo?.id_exposicion || ''} 
              onChange={(e) => setSelectedExpo(exposiciones.find(x => x.id_exposicion === parseInt(e.target.value)))}
              required
            >
              <option value="">-- Elige una presentación para evaluar --</option>
              {exposiciones.map(expo => (
                <option key={expo.id_exposicion} value={expo.id_exposicion}>
                  {expo.tema} (Equipo {expo.id_equipo})
                </option>
              ))}
            </select>
          </div>

          <div className="rubric-section">
            <div className="rubric-header">
              <h4>Rúbrica de Evaluación</h4>
              {currentUser && (
                <span className="user-badge">Evaluador: {currentUser.nombre_alumno || currentUser.username}</span>
              )}
            </div>
            
            <div className="criterios-list">
              {criterios.length > 0 ? (
                <div className="criterio-wizard-card glass animate-fade">
                  <div className="wizard-progress-bar">
                    <div 
                      className="wizard-progress-fill" 
                      style={{ width: `${((activeCriterioIndex + 1) / criterios.length) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="criterio-wizard-header">
                    <div className="wizard-step-info">
                      <span className="step-counter">Criterio {activeCriterioIndex + 1} de {criterios.length}</span>
                      {calificaciones[criterios[activeCriterioIndex].id] > 0 ? (
                        <span className="status-badge rated">Calificado ✓</span>
                      ) : (
                        <span className="status-badge pending">Pendiente</span>
                      )}
                    </div>
                    <h4>{criterios[activeCriterioIndex].nombre}</h4>
                    <p className="criterio-desc">Evalúa el desempeño en este rubro seleccionando de 1 a 10 estrellas.</p>
                  </div>

                  <div className="star-rating-wizard">
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                        <Star
                          key={star}
                          size={28}
                          className={`star-large ${calificaciones[criterios[activeCriterioIndex].id] >= star ? 'filled' : 'empty'}`}
                          onClick={() => handleRating(criterios[activeCriterioIndex].id, star)}
                        />
                      ))}
                    </div>
                    <div className="rating-score-display">
                      <span className="score-number">{calificaciones[criterios[activeCriterioIndex].id] || 0}</span>
                      <span className="score-max">/ 10 puntos</span>
                    </div>
                  </div>

                  <div className="wizard-actions">
                    <button
                      type="button"
                      className="btn-outline"
                      disabled={activeCriterioIndex === 0}
                      onClick={() => setActiveCriterioIndex(prev => prev - 1)}
                    >
                      Anterior
                    </button>
                    
                    {activeCriterioIndex < criterios.length - 1 ? (
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          if (calificaciones[criterios[activeCriterioIndex].id] === 0) {
                            toast.warning('Por favor califica este criterio antes de continuar');
                          } else {
                            setActiveCriterioIndex(prev => prev + 1);
                          }
                        }}
                      >
                        Siguiente
                      </button>
                    ) : (
                      <div className="completed-badge animate-fade">
                        <span>✓ Rúbrica completa</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="empty-row">No hay criterios de evaluación cargados.</p>
              )}
            </div>
          </div>

          <div className="input-group">
            <label>Comentarios adicionales</label>
            <textarea 
              rows="4" 
              placeholder="¿Qué te pareció la exposición? Escribe tus observaciones..."
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
            ></textarea>
          </div>

          <div className="form-footer">
            <button type="submit" className="btn-primary full-width" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              <span>{loading ? 'Enviando...' : 'Enviar Evaluación'}</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .evaluation-container { max-width: 850px; margin: 0 auto; padding-bottom: 40px; }
        .form-card { padding: 48px; }
        @media (max-width: 640px) { .form-card { padding: 24px; } }
        .form-header { display: flex; align-items: center; gap: 24px; margin-bottom: 40px; }
        .form-icon { width: 56px; height: 56px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(124, 58, 237, 0.2); }
        .header-text h3 { font-size: 1.8rem; margin-bottom: 4px; }
        .input-group { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .input-group label { font-weight: 700; font-size: 0.95rem; color: var(--text-muted); }
        .rubric-section { margin-bottom: 40px; }
        .rubric-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; }
        .rubric-section h4 { color: var(--text-main); font-size: 1.3rem; margin: 0; font-weight: 700; }
        .user-badge { font-size: 0.8rem; color: var(--primary); font-weight: 700; background: rgba(124, 58, 237, 0.08); padding: 6px 14px; border-radius: 20px; }
        
        /* Wizard Styling */
        .criterio-wizard-card { padding: 36px; border-radius: 20px; display: flex; flex-direction: column; gap: 28px; position: relative; overflow: hidden; background: var(--bg-card); border: 1px solid var(--border-color); }
        .wizard-progress-bar { position: absolute; top: 0; left: 0; right: 0; height: 6px; background: rgba(0, 0, 0, 0.04); }
        .wizard-progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .criterio-wizard-header { display: flex; flex-direction: column; gap: 12px; }
        .wizard-step-info { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .step-counter { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
        .status-badge { font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 12px; }
        .status-badge.rated { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #d97706; }
        .criterio-wizard-header h4 { font-size: 1.4rem; color: var(--text-main); margin: 0; font-weight: 700; }
        .criterio-desc { font-size: 0.95rem; color: var(--text-muted); line-height: 1.5; }
        
        .star-rating-wizard { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 24px; border-radius: 14px; background: rgba(0, 0, 0, 0.01); border: 1px solid var(--border-color); }
        @media (max-width: 640px) { .star-rating-wizard { flex-direction: column; align-items: center; text-align: center; gap: 16px; } }
        
        .star-rating { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: center; }
        .star-large { cursor: pointer; color: #cbd5e1; fill: transparent; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .star-large:hover, .star-large.filled { color: #fbbf24; fill: #fbbf24; transform: scale(1.2); }
        
        .rating-score-display { display: flex; align-items: baseline; gap: 4px; min-width: 90px; justify-content: flex-end; }
        @media (max-width: 640px) { .rating-score-display { justify-content: center; } }
        .score-number { font-size: 2.2rem; font-weight: 800; color: var(--primary); line-height: 1; }
        .score-max { font-size: 0.95rem; color: var(--text-muted); font-weight: 600; }
        
        .wizard-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
        .completed-badge { display: flex; align-items: center; gap: 8px; color: #10b981; font-weight: 700; background: rgba(16, 185, 129, 0.08); padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; border: 1px solid rgba(16, 185, 129, 0.15); }
        
        .form-footer { margin-top: 40px; }
        .full-width { width: 100%; padding: 16px; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 12px; }
        .flex-center { display: flex; flex-direction: column; align-items: center; justify-content: center; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default Evaluaciones;
