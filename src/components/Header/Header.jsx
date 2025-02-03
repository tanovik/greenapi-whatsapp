/* eslint-disable react/prop-types */
import React from 'react'
import './Header.scss'

function Header({ phoneNumber, senderName }) {
    let headerContent = null

    if (senderName) {
        headerContent = <p className="header__contact">{senderName}</p>
    } else if (phoneNumber) {
        headerContent = <p className="header__contact">{phoneNumber}</p>
    }

    return (
        <header className="header">
            <div className="header__text-wrapper">
                <h1 className="header__text-top">WhatsApp Web</h1>
            </div>
            {headerContent}
        </header>
    )
}

export default Header
