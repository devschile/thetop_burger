import React from 'react'
import { NavLink } from "react-router-dom";
import './header.scss'

function Header ({ navbarOptions }) {
  const options = Object.values(navbarOptions).map(option => {
    return (
      <NavLink
        to={`/${option.key}`}
        className="header__option"
        activeClassName="header__option--selected"
        key={option.key}
      >
        {option.label}
      </NavLink>
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
