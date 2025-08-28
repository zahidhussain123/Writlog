import { SignIn } from "@clerk/clerk-react";
import { routePaths } from "../constants/pathRoute";

const Login = () => {
  return (
    <div className="flex justify-center items-center h-[90vh]">
      <SignIn signUpUrl={routePaths?.REGISTER ?? ""} />
    </div>
  );
};

export default Login;
