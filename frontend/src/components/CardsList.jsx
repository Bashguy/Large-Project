import React, {useState} from 'react'
import Cards from './cards'

// wrapping our props in {} prevents us from needing to write extra code
export default function CardsList() {
  
  return (
    <div>
        <div className='grid gap-5 sm:grid-rows-6 sm:grid-cols-2 md:grid-rows-3 md:grid-cols-4
                    border-3 p-5'>
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        </div>
    </div>
  )
}
