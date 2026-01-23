import { NavLink } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Income", path: "/income" },
  { name: "Expense", path: "/expense" },
  { name: "Budget", path: "/budget" },
  { name: "Insights", path: "/insights" },
];

const Sidebar = () => {
  return (
    <div className="w-60 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Finance App</h2>

      {links.map(link => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `block px-4 py-2 rounded mb-2 ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          {link.name}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
