
import { Link } from "react-router-dom";
import logo from "../../assets/Logo.png";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">
        <img src={logo} alt="SIMBA Logo" className="h-12 w-auto" />
      </Link>
    </nav>
  );
}