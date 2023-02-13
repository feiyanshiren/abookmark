import React from 'react'
import { useState } from 'react'
import './app.less'
export default function App(props) {

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(!show);
  }
   
    return (
      <>
        {show ? (
          <div className="Wokoo">
            <header className="Wokoo-header">
              <span
                className="Wokoo-close-icon"
                onClick={handleClose}
              >
                X
              </span>
              <p>
                Edit 
              </p>
      
            </header>
          </div>
        ) : (
          <div className="Wokoo-hide" onClick={handleClose}>
            书签
          </div>
        )}
      </>
    )
  
}
