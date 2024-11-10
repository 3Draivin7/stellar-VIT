import React, { useState, useEffect } from 'react';
import styles from './modal.module.css'; // Добавьте styles.css

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  //title: string; // Добавьте свойство title
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [isEscPressed, setIsEscPressed] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    // Добавьте тип для события
    if (e.key === 'Escape') {
      setIsEscPressed(true);
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    isOpen && (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div
          className={styles.modalContent}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <button className={styles.modalClose} onClick={onClose}>
            &times;
          </button>
          {children}
        </div>
      </div>
    )
  );
};
