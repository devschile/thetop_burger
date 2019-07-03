import React from 'react'
import { NavLink } from "react-router-dom";

import './footer.scss'

function Footer ({ navbarOptions }) {
  const options = Object.values(navbarOptions).map(option => {
    return (
      <NavLink
        to={`/${option.key}`}
        className="footer__option"
        activeClassName="footer__option--selected"
        key={option.key}
      >
        {option.label}
      </NavLink>
    )
  })

  return (
    <div className='footer'>
      <div className='footer__options'>
        { options }
      </div>
    </div>
  )
}

export default Footer
