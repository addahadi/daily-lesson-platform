
import { SignedIn , SignedOut   } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
const PrivateRoute = () => (
  <>
    <SignedIn>
      <Navigate to="/dashboard" />
    </SignedIn>
    <SignedOut>
      <Navigate to="https://devlevelup.vercel.app/" replace />
    </SignedOut>
  </>
);

export default PrivateRoute