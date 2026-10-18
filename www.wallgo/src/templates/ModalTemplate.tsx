import React from 'react'
import { Modal } from "react-bootstrap";

interface ModalTemplateProps {
    show: boolean | string;
    closeModal: () => void;
    children: React.ReactNode
};
const ModalTemplate: React.FC<ModalTemplateProps> = ({ show, closeModal, children }) => {
    return (
        <Modal show={Boolean(show)} onHide={closeModal}
            centered={false}
            backdrop={true}
            keyboard={true}
            className="modal-bottom-sheet-wrapper"
            dialogClassName="modal-dialog-slide-bottom" >
            <div className="bg-white rounded-t-3xl shadow-2xl border border-zinc-100  overflow-hidden transform transition-all duration-300 max-h-[80vh] min-h-[40vh] flex flex-col pointer-events-auto">

                <div className="w-full flex justify-center pt-3 pb-2 cursor-pointer shrink-0 bg-white">
                    <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
                </div>
                <Modal.Body className="p-1 flex-1 overflow-y-auto min-h-0">
                    {children}
                </Modal.Body>
            </div>
        </Modal>
    )
}

export default ModalTemplate