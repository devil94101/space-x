import React from 'react'
import './Modal.css'
function Modal({show,children}) {
    if(!show){
        return <></>;
    }
    return (
        <div className="modal">
            <div className="modal-main">
                {children}
            </div>
        </div>
    )
}

export default Modal
