import { Outlet } from "react-router-dom";
import AdminNavBar from "../components/ui/AdminNavBar"
import AdminSideBar from "../components/ui/AdminSideBar"

const AdminDashboard = () => {
  return (
    <div className=" flex  flex-row-reverse   bg-gray-100 ">
      <section className=" flex-1 w-full">
        <AdminNavBar />
        <main>
          <Outlet />
        </main>
      </section>
      <AdminSideBar />
    </div>
  );
}

export default AdminDashboard