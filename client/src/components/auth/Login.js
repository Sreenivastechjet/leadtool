import React, { useState } from "react";
import "../../App.css";
import { useNavigate, NavLink } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { MdOutlineVpnKey } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handelSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error("Email and password cannot be empty");
      return;
    }
    setLoading(true)

    const lowercaseEmail = email.toLowerCase();  
    let jsonCredentials = { email: lowercaseEmail, password };

    if (email && password) {
      await axios
        .post("/api/v1/auth/login", jsonCredentials, {
          withCredentials: true,
          credentials: "include",
        })
        .then((res) => {
          if (res) {
            setLoading(false)
            toast.success("Loggedin Successfully");
            localStorage.setItem("loginToken", true);
            localStorage.setItem("islogged", true);
            setEmail("");
            setPassword("");
            navigate("/dashboard");
            window.location.reload();
          }
        })
        .catch((err) => {
          setLoading(false)
          toast.error(err?.response?.data?.msg);
        });
    }
  };
  return (
    <>
      <div className="row">
        <div
          className="col-6 text-center bgblue d-flex align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <div className="text-light">
            <h2>Hello!</h2>
            <h6>
              Enter your details & start your <br /> journey with us
            </h6>
            {/* <NavLink to="/register">
              <button className="btn btn-primary">Sign Up</button>
            </NavLink> */}
          </div>
        </div>
        <div
          className="col-6 d-flex align-items-center justify-content-center shadow"
          style={{ height: "100vh" }}
        >
          <div className="col-8 border p-5 shadow-lg p-3 mb-5 bg-body rounded">
            <h3 className="text-center">Login To Techjet.ai</h3>

            <form onSubmit={handelSubmit}>
              <div class="mb-3 mt-5 input-group flex-nowrap">
                <span class="input-group-text" id="addon-wrapping">
                  <FiMail />
                </span>
                <input
                  type="email"
                  className="form-control input-from text-lowercase"
                  placeholder="Enter email id"
                  aria-describedby="addon-wrapping"
                  
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div class="mb-3 input-group flex-nowrap">
                <span class="input-group-text" id="pass">
                  <MdOutlineVpnKey />
                </span>
                <input
                  type="password"
                  className="form-control input-from"
                  placeholder="Enter password"
                  aria-describedby="pass"
                  
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary ">
                  {loading ? "Loading..." : "Sign In"}
                </button>
              </div>
              <p className="float-end mt-2">
              <NavLink to="/forgetpassword">Forget Password</NavLink>
            </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
