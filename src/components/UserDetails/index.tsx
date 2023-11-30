import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../../firebase.config";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import Loading from "../Loading";
import Navbar from "../Navbar";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Sketch from "@uiw/react-color-sketch";
import { Switch } from "@headlessui/react";
import { Elements } from "../Home";
import BlockElement from "../BlockElement";
import { FaPalette } from "react-icons/fa";
import useDebounce from "../../hooks/useDebounce";

type UserData = {
  fullName?: string;
  email?: string;
} & Elements;

const sections = ["header", "body", "footer"] as const;

export default function UserDetails() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCurrentUser(docSnap.data() as UserData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingUserDetails(false);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    if (user?.email !== "admin@mail.com") {
      navigate("/");
    }
    if (error) {
      toast.error(error.message);
    }
    if (!loadingUserDetails && !currentUser) {
      toast.error("User not found!");
    }
  }, [user, error, navigate, currentUser, loadingUserDetails]);

  const saveUserData = useDebounce(() => {
    const userRef = doc(db, "users", id as string);

    updateDoc(userRef, {
      ...currentUser,
    })
      .then(() => {
        toast.success("Update successful");
      })
      .catch(() => {
        toast.error("Failed to update");
      });
  }, 500);

  const saveUserDataDebounced = useDebounce(saveUserData, 500);

  useEffect(() => {
    saveUserDataDebounced();
  }, [currentUser]);

  const handleColorChange = (section: keyof Elements, color: string) => {
    setCurrentUser({
      ...currentUser,
      [section]: { ...currentUser?.[section], color },
    } as UserData);
  };

  const handleEnabledChange = (section: keyof Elements, enabled: boolean) => {
    setCurrentUser({
      ...currentUser,
      [section]: { ...currentUser?.[section], enabled },
    } as UserData);
  };

  const [colorPicker, setColorPicker] = useState<
    (typeof sections)[number] | null
  >(null);

  const colorPickerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      colorPickerRef.current &&
      !colorPickerRef.current.contains(event.target as Node)
    ) {
      setColorPicker(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleColorPicker = (section: (typeof sections)[number]) => {
    setColorPicker(colorPicker === section ? null : section);
  };

  if (loading || loadingUserDetails) return <Loading />;

  return (
    <div>
      <Navbar backBtn />
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <div key={section} className="flex items-center gap-4">
              <BlockElement
                color={currentUser?.[section].color || "#444"}
                enabled={true}
                title={section.charAt(0).toUpperCase() + section.slice(1)}
              />
              <div
                className="flex items-center gap-8"
                ref={colorPicker === section ? colorPickerRef : null}
              >
                <button
                  type="button"
                  onClick={() => toggleColorPicker(section)}
                  className="text-xl inline-flex justify-center items-center"
                >
                  <FaPalette /> <span className="inline-block ml-2">Color</span>
                </button>
                <div
                  style={{
                    position: "absolute",
                    zIndex: "2",
                  }}
                >
                  {colorPicker === section && (
                    <Sketch
                      color={currentUser?.[section].color || "#444"}
                      onChange={(color) =>
                        handleColorChange(section, color.hex)
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={currentUser?.[section].enabled}
                    onChange={(enabled) =>
                      handleEnabledChange(section, enabled)
                    }
                    className={`${
                      currentUser?.[section].enabled
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    } 
                                relative inline-flex items-center h-6 rounded-full w-11`}
                  >
                    <span className="sr-only">Enable {section}</span>
                    <span
                      className={`${
                        currentUser?.[section].enabled
                          ? "translate-x-6"
                          : "translate-x-1"
                      }
                                  inline-block w-4 h-4 transform bg-white rounded-full`}
                    />
                  </Switch>
                  <span>Enabled</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
