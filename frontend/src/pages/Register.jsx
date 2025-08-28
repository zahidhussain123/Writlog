import { SignUp } from "@clerk/clerk-react"
import { routePaths } from "../constants/pathRoute"

const Register = () => {
  return (
    <div className="flex justify-center items-center">
      <SignUp  signInUrl={routePaths?.LOGIN ?? ""}/>
    </div>
  )
}

export default Register