import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const PrivateRoute = () => (
  <>
    <SignedIn>
      <Navigate to="/dashboard" replace />
    </SignedIn>
    <SignedOut>
      <ExternalRedirect url="https://devlevelup.vercel.app/" />
    </SignedOut>
  </>
);

const ExternalRedirect = ({ url } : {url : string}) => {
  useEffect(() => {
    window.location.replace(url);
  }, [url]);

  return null; // render nothing
};

export default PrivateRoute;
