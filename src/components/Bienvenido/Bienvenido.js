import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import './Bienvenido.css';

const Bienvenido = ({ nombre }) => {
  const [showBienvenido, setShowBienvenido] = useState(false);
  const [showNombre, setShowNombre] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowBienvenido(true), 500); // 0.5s delay
    setTimeout(() => setShowNombre(true), 1500); // 1s delay after Bienvenido
  }, []);

  return (
    <div className="bienvenido-container">
      <CSSTransition
        in={showBienvenido}
        timeout={500}
        classNames="fade"
        unmountOnExit
      >
        <h1 className='bienvenido-text'>Bienvenido</h1>
      </CSSTransition>
      <CSSTransition
        in={showNombre}
        timeout={500}
        classNames="fade"
        unmountOnExit
      >
        <h2 className='bienvenido-text'>{nombre}</h2>
      </CSSTransition>
    </div>
  );
};

export default Bienvenido;
