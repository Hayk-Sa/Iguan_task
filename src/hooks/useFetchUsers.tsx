import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";

const useFetchUsers = () => {
  const [users, setUsers] = useState<
    Array<{ id: string; fullName: string; email: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollectionRef = collection(db, "users");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as { fullName: string; email: string }),
      }));
      setUsers(usersData);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return { users, loadingUsers: loading };
};

export default useFetchUsers;
