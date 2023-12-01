import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { isEmailValid, isFieldEmpty } from "../utils/common";

function Forgetpassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      email: isFieldEmpty(email)
        ? "Email is required"
        : !isEmailValid(email) && "Invalid email format",
    };

    setEmailError(errors);

    if (!errors.email) {
      const response = await axios
        .post("/api/v1/auth/forgetpassword", { email })
        .then((res) => {
           
          if (res) {
            setEmail("");
            toast.success(res.data.msg);
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.msg);
        });
    }
  };

  return (
    <div className="bgblue" style={{ height: "100vh" }}>
      <div className="row">
        <div className="col-4 offset-4 card mt-5 p-5">
          <div>
            <div className="text-center">
              <h4>Forget Password</h4>
            </div>
            <div className="mb-3 mt-5 ">
              <label>Email address</label>
              <input
                type="email"
                className={`form-control mt-1 text-lowercase mt-2 ${
                  emailError.email ? "is-invalid" : ""
                }`}
                placeholder="Enter email id"
                required
                value={email}
                onChange={handleChange}
              />
              {emailError.email && (
                <div className="invalid-feedback">{emailError.email}</div>
              )}
            </div>
            <div className="text-center">
              <button className="btn btn-primary" onClick={onSubmit}>
                Send Mail
              </button>
            </div>
            <p className="float-end mt-2">
              <NavLink to="/login">Login</NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forgetpassword;
