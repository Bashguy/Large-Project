import CardsList from "../components/cardsList"
import Cards from "../components/cards"
import {useState} from 'react'

export const Collections = () => {
  const [showInfo, setShowInfo] = useState(false)

  // function to get number of cards collected from API

  // Took a progressbar from online 
  const ProgressBar = ({ progressPercentage }) => {
    return (
      <div className='h-2 w-full bg-gray-300 rounded-lg'>
          <div style={{width: `${progressPercentage}%`, borderRadius: 20}}
              className={`h-full ${'bg-red-600'}`}>    
          </div>
      </div>
    )
  }

  return (
    <div>
        {showInfo && <ViewCard setShowInfo={showInfo} />}
        
        <div className="flex w-screen h-screen justify-center">
          {/* Unfied Pantry Item*/}
        <div className='flex-col justify-center items-center align-top w-4/5 h-screen border-3'> 
          
          {/* Info Bar */}
            <div className='flex flex-col justify-between w-full h-1/5 top-0 bg-linear-to-b from-white to-gray-300 border-b-25 border-[#2E4034] p-5'>
              <h2 className='text-center'>Your Collection</h2>
               
               <div className='self-end justify-self-end w-1/4 m-3'>
                  <h3 className="text-center">Collected Cards</h3>
                  < ProgressBar progressPercentage={33}/>
                  <p className="text-sm">12/36</p>
                </div>
                
            </div>
          
          {/* Collections */}
            <div className='w-full h-4/5 align-middle text-center bg-orange-300 overflow-auto'>
              <h3 className='m-5'>Breakfast</h3>
                <CardsList />
              <h3 className='m-5'>Dinner</h3>
              <h3 className='m-5'>Dessert</h3>
            </div>
        </div>

        </div>
        
    </div>
  )
}

export default Collections
