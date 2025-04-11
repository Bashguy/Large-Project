import React, {useState} from 'react'
import Cards from './cards'
const breakfast = [
  {
    num: 1
  }, 
  {
    num: 2
  }, 
  {
    num: 3
  }, 
  {
    num: 4
  }, 
  {
    num: 5
  }, 
  {
    num: 6
  }, 
  {
    num: 7
  }, 
  {
    num: 8
  }, 
  {
    num: 9
  }, 
  {
    num: 10
  }, 
  {
    num: 11
  }, 
  {
    num: 12
  }
]
const dinner = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
]
const dessert = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
]
// wrapping our props in {} prevents us from needing to write extra code
export default function CardsList({info}) {
  return (
    <div className='grid justify-items-center sm:grid-rows-6 sm:grid-cols-2 md:grid-rows-3 md:grid-cols-4
                    place-content-center border-3'>
        <Cards showInfo = {info}/>
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
        <Cards />
    </div>
  )
}
