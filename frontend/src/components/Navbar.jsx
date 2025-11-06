import { Link, useNavigate } from "react-router-dom";

export default function Navbar(){
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/login");
  };

  return (
    <div className="flex items-center justify-between p-3 border-b bg-white">
      <div className="flex gap-4">
        <Link className="font-semibold" to="/dashboard">SlotSwapper</Link>
        <Link className="text-sm text-gray-600 hover:text-black" to="/dashboard">Dashboard</Link>
        <Link className="text-sm text-gray-600 hover:text-black" to="/marketplace">Marketplace</Link>
        <Link className="text-sm text-gray-600 hover:text-black" to="/requests">Requests</Link>
      </div>
      <div className="flex items-center gap-3">
        {user && <span className="text-sm text-gray-600">Hi, {user.name}</span>}
        {user ? (
          <button onClick={logout} className="px-3 py-1 rounded-md bg-black text-white hover:opacity-90">
            Logout
          </button>
        ) : (
          <Link to="/login" className="text-sm underline">Login</Link>
        )}
      </div>
    </div>
  );
}
