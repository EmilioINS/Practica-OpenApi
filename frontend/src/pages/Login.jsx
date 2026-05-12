import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Credenciales inválidas. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-blob"></div>
      <div className="login-blob second"></div>
      
      <div className="glass login-card animate-fade">
        <div className="login-header">
          <div className="logo-circle">
            <LogIn size={32} color="var(--primary)" />
          </div>
          <h1>Bienvenido</h1>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <User size={20} className="input-icon" />
            <input
              type="text"
              placeholder="Matrícula o Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={20} className="input-icon" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>

      <style>{`
        .login-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #050505;
        }

        .login-blob {
          position: absolute;
          width: 500px;
          height: 500px;
          background: var(--primary-glow);
          filter: blur(100px);
          border-radius: 50%;
          z-index: 0;
          top: -100px;
          left: -100px;
          opacity: 0.5;
        }

        .login-blob.second {
          top: auto;
          left: auto;
          bottom: -100px;
          right: -100px;
          background: rgba(6, 182, 212, 0.2);
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 40px;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .login-header {
          text-align: center;
        }

        .logo-circle {
          width: 64px;
          height: 64px;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border: 1px solid var(--primary-glow);
        }

        .login-header h1 {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .login-header p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-group input {
          width: 100%;
          padding-left: 45px;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.85rem;
          text-align: center;
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Login;
