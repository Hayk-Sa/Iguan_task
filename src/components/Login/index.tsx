import { useEffect, useState } from "react";
import type { FormEventHandler } from "react";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth } from "../../firebase.config";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import Loading from "../Loading";

const Login = () => {
  const [authUser] = useAuthState(auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    if (authUser) {
      if (authUser.email === "admin@mail.com") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [authUser, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
    if (user) {
      toast.success("Logged in successfully");
      if (user.user.email === "admin@mail.com") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, error, navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="p-6 max-w-sm w-full bg-gray-800 text-white shadow-md rounded-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <Link to="/sign-up">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
