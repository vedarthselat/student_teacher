import React from 'react'
import { assets } from '../assets/assets'
import './Header.css'

const Header = () => {
    return (
        <div className='header-container'>

            {/* --------- Header Left --------- */}
            <div className='header-left'>
                <p className='header-title'>
                    Book Appointment <br />  With Trusted Teachers
                </p>
                <div className='header-info'>
                    <img className='header-profiles' src={assets.group_profiles} alt="" />
                    <p>Simply browse through our extensive list of teachers, <br className='hidden sm:block' /> schedule your appointment hassle-free.</p>
                </div>
                <a href='#speciality' className='header-button'>
                    Book appointment <img className='header-arrow' src={assets.arrow_icon} alt="" />
                </a>
            </div>

            {/* --------- Header Right --------- */}
            <div className='header-right'>
                <img className='header-image' src={assets.teachermain} alt="" />
            </div>
        </div>
    )
}

export default Header