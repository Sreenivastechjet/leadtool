import React, { useEffect, useState } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  isEmailValid,
  isFieldEmpty,
  isNumberValid,
  isPasswordValid,
} from "../utils/common";
const EmpRole = [
  { value: "Admin", label: "Admin" },
  { value: "Client", label: "Client" },
  { value: "Sales Executive", label: "Sales Executive" },
  { value: "Sales Manager", label: "Sales Manager" },
  { value: "Project Manager", label: "Project Manager" },
  { value: "Developer", label: "Developer" },
];

function AddEmployee() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    role: "",
    employeeId: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handelChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };
  const back = () => {
    navigate(`/employee`);
  };
  const handlePositionChange = (selectedOptions) => {
    const role = selectedOptions.value;
    setUser({
      ...user,
      role,
    });
    setFormErrors({
      ...formErrors,
      role: "",
    });
  };


  const handelSubmit = async (e) => {
    e.preventDefault();
    // console.log("user", user);
    const lowercaseEmail = user.email.toLowerCase();
    const errors = {};
    if (isFieldEmpty(user.name)) {
      errors.name = "Name is required";
    }
    if (isFieldEmpty(user.email)) {
      errors.email = "Email is required";
    } else if (!isEmailValid(user.email)) {
      errors.email = "Invalid email format";
    }
    if (isFieldEmpty(user.employeeId)) {
      errors.employeeId = "Id is required";
    }
    if (isFieldEmpty(user.number)) {
      errors.number = "Number is required";
    } else if (!isNumberValid(user.number)) {
      errors.number = "Invalid number format";
    }
    if (isFieldEmpty(user.role)) {
      errors.role = "Role  is required";
    }
    if (isFieldEmpty(user.password)) {
      errors.password = "Password is required";
    } else if (!isPasswordValid(user.password)) {
      errors.password = "Password should be at least 8 characters long";
    }

    setFormErrors(errors);
    console.log("first", Object.keys(errors));

    if (Object.keys(errors).length === 0) {
      const payload = {
        ...user,
        email: lowercaseEmail,
      };
      const response = await axios
        .post(`/api/v1/auth/register`, payload)
        .then((res) => {
          if (res) {
            setUser({});
            navigate("/employee");
            toast.success(res.data.msg);
          }
        })
        .catch((error) => {
          toast.error(error.response.data.masg);
        });
    }
  };
  return (
    <div className="main">
      <div className="container p-5" style={{ minHeight: "92vh" }}>
        <button className="ps-3 btn btn-outline-secondary" onClick={back}>
          {" "}
          <MdKeyboardBackspace /> Back To List
        </button>
        <div>
          <form onSubmit={handelSubmit}>
            <div class="mb-3 mt-5">
              <div className="row align-items-center">
                <div className="col-2">
                  <label>Employee Name :</label>
                </div>
                <div className="col-4">
                  <input
                    type="text"
                    name="name"
                    className="form-control mt-1"
                    placeholder="Enter employee name"
                    value={user.name}
                    onChange={handelChange}
                  />
                  {formErrors.name && (
                    <p class="text-danger p-0 mt-1 m-0" role="alert">
                      {formErrors.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div class="mb-3 ">
              <div className="row align-items-center">
                <div className="col-2">
                  <label>Employee Id :</label>
                </div>
                <div className="col-4">
                  <input
                    type="text"
                    name="employeeId"
                    className="form-control mt-1"
                    placeholder="Enter employee id"
                    value={user.employeeId}
                    onChange={handelChange}
                  />
                  {formErrors.employeeId && (
                    <p class="text-danger p-0 mt-1 m-0" role="alert">
                      {formErrors.employeeId}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div class="mb-3">
              <div className="row align-items-center">
                <div className="col-2">
                  <label>Position :</label>
                </div>
                <div className="col-4">
                  <Select
                    defaultValue={user.role}
                    name="colors"
                    options={EmpRole}
                    className="basic-multi-select"
                    onChange={handlePositionChange}
                    placeholder="Select position"
                  />
                  {formErrors.role && (
                    <p class="text-danger p-0 mt-1 m-0" role="alert">
                      {formErrors.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div class="mb-3 ">
              <div className="row align-items-center">
                <div className="col-2">
                  <label>Email Id :</label>
                </div>
                <div className="col-4">
                  <input
                    type="text text-lowercase"
                    name="email"
                    className="form-control mt-1"
                    placeholder="Enter email id"
                    value={user.email}
                    onChange={handelChange}
                  />
                  {formErrors.email && (
                    <p class="text-danger p-0 mt-1 m-0" role="alert">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div class="mb-3">
              <div className="row align-items-center">
                <div className="col-2">
                  <label>Number :</label>
                </div>
                <div className="col-4">
                  <input
                    type="number"
                    name="number"
                    className="form-control mt-1"
                    placeholder="Enter number"
                    value={user.number}
                    onChange={handelChange}
                  />
                  {formErrors.number && (
                    <p class="text-danger p-0 mt-1 m-0" role="alert">
                      {formErrors.number}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div class="mb-3">
              <div className="row align-items-center">
                <div className="col-2">
                  <label>Password :</label>
                </div>
                <div className="col-4">
                  <input
                    type="password"
                    name="password"
                    className="form-control mt-1"
                    placeholder="Enter password"
                    value={user.password}
                    onChange={handelChange}
                  />
                  {formErrors.password && (
                    <p class="text-danger p-0 mt-1 m-0" role="alert">
                      {formErrors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-6  d-flex justify-content-center">
              <button type="submit" className="btn btn-primary mt-3">
                {"Create Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;
