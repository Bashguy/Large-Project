import { useEffect } from "react"

const Battle = () => {
  useEffect(() => {
    document.title = "Battle";
  }, [])

  return (
    <div>
      <div className="flex w-screen h-screen justify-center content-center">
        <div className="w-1/3 h-1/3 bg-[#F1BF7E] drop-shadow-lg text-center m-5 p-5 border-3 border-green-950 rounded-md">
          <h1 className="align-text-top"> Coming Soon! </h1>
          <hr className="my-3"></hr>
          <p>Everynyan is working vewwy hard to make this functional /ᐠ｡ꞈ｡ᐟ\</p>
        </div>
      </div>
    </div>
  )
}

export default Battle
