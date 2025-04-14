import { useEffect } from "react"

const Code = () => {

  useEffect(() => {
    document.title = "Code";
  }, [])

  return (
    <div>
      Code
    </div>
  )
}

export default Code
