import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { routePaths } from "../constants/pathRoute";

const AuthHeader = () => {
  return (
    <div className="flex items-center">
      <SignedOut>
        <Link to={routePaths?.LOGIN ?? ""} className="btn-primary">
          Sign in
        </Link>
      </SignedOut>

      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox:
                "h-9 w-9 ring-2 ring-white shadow-soft rounded-full transition hover:ring-brand-200",
              userButtonPopoverCard: "rounded-2xl shadow-lift",
            },
          }}
        />
      </SignedIn>
    </div>
  );
};

export default AuthHeader;
