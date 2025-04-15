import React from 'react'

function ViewCard({card, setViewCard}) {
  return (
    <div>
        <div className='flex justify-center w-3/5 h-3/5 bg-amber-500'>
          <button onClick={setViewCard(false)}>x</button>
          <p>`Name: $(card.name)`</p>
        </div>
    </div>
  )
}

export default ViewCard