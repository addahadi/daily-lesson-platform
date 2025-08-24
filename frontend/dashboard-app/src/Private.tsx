import { useUser } from "@clerk/clerk-react";
import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./admin/app/adminDashboard";





const Private = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState<string>();

  useEffect(() => {
    if (!isLoaded) return; 
    if (!user) {navigate("/");
        return;}
    const userRole = user.publicMetadata?.role;
    setRole(userRole);

    if (userRole !== "admin") {
      navigate("/");
    }
  }, [user, isLoaded, navigate]);

  if (!isLoaded || role !== "admin") return null;

  return <AdminDashboard />;
};

export default Private;
