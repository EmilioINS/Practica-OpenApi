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

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [exposRes, criteriosRes, userRes] = await Promise.all([
        api.get('/exposiciones'),
        api.get('/evaluaciones/criterios'),
        api.get('/auth/me')
      ]);
      
      setExposiciones(exposRes.data || []);
      setCriterios(criteriosRes.data || []);
      setCurrentUser(userRes.data);
      
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
                <span className="user-badge">Evaluador: {currentUser.username}</span>
              )}
            </div>
            
            <div className="criterios-list">
              {criterios.map(c => (
                <div key={c.id} className="criterio-item glass">
                  <div className="criterio-info">
                    <h5>{c.nombre}</h5>
                    <p>Califica el desempeño en este criterio del 1 al 10.</p>
                  </div>
                  <div className="star-rating-container">
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                        <Star
                          key={star}
                          size={18}
                          className={`star ${calificaciones[c.id] >= star ? 'filled' : ''}`}
                          onClick={() => handleRating(c.id, star)}
                        />
                      ))}
                    </div>
                    <span className="rating-badge">{calificaciones[c.id]}/10</span>
                  </div>
                </div>
              ))}
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
        .form-icon { width: 56px; height: 56px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3); }
        .header-text h3 { font-size: 1.8rem; margin-bottom: 4px; }
        .input-group { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .input-group label { font-weight: 700; font-size: 0.95rem; color: var(--text-muted); }
        .rubric-section { margin-bottom: 40px; }
        .rubric-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; }
        .rubric-section h4 { color: var(--secondary); font-size: 1.3rem; margin: 0; }
        .user-badge { font-size: 0.8rem; color: var(--primary); font-weight: 700; background: rgba(139, 92, 246, 0.1); padding: 4px 12px; border-radius: 20px; }
        .criterios-list { display: flex; flex-direction: column; gap: 20px; }
        .criterio-item { padding: 24px; display: flex; justify-content: space-between; align-items: center; gap: 32px; transition: var(--transition); }
        @media (max-width: 768px) { .criterio-item { flex-direction: column; align-items: flex-start; gap: 20px; } }
        .criterio-info h5 { font-size: 1.1rem; margin-bottom: 8px; }
        .criterio-info p { font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; }
        .star-rating-container { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
        .star-rating { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; justify-content: center; max-width: 240px; }
        @media (max-width: 480px) { .star-rating { max-width: 100%; justify-content: flex-start; } }
        .star { cursor: pointer; color: rgba(255, 255, 255, 0.1); transition: all 0.2s ease; }
        .star:hover, .star.filled { color: #fbbf24; fill: #fbbf24; transform: scale(1.2); }
        .rating-badge { background: rgba(255, 255, 255, 0.05); padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 0.9rem; color: var(--secondary); min-width: 60px; text-align: center; }
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
