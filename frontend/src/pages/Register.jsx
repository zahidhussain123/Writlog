import { SignUp } from "@clerk/clerk-react";
import AuthShell from "../components/authShell";
import { clerkAppearance } from "../constants/clerkAppearance";
import { routePaths } from "../constants/pathRoute";

const Register = () => {
  return (
    <AuthShell
      eyebrow="Join Writlog"
      title="Your first story is a few minutes away."
      subtitle="Create an account to start publishing."
    >
      <SignUp
        signInUrl={routePaths?.LOGIN ?? ""}
        appearance={clerkAppearance}
      />
    </AuthShell>
  );
};

export default Register;
