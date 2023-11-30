import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase.config";
import Loading from "../Loading";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../Navbar";
import useFetchUsers from "../../hooks/useFetchUsers";

export default function Admin() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const { users, loadingUsers } = useFetchUsers();

  useEffect(() => {
    if (user?.email !== "admin@mail.com") {
      navigate("/");
      return;
    }
    if (error) {
      toast.error(error.message);
    }
  }, [user, error, navigate]);

  if (loading || loadingUsers) return <Loading />;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-700">Users</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="px-5 py-3 border-b-2 border-gray-300">#</th>
                <th className="px-5 py-3 border-b-2 border-gray-300">
                  Full Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-300">Email</th>
                <th className="px-5 py-3 border-b-2 border-gray-300">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="px-5 py-2 text-center">{index + 1}</td>
                  <td className="px-5 py-2">{user.fullName}</td>
                  <td className="px-5 py-2">{user.email}</td>
                  <td className="px-5 py-2">
                    <Link
                      to={`/user/${user.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
