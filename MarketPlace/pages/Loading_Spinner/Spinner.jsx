import React from 'react'


export default function Spinner() {
    return (
        <div className='body2'>

            <div class="container2 rotate" style={{"--size":"16rem"}} >
                <div class="circle primary rotate-reverse"></div>
                <div class="circle tertiary rotate-reverse bg-pink-500"></div>
            </div>
           
        </div>
    )
}
