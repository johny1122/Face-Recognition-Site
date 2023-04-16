import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css'
import brain from './brain.png'

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className='Tilt shadow-2' style={{height: '150px', width: '150px', backgroundColor: 'blue'}}>
                <div className='pa3'>
                    <img src={brain} alt='brain logo' style={{paddingTop: '5px'}}/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;