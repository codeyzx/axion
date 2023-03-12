import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import logo from "../assets/axionLogo.svg";
import { authToken } from "../atoms/authToken";
import { userState } from "../atoms/userAtom";
import { postRequest } from "../configs/axios";

function Signup() {
  const [, setUser] = useRecoilState(userState);
  const [, setToken] = useRecoilState(authToken);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const addressRef = useRef();
  const phoneRef = useRef();

  const signupHandler = async (ev) => {
    ev.preventDefault();
    const id = toast.loading("Tolong tunggu...");
    setLoading(true);
    try {
      const registerReq = await postRequest("register", {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passRef.current.value,
        address: addressRef.current.value,
        phone: phoneRef.current.value,
        role: "Users",
      });
      if (registerReq.status === 200) {
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
            render: "Sukses, Selamat Datang!",
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
      } else {
        toast.update(id, {
          render: "Terjadi Error",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }

      toast.update(id, {
        render: "Sukses, Selamat Datang!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      navigate("/app/home");
    } catch (error) {
      if (error.message.includes("already-in-use")) {
        toast.update(id, {
          render: "This Email Already In Use",
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
        <title>Get Started | Axion</title>
      </Helmet>
      <nav className="py-4 px-4 lg:px-16 flex items-center justify-between ">
        <Link to="/">
          <img src={logo} alt="axion icon" />
        </Link>
        <div>
          <span className="opacity-80 hidden md:inline">
            Sudah punya akun?{" "}
          </span>
          <Link
            to="/login"
            className="font-semibold text-purple-600 underline hover:font-bold"
          >
            Masuk
          </Link>
        </div>
      </nav>
      <div className="flex px-4 justify-center mt-6 flex-col max-w-sm mx-auto">
        <h1 className="text-3xl font-semibold text-center">Daftar Sekarang</h1>

        {/* Form Signup Biasa */}
        <form className="flex flex-col mt-6 gap-3" onSubmit={signupHandler}>
          <input
            type="text"
            required
            disabled={loading}
            placeholder="Name"
            className="inputStyle"
            ref={nameRef}
          />
          <input
            type="email"
            required
            disabled={loading}
            placeholder="Email"
            className="inputStyle"
            ref={emailRef}
          />
          <input
            type="password"
            required
            disabled={loading}
            minLength={8}
            placeholder="Password"
            className="inputStyle"
            ref={passRef}
          />
          <input
            type="number"
            disabled={loading}
            placeholder="Phone"
            className="inputStyle"
            ref={phoneRef}
          />
          <input
            type="text"
            disabled={loading}
            placeholder="Address"
            className="inputStyle"
            ref={addressRef}
          />
          <button
            type="submit"
            disabled={loading}
            className={`p-3 mt-2 tracking-widest font-semibold hover:bg-purple-700 transition-all duration-200 ease-out bg-purple-600 text-white rounded-lg ${
              loading && "opacity-75"
            } `}
          >
            Daftar
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
