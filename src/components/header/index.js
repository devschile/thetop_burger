import React from 'react'

import './header.scss'

function Header ({ showState, onSelect, navbarOptions }) {
  const options = Object.values(navbarOptions).map(option => {
    return (
      <div
        className={`header__option ${showState === option.key ? 'header__option--selected' : ''}`}
        onClick={() => onSelect(option.key)}
        key={option.key}
      >
        {option.label}
      </div>
    )
  })

  return (
    <div className='header'>
      <h1 className='header__title'>TheTop - BurgerMap!</h1>
      <div className='header__options'>
        { options }
      </div>
    </div>    
  )  
}

export default Header
