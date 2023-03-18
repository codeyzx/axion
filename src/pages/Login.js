import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import logo from "../assets/axionLogo.svg";
import { authToken } from "../atoms/authToken";
import { userState } from "../atoms/userAtom";
import { postRequest } from "../configs/axios";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [, setUser] = useRecoilState(userState);
  const [, setToken] = useRecoilState(authToken);

  const emailRef = useRef();
  const passRef = useRef();

  const loginHandler = async (ev) => {
    ev.preventDefault();
    const id = toast.loading("Please wait...");
    setLoading(true);
    try {
      const tokenReq = await postRequest("login", {
        email: emailRef.current.value,
        password: passRef.current.value,
      });
      if (tokenReq.status === 200) {
        setToken(tokenReq.data["token"]);
        setUser(tokenReq.data["user"]);

        localStorage.setItem("token", tokenReq.data["token"]);
        localStorage.setItem("user", JSON.stringify(tokenReq.data["user"]));

        toast.update(id, {
          render: "Success, Welcome!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        if (tokenReq.data["user"]["role"] === "Admin") {
          navigate("/admin/home");
        } else if (tokenReq.data["user"]["role"] === "Operator") {
          navigate("/operator/home");
        } else {
          navigate("/app/home");
        }
      } else {
        toast.update(id, {
          render: "Email atau password salah",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      if (error.code.includes("not-found")) {
        toast.update(id, {
          render: "Maaf, akun tak ditemukan",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      } else if (error.code.includes("wrong-password")) {
        toast.update(id, {
          render: "Email atau password salah",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }
      toast.update(id, {
        render: "Terjadi Error",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Axion</title>
      </Helmet>
      <nav className="py-4 px-4 lg:px-16 flex items-center justify-between ">
        <Link to="/">
          <img src={logo} alt="axion icon" />
        </Link>
        <div>
          <span className="opacity-80 hidden md:inline">
            Don't have an account?{" "}
          </span>
          <Link
            to="/signup"
            className="font-semibold text-purple-600 underline hover:font-bold"
          >
            Register
          </Link>
        </div>
      </nav>
      <div className="flex px-4 lg:px-0 justify-center mt-6 flex-col max-w-sm mx-auto">
        <h1 className="text-3xl font-semibold text-center">Welcome Back!</h1>

        {/* Form Login Biasa */}
        <form className="flex flex-col mt-6 gap-3" onSubmit={loginHandler}>
          <input
            disabled={loading}
            ref={emailRef}
            type="email"
            placeholder="Email"
            required
            className="inputStyle"
          />
          <input
            ref={passRef}
            disabled={loading}
            type="password"
            placeholder="Password"
            required
            minLength={8}
            className="inputStyle"
          />
          <button
            type="submit"
            disabled={loading}
            className={`p-3 mt-2 tracking-widest font-semibold hover:bg-purple-700 transition-all duration-200 ease-out bg-purple-600 text-white rounded-lg ${
              loading && "opacity-75"
            }`}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
