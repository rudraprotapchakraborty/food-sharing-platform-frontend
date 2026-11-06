import { NavLink } from "react-router-dom";
import AuthContext from "../../context/AuthContext/AuthContext";
import logo from "../../assets/logo.png";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("");
  const [scrolling, setScrolling] = useState(false);
  const { user, signOutUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        console.log("Sign out successful");
      })
      .catch((error) => {
        console.log("Sign out error", error);
      });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = (
    <>
      <li>
        <NavLink
          to="/"
          onClick={() => setActiveLink("home")}
          className={`${
            activeLink === "home"
              ? "text-orange-500" // Active link color
              : darkMode
              ? "text-gray-300 hover:text-orange-300"
              : "text-gray-700 hover:text-orange-500"
          } transition-transform duration-200 ease-in-out transform hover:scale-105`}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/available-foods"
          onClick={() => setActiveLink("available-foods")}
          className={`${
            activeLink === "available-foods"
              ? "text-orange-500"
              : darkMode
              ? "text-gray-300 hover:text-orange-300"
              : "text-gray-700 hover:text-orange-500"
          } transition-transform duration-200 ease-in-out transform hover:scale-105`}
        >
          Available Foods
        </NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink
              to="/add-food"
              onClick={() => setActiveLink("add-food")}
              className={`${
                activeLink === "add-food"
                  ? "text-orange-500"
                  : darkMode
                  ? "text-gray-300 hover:text-orange-300"
                  : "text-gray-700 hover:text-orange-500"
              } transition-transform duration-200 ease-in-out transform hover:scale-105`}
            >
              Add Food
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/manage-my-foods"
              onClick={() => setActiveLink("manage-my-foods")}
              className={`${
                activeLink === "manage-my-foods"
                  ? "text-orange-500"
                  : darkMode
                  ? "text-gray-300 hover:text-orange-300"
                  : "text-gray-700 hover:text-orange-500"
              } transition-transform duration-200 ease-in-out transform hover:scale-105`}
            >
              Manage My Foods
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/my-food-request"
              onClick={() => setActiveLink("my-food-request")}
              className={`${
                activeLink === "my-food-request"
                  ? "text-orange-500"
                  : darkMode
                  ? "text-gray-300 hover:text-orange-300"
                  : "text-gray-700 hover:text-orange-500"
              } transition-transform duration-200 ease-in-out transform hover:scale-105`}
            >
              My Food Request
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div
      className={`sticky z-50 backdrop-blur-md shadow-xl rounded-full w-11/12 mx-auto px-2 py-1 md:px-4 md:py-3 transition-all duration-300 ${
        scrolling ? "top-0" : "top-4"
      } ${darkMode ? "bg-gray-900 bg-opacity-90" : "bg-white bg-opacity-90"}`}
    >
      <div className="flex justify-between items-center">
        {/* Left Section - Logo */}
        <NavLink>
          <button
            className={`text-lg md:text-2xl font-bold transition-transform duration-300 transform hover:scale-105 ${
              darkMode
                ? "text-orange-300 hover:text-orange-400"
                : "text-orange-500 hover:text-orange-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <img src={logo} className="w-6 md:w-9" alt="" />
              <p>
                <span
                  className={`${
                    darkMode ? "text-orange-500" : "text-orange-700"
                  }`}
                >
                  &lt;F
                </span>
                ood Sharing
                <span
                  className={`${
                    darkMode ? "text-orange-500" : "text-orange-700"
                  }`}
                >
                  /&gt;
                </span>
              </p>
            </div>
          </button>
        </NavLink>

        {/* Centered Menu for Desktop */}
        <div className="hidden lg:flex">
          <ul className="flex font-bold gap-10">{links}</ul>
        </div>

        {/* Right Section - Theme Toggle, Login/Register, User Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className={`hidden sm:block p-1.5 md:p-2 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105 ${
              darkMode
                ? "bg-orange-700 hover:bg-orange-600 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {darkMode ? (
              <FaMoon className="text-sm md:text-xl" />
            ) : (
              <FaSun className="text-sm md:text-xl" />
            )}
          </button>

          {/* User Profile or Login */}
          {user ? (
            <div className="relative group hidden sm:block">
              <img
                className="w-7 h-7 md:w-10 md:h-10 rounded-full"
                src={user.photoURL}
                alt="Profile"
              />
              <div
                className={`absolute top-14 left-1/2 transform -translate-x-1/2 hidden group-hover:block px-3 py-1 whitespace-nowrap rounded-lg ${
                  darkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {user.displayName}
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <NavLink
                to="/login"
                className={`btn btn-ghost transition-all ${
                  darkMode
                    ? "text-white hover:text-orange-300"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={`btn btn-ghost transition-all ${
                  darkMode
                    ? "text-white hover:text-orange-300"
                    : "text-gray-700 hover:text-orange-500"
                }`}
              >
                Register
              </NavLink>
            </div>
          )}

          {/* Logout Button */}
          {user && (
            <button
              onClick={handleSignOut}
              className={`btn btn-ghost hidden sm:block transition-all ${
                darkMode
                  ? "text-white hover:text-orange-300"
                  : "text-gray-700 hover:text-orange-500"
              }`}
            >
              Logout
            </button>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleDarkMode}
            className={`p-1.5 md:p-2 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105 ${
              darkMode
                ? "bg-orange-700 hover:bg-orange-600 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {darkMode ? (
              <FaMoon className="text-sm md:text-xl" />
            ) : (
              <FaSun className="text-sm md:text-xl" />
            )}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="btn btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>

          {isMenuOpen && (
            <div>
              <ul
                className={`absolute right-4 top-12 p-4 space-y-4 rounded-lg shadow-xl font-bold z-50 ${
                  darkMode
                    ? "bg-black bg-opacity-90 text-gray-300"
                    : "bg-white text-gray-700"
                }`}
              >
                {links}
                {user && (
                  <div className="flex items-center">
                    <div className="relative group">
                      <img
                        className="w-7 h-7 md:w-10 md:h-10 rounded-full"
                        src={user.photoURL}
                        alt="Profile"
                      />
                      <div
                        className={`absolute top-14 left-1/2 transform -translate-x-1/2 hidden group-hover:block px-3 py-1 whitespace-nowrap rounded-lg ${
                          darkMode
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.displayName}
                      </div>
                    </div>

                    <button
                      onClick={handleSignOut}
                      className={`btn btn-ghost transition-all ${
                        darkMode
                          ? "text-white hover:text-orange-300"
                          : "text-gray-700 hover:text-orange-500"
                      }`}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
