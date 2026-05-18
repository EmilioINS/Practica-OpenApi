import { useState, useEffect } from 'react';
import { Presentation, Users, BookOpen, Star, TrendingUp, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data);
      } catch (error) {
        toast.error('Error al cargar estadísticas reales');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats ? [
    { label: 'Exposiciones', value: stats.exposiciones, icon: <Presentation />, color: 'var(--primary)' },
    { label: 'Alumnos', value: stats.alumnos, icon: <Users />, color: '#10b981' },
    { label: 'Materias', value: stats.materias, icon: <BookOpen />, color: '#f59e0b' },
    { label: 'Calificación Prom.', value: stats.promedio, icon: <Star />, color: '#ef4444' },
  ] : [];

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '60vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        <p style={{ marginLeft: '16px', fontSize: '1.2rem', color: 'var(--text-muted)' }}>Cargando datos reales...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard animate-fade flex-center" style={{ height: '60vh' }}>
        <p style={{ fontSize: '1.2rem', color: '#ef4444' }}>⚠️ No se pudieron cargar las estadísticas. Revisa la conexión con el servidor.</p>
      </div>
    );
  }

  return (
    <div className="dashboard animate-fade">
      <div className="welcome-section">
        <h1>Hola, {user?.username} 👋</h1>
        <p>Aquí tienes un resumen actualizado de lo que está pasando en el sistema.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <div key={i} className="glass stat-card">
            <div className="stat-content">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
            </div>
            <div className="stat-footer">
              <TrendingUp size={14} color="#10b981" />
              <span className="trend-text">Sincronizado ahora</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content-grid">
        <div className="glass section-card">
          <div className="section-header">
            <h3>Últimas Exposiciones</h3>
            <button className="text-btn">Ver todas</button>
          </div>
          <div className="events-list">
            {stats.ultimasExposiciones && stats.ultimasExposiciones.length > 0 ? (
              stats.ultimasExposiciones.map((expo, i) => (
                <div key={i} className="event-item">
                  <div className="event-date">
                    <span className="day">{new Date(expo.fecha).getDate() + 1}</span>
                    <span className="month">{new Date(expo.fecha).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="event-info">
                    <h4>{expo.tema}</h4>
                    <div className="event-meta">
                      <span className="meta-tag"><CalendarIcon size={14} /> Equipo {expo.equipo}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-text">No hay exposiciones registradas recientemente.</p>
            )}
          </div>
        </div>

        <div className="glass section-card">
          <div className="section-header">
            <h3>Resumen de Grupos</h3>
            <button className="text-btn">Configurar</button>
          </div>
          <div className="groups-list">
            <div className="group-stats-summary">
              <div className="big-stat">
                <span className="big-number">{stats.grupos}</span>
                <span className="big-label">Grupos Activos</span>
              </div>
              <p className="description-text">
                Actualmente hay {stats.grupos} grupos configurados en el sistema vinculados a {stats.materias} materias diferentes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .welcome-section {
          margin-bottom: 48px;
        }

        .welcome-section h1 {
          font-size: 2.8rem;
          margin-bottom: 12px;
        }

        .welcome-section p {
          color: var(--text-muted);
          font-size: 1.15rem;
          line-height: 1.6;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 28px;
          margin-bottom: 48px;
        }

        .stat-card {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .stat-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .stat-icon {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-label {
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1;
        }

        .stat-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }

        .trend-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .dashboard-content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 32px;
        }

        .section-card {
          padding: 36px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .event-item {
          display: flex;
          gap: 24px;
          align-items: center;
          padding: 16px;
          border-radius: 16px;
          background: rgba(17, 117, 51, 0.03);
          transition: var(--transition);
        }

        .event-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 60px;
          padding: 10px;
          background: var(--bg-dark);
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .event-date .day { font-weight: 800; font-size: 1.4rem; }
        .event-date .month { font-size: 0.75rem; color: var(--primary); font-weight: 700; }

        .group-stats-summary {
          text-align: center;
          padding: 20px 0;
        }

        .big-number {
          display: block;
          font-size: 4rem;
          font-weight: 800;
          color: var(--secondary);
          line-height: 1;
        }

        .big-label {
          display: block;
          font-size: 1rem;
          color: var(--text-muted);
          margin-top: 8px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .description-text {
          margin-top: 24px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .empty-text {
          color: var(--text-muted);
          text-align: center;
          padding: 40px 0;
        }

        .text-btn {
          background: none; border: none; color: var(--primary); font-weight: 600; cursor: pointer;
        }

        .flex-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default Dashboard;
