import  { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const auth = useContext(AuthContext);

  console.log("PROFILE PAGE AUTH:", auth);

  if (auth?.loading) return <p>Loading...</p>;

  if (!auth?.user) {
    return <p className="p-4 text-red-500">⚠️ No user found. Please login again.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">Welcome, {auth.user.name}</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(auth.user, null, 2)}
      </pre>
      <button
        onClick={auth.logout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;

