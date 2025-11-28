import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { FaUser, FaList, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

interface Props {
  onClose: () => void;
}

const DropDown: React.FC<Props> = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="absolute right-0 mt-2 bg-gray-700 text-white rounded shadow-lg z-10">
      <ul>
        <li>
          <Link
            to="/profile"
            className="block px-4 py-2 hover:bg-gray-600"
            onClick={onClose}
          >
            <FaUser className="inline mr-2" /> Profile
          </Link>
        </li>
        <li>
          <Link
            to="/watchlist"
            className="block px-4 py-2 hover:bg-gray-600"
            onClick={onClose}
          >
            <FaList className="inline mr-2" /> My Watchlists
          </Link>
        </li>
        <li>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-600"
            onClick={() => {
              handleLogout();
              onClose();
            }}
          >
            <FaSignOutAlt className="inline mr-2" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DropDown;
