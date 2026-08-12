import { SignIn } from "@clerk/clerk-react";
import AuthShell from "../components/authShell";
import { clerkAppearance } from "../constants/clerkAppearance";
import { routePaths } from "../constants/pathRoute";

const Login = () => {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Pick up where you left off."
      subtitle="Sign in to publish, comment and keep track of the stories you care about."
    >
      <SignIn
        signUpUrl={routePaths?.REGISTER ?? ""}
        appearance={clerkAppearance}
      />
    </AuthShell>
  );
};

export default Login;
