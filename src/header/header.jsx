import React from 'react'
import './header.css'
import Logo from '../sapcexLogo.png';
function Header() {
    return (
        <div className="header">
           <img src={Logo} className="logo"></img>

        </div>
    )
}

export default Header
