import useStore from "@/store/store";
import { NavLink } from "react-router-dom";

// type Link = {
//   name: string;
//   path: string;
// };

// const links = [
//   {
//     name: "Admin",
//     path: "/admin",
//   },
//   {
//     name: "Login",
//     path: "/login",
//   },
// ];

// const Navbar = ({ links }: { links: Link[] }) => {
const Navbar = () => {
  const { auth } = useStore();
  console.log(auth);
  return (
    <nav className="bg-background border-b" aria-label="Main navigation">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center" aria-label="SmartSend logo">
          <span className="text-lg font-semibold">
            <NavLink to="/">Logo</NavLink>
          </span>
        </div>
        <div>
          {auth.isAuthenticated ? (
            <NavLink to="/admin">dashboard</NavLink>
          ) : (
            <NavLink to="/login">login</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
