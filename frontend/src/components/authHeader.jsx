import {
  SignedOut,
  //   SignInButton,
  SignedIn,
  UserButton,
} from "@clerk/clerk-react";
import { routePaths } from "../constants/pathRoute";
import { Link } from "react-router-dom";

const AuthHeader = () => {
  return (
    <header>
      <SignedOut>
        {/* <SignInButton /> */}
        <Link to={routePaths?.LOGIN ?? ""}>
          <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
            Login 👋
          </button>
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};

export default AuthHeader;
