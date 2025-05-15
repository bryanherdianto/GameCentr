import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { signUpUser } from "../actions/User.actions";

export default function SignUp() {
  const navigate = useNavigate();
  const [cookies] = useCookies(['isLoggedIn']);

  useEffect(() => {
    if (cookies.isLoggedIn) {
      navigate('/game');
    }
  }, [cookies.isLoggedIn, navigate]);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const change = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const submitData = (event) => {
    event.preventDefault();
    console.log("formData:", formData);

    signUpUser(formData)
      .then((response) => {
        if (response.data != null) {
          alert("Successfully registered account");
          navigate("/");
        } else {
          alert("Failed to register account!");
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-6">
            <h2 className="text-center text-3xl font-bold tracking-tight text-indigo-700 mb-6">Create an Account</h2>
          </div>
          <div className="px-8 pb-8">
            <form onSubmit={submitData} className="space-y-6">
              <div>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <i className="fas fa-user"></i>
                  </div>
                  <input
                    name="username"
                    type="text"
                    onChange={change}
                    value={formData.username}
                    placeholder="Username"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <i className="fas fa-lock"></i>
                  </div>
                  <input
                    name="password"
                    type="password"
                    onChange={change}
                    value={formData.password}
                    placeholder="Password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register
                </button>
              </div>

              <div className="text-center text-gray-600">
                Already have an account? <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
