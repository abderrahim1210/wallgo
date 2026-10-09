import React, { useContext, createContext, useState } from 'react';

interface ModalContextType {
    show: string | null;
    setShow: React.Dispatch<React.SetStateAction<string | null>>;
    openModal: (modalname: string) => void;
    closeModal: () => void;
}

interface ModalProviderProps {
    children: React.ReactNode
}
const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [show, setShow] = useState<string | null>(null);
    const openModal = (modalname: string) => setShow(modalname);
    const closeModal = () => setShow(null);
    return (
        <ModalContext.Provider value={{ show, setShow, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => useContext(ModalContext);