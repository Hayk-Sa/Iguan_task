import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase.config";
import Loading from "../Loading";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import BlockElement from "../BlockElement";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

type Element = {
  color: string | null;
  enabled: boolean;
};

export type Elements = {
  header: Element;
  body: Element;
  footer: Element;
};

const initialState: Elements = {
  header: {
    color: null,
    enabled: false,
  },
  body: {
    color: null,
    enabled: false,
  },
  footer: {
    color: null,
    enabled: false,
  },
};

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [elements, setElements] = useState<Elements>(initialState);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setElements({
              header: docSnap.data().header,
              body: docSnap.data().body,
              footer: docSnap.data().footer,
            } as Elements);
          } else {
            console.log("No such document in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    } else {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
    if (user?.email === "admin@mail.com") {
      navigate("/admin");
    }
  }, [user, error, navigate]);

  if (loading) return <Loading />;

  return (
    <div>
      <Navbar />
      <div className="p-4 space-y-4">
        <BlockElement
          title="Header"
          color={elements.header.color}
          enabled={elements.header.enabled}
        />
        <BlockElement
          title="Body"
          color={elements.body.color}
          enabled={elements.body.enabled}
        />
        <BlockElement
          title="Footer"
          color={elements.footer.color}
          enabled={elements.footer.enabled}
        />
      </div>
    </div>
  );
}
