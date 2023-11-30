import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase.config";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
type Props = {
	backBtn?: boolean;
};

const Navbar = ({ backBtn }: Props) => {
	const [user] = useAuthState(auth);
	const [signOut] = useSignOut(auth);
	const [userName, setUserName] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			const fetchUserData = async () => {
				try {
					const userRef = doc(db, "users", user.uid);
					const docSnap = await getDoc(userRef);

					if (docSnap.exists()) {
						setUserName(docSnap.data().fullName);
					} else {
						console.log("No such document in Firestore!");
					}
				} catch (error) {
					console.error("Error fetching user data:", error);
				}
			};

			fetchUserData();
		}
	}, [user]);
	const handleLogout = () => {
		signOut();
		navigate("/sign-in");
	};

	return (
		<header className="bg-gray-800 text-white p-4 flex justify-between items-center">
			<h1 className="text-lg font-bold">Iguan Task</h1>
			<div className="flex flex-end items-center gap-8">
				{backBtn ? (
					<Link
						to="../"
						className="text-blue-100 inline-flex justify-between items-center gap-2"
					>
						<FaArrowLeft /> Back
					</Link>
				) : null}
				{user && (
					<div className="flex items-center space-x-4">
						<span>
							Welcome, {userName || "Admin"} ({user.email})
						</span>
						<button
							onClick={handleLogout}
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
						>
							Logout
						</button>
					</div>
				)}
			</div>
		</header>
	);
};

export default Navbar;
