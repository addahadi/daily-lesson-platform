
import { SignedIn , SignedOut   } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";
const PrivateRoute = () => (
    <>
      <SignedIn>
        <Navigate to="/dashboard" />
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
    </>
  );

export default PrivateRoute