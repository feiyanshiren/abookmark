import React from 'react'
import { useState, useEffect, useRef } from 'react'
import './app.less'
export default function App(props) {

  const refObject = useRef();

  const [show, setShow] = useState(false);

  useEffect(()=>{
    document.addEventListener("mousedown", handleClickOutSide);
    return ()=> document.removeEventListener("mousedown", handleClickOutSide);
  });

  function handleClickOutSide(e){
    if(!(refObject?.current?.contains(e.target))){
      setShow(false);
    }
  }

  function handleClose() {
    setShow(!show);
  }
   
    return (
      <>
        {show ? (
          <div className="Book">
            <header className="Book-header">
              <span
                className="Book-close-icon"
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
          <div className="Book-hide" onClick={handleClose}>
            书签
          </div>
        )}
      </>
    )
  
}
