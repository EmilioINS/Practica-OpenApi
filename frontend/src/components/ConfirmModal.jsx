import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", type = "danger" }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass modal-content animate-fade"
        >
          <div className="modal-header">
            <div className={`icon-circle ${type}`}>
              <AlertCircle size={28} />
            </div>
            <button onClick={onClose} className="close-btn" aria-label="Cerrar">
              <X size={22} />
            </button>
          </div>

          <div className="modal-body">
            <h3>{title}</h3>
            <p>{message}</p>
          </div>

          <div className="modal-footer">
            <button onClick={onClose} className="btn-outline">Cancelar</button>
            <button 
              onClick={() => { onConfirm(); onClose(); }} 
              className={`btn-primary ${type === 'danger' ? 'btn-danger' : ''}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>

        <style>{`
          .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(12px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1100;
            padding: 24px;
          }

          .modal-content {
            width: 100%;
            max-width: 440px;
            padding: 40px;
            display: flex;
            flex-direction: column;
            gap: 32px;
            border-radius: 28px;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .icon-circle {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .icon-circle.danger {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
          }

          .icon-circle.primary {
            background: rgba(139, 92, 246, 0.1);
            color: var(--primary);
            border: 1px solid rgba(139, 92, 246, 0.2);
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
            transition: var(--transition);
          }

          .close-btn:hover {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
          }

          .modal-body h3 {
            margin-bottom: 12px;
            font-size: 1.5rem;
            line-height: 1.2;
          }

          .modal-body p {
            color: var(--text-muted);
            font-size: 1rem;
            line-height: 1.6;
          }

          .modal-footer {
            display: flex;
            gap: 16px;
            justify-content: flex-end;
          }

          .btn-danger {
            background: linear-gradient(135deg, #ef4444, #dc2626) !important;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3) !important;
          }

          .btn-danger:hover {
            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4) !important;
          }
        `}</style>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
