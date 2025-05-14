import { useCookies } from 'react-cookie';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
    const [cookies, setCookies] = useCookies(["username", "isLoggedIn", "score"]);

    const handleLogout = () => {
        setCookies('score', 0, { path: '/' });
        setCookies('isLoggedIn', false, { path: '/' });
    };

    return (
        <nav className="bg-indigo-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-white text-xl font-bold mr-8">Game Center</span>
                        <div className="hidden md:flex space-x-4">
                            <NavLink
                                to="/game"
                                className={({ isActive }) =>
                                    isActive
                                        ? "px-3 py-2 rounded-md text-sm font-medium bg-indigo-900 text-white"
                                        : "px-3 py-2 rounded-md text-sm font-medium text-indigo-200 hover:bg-indigo-700 hover:text-white"
                                }
                            >
                                Play
                            </NavLink>
                            <NavLink
                                to="/post"
                                className={({ isActive }) =>
                                    isActive
                                        ? "px-3 py-2 rounded-md text-sm font-medium bg-indigo-900 text-white"
                                        : "px-3 py-2 rounded-md text-sm font-medium text-indigo-200 hover:bg-indigo-700 hover:text-white"
                                }
                            >
                                Scores
                            </NavLink>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="text-indigo-200 mr-4">{cookies.username}</span>
                        <NavLink
                            to="/"
                            onClick={handleLogout}
                            className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                            Logout
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}
