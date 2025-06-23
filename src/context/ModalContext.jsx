import { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [isAdding,setIsAdding] = useState(false);

  return (
    <ModalContext.Provider value={{ showModal, setShowModal, isAdding, setIsAdding }}>
      {children}
    </ModalContext.Provider>
  );
};
