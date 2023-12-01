import React, { useEffect, useState } from "react";
import "../../App.css";
import { useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  isEmailValid,
  isFieldEmpty,
  isNumberValid,
} from "../utils/common";
import { getempDetailsbyId, updateempDetailsbyId } from "../Api/EmpApi";
const EmpRole = [
  { value: "Admin", label: "Admin" },
  { value: "Client", label: "Client" },
  { value: "Sales Executive", label: "Sales Executive" },
  { value: "Sales Manager", label: "Sales Manager" },
  { value: "Project Manager", label: "Project Manager" },
  { value: "Developer", label: "Developer" },
];

function Empdetails() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    number: "",
    role: "",
    employeeId: "",
  });
  const [originalUser, setOriginalUser] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [editMode, setEditMode] = useState(true);
  const navigate = useNavigate();
  const id = useParams();

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

  const getDetails = (id) => {
    getempDetailsbyId(id)
      .then((res) => {
        if (res) {
          setUser((user) => ({ ...user, ...res?.data?.user }));
          setOriginalUser(res?.data?.user);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.msg);
      });
  };
  useEffect(() => {
    getDetails(id);
  }, []);

  const handelSubmit = (e) => {
    e.preventDefault();
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

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
        const data = {
            name:user.name,
            email:user.email,
            number:user.number,
            role:user.role,
            employeeId:user.employeeId,
        }
      const response = updateempDetailsbyId(id, data)
        .then((res) => {
          if (res) {
            setUser({});
            setEditMode(true);
            navigate("/employee");
            toast.success(res.data.msg);
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.masg);
        });
    }
  };
  const handlecancel = () => {
    setEditMode(true);
    setUser({ ...originalUser });
    setFormErrors({})
  };
  return (
    <div className="main">
      <div className="container p-5" style={{ minHeight: "92vh" }}>
        <div className="d-flex justify-content-between">
          <div>
            <button className="ps-3 btn btn-outline-secondary" onClick={back}>
              {" "}
              <MdKeyboardBackspace /> Back To List
            </button>
          </div>
          <div>
            {!editMode ? (
              <button
                className="me-3 btn btn-outline-primary"
                onClick={handlecancel}
              >
                Cancel
              </button>
            ) : (
              <button
                className="me-3 btn btn-outline-primary"
                onClick={() => setEditMode(false)}
              >
                Edit
              </button>
            )}

            <button onClick={handelSubmit} className="btn btn-primary">
              {"Update"}
            </button>
          </div>
        </div>
        <div>
          <form>
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
                    readOnly={editMode}
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
                    readOnly={editMode}
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
                    value={EmpRole.find((option) => option.value === user.role)}
                    name="colors"
                    options={EmpRole}
                    isDisabled={editMode}
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
                  <label>Email address :</label>
                </div>
                <div className="col-4">
                  <input
                    type="text"
                    name="email"
                    readOnly={editMode}
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
                    readOnly={editMode}
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default Empdetails;
