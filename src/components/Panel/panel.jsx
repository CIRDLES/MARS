//import CSSModules from 'react-css-modules'
import React from 'react'

import './panel.css'

const Panel = ({children, name}) => {

  return (
  <div className='panel'>
    <h1 className='header'>{name}</h1>
    <div className='content'>
      {children}
    </div>
  </div>
)}

export default Panel
