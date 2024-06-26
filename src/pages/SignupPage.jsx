import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { postData } from "../../utils";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === "password") {
            const digitRegex = /\d/;
            const lowercaseRegex = /[a-z]/;
            const uppercaseRegex = /[A-Z]/;

            const hasDigit = digitRegex.test(value);
            const hasLowercase = lowercaseRegex.test(value);
            const hasUppercase = uppercaseRegex.test(value);

            if (
                !(hasDigit && hasLowercase && hasUppercase && value.length >= 8)
            ) {
                setPasswordError(
                    "Password must be 8+ characters long and contain at least one digit, one lowercase letter, one uppercase letter."
                );
            } else {
                setPasswordError("");
            }
        } else if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const validEmail = emailRegex.test(value);
            setEmailError("");
            if (!validEmail || !value.endsWith("@torontomu.ca")) {
                setEmailError(
                    "Please enter a valid email address ending with @torontomu.ca."
                );
            }
        }
    };

    const isFormValid = () => {
        return (
            formData.username.trim() !== "" &&
            formData.email.trim() !== "" &&
            formData.password.trim() !== "" &&
            !emailError &&
            !passwordError
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // when this boolean is set, a loading animation will show
        setIsLoading(true);
        // creates the user data and POSTS it to the backend
        const data = await postData("/api/users", {
            username: formData.username,
            email: formData.email,
            password: formData.password,
        });

        // creates the token for Log in and to save into local storage
        const dataToken = await postData("/api/token", {
            username: formData.username,
            password: formData.password,
        });

        setIsLoading(false);

        // save to local storage so it stays after refresh
        localStorage.setItem("token", dataToken.token);

        // go to homepage after logging in
        navigate("/");
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <section className="flex items-center justify-center min-h-screen">
            <div className="card w-96 bg-base-200 shadow-xl">
                <div className="card-body">
                    <img
                        src="https://www.torontomu.ca/content/dam/brand/global/images/visual-guide/tmu-logo-social-media.jpg"
                        alt="Image"
                        className="mb-4 rounded-lg w-24 h-24 mx-auto"
                    />
                    <h2 className="card-title">Create an account</h2>
                    <div>
                        <label htmlFor="username" className="label">
                            Your Username
                        </label>
                        <input
                            type="username"
                            id="username"
                            name="username"
                            className="input input-bordered input-primary w-full max-w-xs"
                            placeholder="Enter username"
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="label">
                            Your Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="input input-bordered input-primary w-full max-w-xs"
                            placeholder="name@torontomu.ca"
                            required
                            onChange={handleChange}
                        />
                        {emailError && (
                            <p className="text-red-500 text-sm">{emailError}</p>
                        )}
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="label">
                            Password
                        </label>
                        <div className="">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="input input-bordered input-primary  w-full max-w-xs"
                                placeholder="Enter password"
                                required
                                onChange={handleChange}
                            />
                            <svg
                                className="absolute right-0 top-0 mt-2 mr-3 h-6 w-6 text-gray-500 cursor-pointer"
                                onClick={toggleShowPassword}
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                            >
                                {showPassword ? (
                                    // Eye open if showing
                                    <path
                                        fill="currentColor"
                                        d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
                                    ></path>
                                ) : (
                                    // Eye closed if hidden
                                    <path
                                        fill="currentColor"
                                        d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"
                                    ></path>
                                )}
                            </svg>
                        </div>
                        {passwordError && (
                            <p className="text-red-500 text-sm">
                                {passwordError}
                            </p>
                        )}
                    </div>
                    <div className="card-actions justify-center">
                        <button
                            className="btn btn-primary"
                            disabled={!isFormValid()}
                            onClick={handleSubmit}
                        >
                            Sign up
                        </button>
                    </div>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        >
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default SignupPage;
