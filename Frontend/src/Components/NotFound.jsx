import React from 'react'
import NotFoundImage from '../assets/404.png'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className='h-cover relative p-10 flex flex-col items-center gap-20 text-center'>
        <img src={NotFoundImage} className='select-none border-2 border-grey w-72 aspect-square object-cover rounded'/>
        <h1 className='text-4xl font-gelasio leading-10'>
            Trip Not Found
        </h1>
        <p className='text-dark-grey text-xl leading-7 -mt-8'>Planning to Travel for a destination which is Lost in Space . Head back to <Link to='/' className='text-black underline'>Earth</Link></p>
    </section>
  )
}

export default NotFound
