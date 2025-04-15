import CardsList from "../components/cardsList"
import {useState} from 'react'


export const Collections = () => {
  const [viewCard, setViewCard] = useState(false)
  const [card, setCard] = useState({
    name: "Potato",
    stars: 5,
    color: "#000000",
    img: "potato",
    description: "the Mighty potato"
  })
  
  //const [search, setSearch] = useState("")

  // function to get number of cards collected from API

  const searchCard = (query) => {
    if(query !== "") {
      console.log(`Searched for query ${query}`)
    }
  }
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
        {viewCard && <ViewCard setCard={setCard} setViewCard={setViewCard}/>}

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

            {/* Search Bar */}
            <div className="flex border-3">
                <input 
                  type='text'
                  className='w-full p-3 bg-white border-3'
                  placeholder="Type here to search for a card"
                  onChange={(e) =>{searchCard(e.target.value)}}
                />
            </div>
          
          {/* Collections */}
            <div className='w-full h-4/5 align-middle text-center bg-orange-300 overflow-auto'>
                <CardsList />
            </div>
        </div>

        </div>
        
    </div>
  )
}

export default Collections
