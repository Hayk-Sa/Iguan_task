import { useState } from "react";
import type { FormEventHandler } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../Loading";

type Errors = Record<
	"fullName" | "email" | "password" | "repeatPassword",
	string
>;

const SignUp = () => {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [errors, setErrors] = useState<Errors>({
		email: "",
		fullName: "",
		password: "",
		repeatPassword: "",
	});

	const navigate = useNavigate();

	const [createUserWithEmailAndPassword, user, loading, error] =
		useCreateUserWithEmailAndPassword(auth);

	const validateForm = () => {
		const tempErrors: Errors = {
			email: "",
			fullName: "",
			password: "",
			repeatPassword: "",
		};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

		if (!fullName) {
			tempErrors.fullName = "Full name is required";
		}

		if (!email) {
			tempErrors.email = "Email is required";
		} else if (!emailRegex.test(email)) {
			tempErrors.email = "Invalid email format";
		}

		if (!password) {
			tempErrors.password = "Password is required";
		} else if (!passwordRegex.test(password)) {
			tempErrors.password =
				"Password must be at least 8 characters, include an uppercase letter, a lowercase letter, and a number";
		}

		if (!repeatPassword) {
			tempErrors.repeatPassword = "Repeating the password is required";
		} else if (password !== repeatPassword) {
			tempErrors.repeatPassword = "Passwords do not match";
		}

		setErrors(tempErrors);
		return Object.values(tempErrors).filter(Boolean).length === 0;
	};
	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (validateForm()) {
			createUserWithEmailAndPassword(email, password).then((userCredential) => {
				return setDoc(doc(db, "users", userCredential?.user.uid as string), {
					fullName,
					email,
					header: {
						enabled: false,
						color: null,
					},
					body: {
						enabled: false,
						color: null,
					},
					footer: {
						enabled: false,
						color: null,
					},
				});
			});
		}
	};

	if (error) {
		toast.error(error.message);
	}
	if (loading) {
		return <Loading />;
	}
	if (user) {
		toast.success("Signed up successfully");
		navigate("/");
		return;
	}

	return (
		<div className="flex items-center justify-center h-screen bg-gray-900">
			<div className="p-6 max-w-sm w-full bg-gray-800 text-white shadow-md rounded-md">
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							className="block text-gray-300 text-sm font-bold mb-2"
							htmlFor="fullName"
						>
							Full Name
						</label>
						<input
							type="text"
							id="fullName"
							className={`shadow appearance-none border ${
								errors.fullName ? "border-red-500" : "rounded"
							} w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white`}
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
						/>
						{errors.fullName && (
							<p className="text-red-500 text-xs italic">{errors.fullName}</p>
						)}
					</div>

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
							className={`shadow appearance-none border ${
								errors.email ? "border-red-500" : "rounded"
							} w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white`}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						{errors.email && (
							<p className="text-red-500 text-xs italic">{errors.email}</p>
						)}
					</div>

					<div className="mb-4">
						<label
							className="block text-gray-300 text-sm font-bold mb-2"
							htmlFor="password"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							className={`shadow appearance-none border ${
								errors.password ? "border-red-500" : "rounded"
							} w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white`}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						{errors.password && (
							<p className="text-red-500 text-xs italic">{errors.password}</p>
						)}
					</div>

					<div className="mb-6">
						<label
							className="block text-gray-300 text-sm font-bold mb-2"
							htmlFor="repeatPassword"
						>
							Repeat Password
						</label>
						<input
							type="password"
							id="repeatPassword"
							className={`shadow appearance-none border ${
								errors.repeatPassword ? "border-red-500" : "rounded"
							} w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white`}
							value={repeatPassword}
							onChange={(e) => setRepeatPassword(e.target.value)}
						/>
						{errors.repeatPassword && (
							<p className="text-red-500 text-xs italic">
								{errors.repeatPassword}
							</p>
						)}
					</div>

					<div className="flex items-center justify-between">
						<button
							className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							type="submit"
						>
							Sign Up
						</button>
						<Link to="/sign-in">Sign In</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
