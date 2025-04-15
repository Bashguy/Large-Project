import { useEffect, useRef, useState } from "react"
import useAuthStore from "../store/authStore"

const Register = () => {
  const [ loginForm, setLoginForm ] = useState({
    username: "", 
    password: ""
  });

  const [ signUpForm, setSignUpForm ] = useState({
    email: "", 
    username: "", 
    password: ""
  });

  const [ pageTitle, setPageTitle ] = useState("Login");
  const { login, signup, isLoading, msg } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();

    await login(loginForm.username, loginForm.password);
    console.log(msg);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const result = await signup(signUpForm.email, signUpForm.username, signUpForm.password);
    if (result) {
      setPageTitle("Login");
      setFlip(false);
      setShowPass(false);

      setSignUpForm({ email: "", username: "", password: "" })
      console.log(msg);
    } else {
      console.log(msg);
    }
  };

  useEffect(() => {
    document.title = pageTitle
  }, [])

  const [showPass, setShowPass] = useState(false);
  const [flip, setFlip] = useState(false);

  return (
    <div className="h-screen relative flex flex-col items-center justify-center font-mono select-none overflow-hidden">
      {/* Title */}
      <div className="mb-8 text-4xl">Hallo</div>

      {/* Form */}
      <div className="w-1/2 h-2/3 xl:h-1/2 2xl:h-3/5 flex border-16 rounded-4xl border-[#aa6445] shadow-[8px_6px_6px_4px_rgba(0,0,0,0.3)]">
        <div className="w-full relative bg-[#f1bf7e] border-1 rounded-2xl flex flex-col xl:flex-row">

          {/* Login - Page #1 */}
          <div className="w-full h-1/2 xl:w-1/2 xl:h-full border-black z-5">
            <span className="flex justify-center my-4 mx-6 py-2 px-4 rounded-full shadow-[6px_8px_6px_0px_rgba(0,0,0,0.3)] text-[1.25vw] bg-white font-bold">Returning User</span>

            <div className="h-full pb-24 xl:pb-32 flex items-center justify-center flex-col space-y-4 px-8">
              {/* Username-L */}
              <div>
                <span className="text-[1.25vw]">Username:</span>
                <input 
                  type="text"
                  className="w-full mt-1 bg-white text-[#aa6445] rounded-sm p-1 ring transition ease-in-out hover:scale-105 focus:scale-105 focus:outline-none"
                  placeholder="Enter username"
                  value={loginForm.username}
                  onChange={(e) =>  setLoginForm({ ...loginForm, username: e.target.value })}
                />
              </div>
              
              {/* Password-L */}
              <div className="relative">
                <span className="text-[1.25vw]">Password:</span>
                <input 
                  type={showPass ? "text" : "password"}
                  className="peer w-full mt-1 bg-white text-[#aa6445] rounded-sm p-1 ring transition ease-in-out hover:scale-105 focus:scale-105 focus:outline-none"
                  placeholder="Enter password"
                  value={loginForm.password}
                  onChange={(e) => { 
                    setLoginForm({ ...loginForm, password: e.target.value });
                    setTimeout(() => e.target.focus(), 25);
                  }}
                />

                {/* Show Password-L */}
                <span className="absolute right-0 mt-2 mr-2 cursor-pointer peer-hover:scale-110" onClick={() => {setShowPass(!showPass)}}>X</span>
              </div>

              {/* Submit button */}
              <button 
                className="w-2/3 h-1/8 border-2 mt-4 border-[#aa6445] text-[min(15px,75px)] rounded-sm hover:bg-rose-300 hover:text-white active:scale-95 transition ease-in-out cursor-pointer"
                onClick={handleLogin}
              >
                  Submit
              </button>
            </div>

            {/* Page #1 */}
            <span className="absolute bottom-0 left-0 mb-5 ml-5">1</span>
          </div>

          {/* Page flip */}
          <div className="pointer-events-none absolute inset-0 w-full h-full bg-transparent perspective-distant transition-all transform-3d z-10">
            <div className={`pointer-events-auto h-1/2 w-full xl:w-1/2 xl:h-full absolute bottom-0 xl:right-0 max-xl:origin-top xl:origin-left max-xl:rounded-b-2xl xl:rounded-r-2xl border-1 duration-750 backface-hidden bg-[#f1bf7e] ${flip ? "max-xl:rotate-x-180 xl:-rotate-y-180" : "max-xl:rotate-x-0 xl:rotate-y-0 max-xl:hover:rotate-x-5 xl:hover:-rotate-y-5"}`} onClick={() => setFlip(true)}>
              {/* #2 Page info */}
              <div className="h-full w-full flex items-center justify-center cursor-pointer" onClick={() => setPageTitle("Signup")}>
                Go to Signup -&gt;
              </div>

              {/* Page #2 */}
              <span className="absolute bottom-0 right-0 mb-5 mr-5">2</span>
            </div>
            
            <div className={`pointer-events-auto h-1/2 w-full xl:w-1/2 xl:h-full absolute top-0 xl:left-0 max-xl:origin-bottom xl:origin-right max-xl:rounded-t-2xl xl:rounded-l-2xl border-1 duration-750 backface-hidden bg-[#f1bf7e] ${flip ? "max-xl:rotate-x-0 xl:rotate-y-0 max-xl:hover:-rotate-x-5 xl:hover:rotate-y-5" : "max-xl:-rotate-x-180 xl:rotate-y-180"}`} onClick={() => setFlip(false)}>
              {/* #3 Page info */}
              <div className="h-full w-full flex items-center justify-center cursor-pointer">

                {/* Password checker */}
                <div className="-mt-20 mb-10 flex flex-col space-y-2 text-center">
                  <span className={`${(signUpForm.password.length >= 8) ? "text-green-500" : "text-red-500"}`}>
                    Has more than 8 characters
                  </span>

                  <span className={`${(/\d/).test(signUpForm.password) ? "text-green-500" : "text-red-500"}`}>
                    Contains at least one number
                  </span>

                  <div className={`${(/[A-Z]/).test(signUpForm.password) ? "text-green-500" : "text-red-500"}`}>
                    Contains at least one uppercase letter
                  </div>
                </div>
                <div onClick={() => setPageTitle("Login")}>
                  &lt;- Go to Login
                </div>
              </div>

              {/* Page #3 */}
              <span className="absolute bottom-0 left-0 mb-5 ml-5">3</span>
            </div>
          </div>

          {/* Sign Up - Page #4 */}
          <div className="w-full h-1/2 xl:w-1/2 xl:h-full border-black z-5">
            <span className="flex justify-center my-4 mx-6 py-2 px-4 rounded-full shadow-[6px_8px_6px_0px_rgba(0,0,0,0.3)] text-[1.25vw] bg-white font-bold">New User</span>

            <div className="h-full pb-28 flex items-center justify-center flex-col space-y-2 px-8 mt-4">

              {/* Email */}
              <div className="w-full">
                <span className="text-[1vw]">Email:</span>
                <input 
                  type="email"
                  className="w-full mt-1 bg-white text-[#aa6445] rounded-sm p-1 ring transition ease-in-out hover:scale-105 focus:scale-105 focus:outline-none"
                  placeholder="Enter email"
                  value={signUpForm.email}
                  onChange={(e) => { 
                    setSignUpForm({ ...signUpForm, email: e.target.value });
                    setTimeout(() => e.target.focus(), 25);
                  }}
                />
              </div>

              {/* Username-S */}
              <div className="w-full">
                <span className="text-[1vw]">Username:</span>
                <input 
                type="text"
                  className="w-full mt-1 bg-white text-[#aa6445] rounded-sm p-1 ring transition ease-in-out hover:scale-105 focus:scale-105 focus:outline-none"
                  placeholder="Enter username"
                  value={signUpForm.username}
                  onChange={(e) => { 
                    setSignUpForm({ ...signUpForm, username: e.target.value });
                    setTimeout(() => e.target.focus(), 25);
                  }}
                />
              </div>
              
              {/* Password-S */}
              <div className="w-full relative">
              <span className="text-[1vw]">Password:</span>
                <input 
                  type={showPass ? "text" : "password"}
                  className="peer w-full mt-1 bg-white text-[#aa6445] rounded-sm p-1 ring transition ease-in-out hover:scale-105 focus:scale-105 focus:outline-none"
                  placeholder="Enter password"
                  value={signUpForm.password}
                  onChange={(e) => { 
                    setSignUpForm({ ...signUpForm, password: e.target.value });
                    setTimeout(() => e.target.focus(), 25);
                  }}
                />

                {/* Show Password-S */}
                <span className="absolute right-0 mt-2 mr-2 peer-hover:scale-110 cursor-pointer" onClick={() => {setShowPass(!showPass)}}>X</span>
              </div>

              {/* Submit */}
              <button 
                className="w-2/3 h-1/8 border-2 mt-4 border-[#aa6445] rounded-sm hover:bg-rose-300 hover:text-white active:scale-95 transition ease-in-out cursor-pointer"
                onClick={handleSignUp}
              >
                Submit
              </button>
            </div>

            {/* First Name and Last Name */}
            <span className="absolute bottom-0 right-0 mb-5 mr-5">4</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Register
