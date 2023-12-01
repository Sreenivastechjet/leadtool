import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { getempoptions } from "../Api/AuthApi";
import { AsyncPaginate } from "react-select-async-paginate";

const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Completed", label: "Completed" },
  { value: "To Do", label: "To Do" },
];

const employeelist = [
  { value: "arun", label: "Arun" },
  { value: "kiran", label: "Kiran" },
  { value: "nithin", label: "Nithin" },
  { value: "megha", label: "Megha" },
  { value: "mahima", label: "Mahima" },
];

function CreateTask() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    task: "",
    date: "",
    status: "",
    owner: "",
    assignees: [],
  });
  const [formErrors, setFormErrors] = useState({});

  const [owner, setOwner] = useState("");
  const handelChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };
  const handleownerselect = (option) => {
    setOwner(option.lable);
    setData({ ...data, owner: option.value });
    setFormErrors({
      ...formErrors,
      owner: "",
    });
  };
  const handlePeopleChange = (e) => {
    const assignees = e
    setData({
      ...data,
      assignees,
    });
    setFormErrors({
      ...formErrors,
      assignees: "",
    });
  };

  const isFieldEmpty = (value) => {
    return value.trim() === "";
  };

  const loadEmpOptions = async (search, loadedOptions, page) => {
    try {
      const response = await getempoptions(search, page);

      const results = response.data.options || [];

      const options = results.map((item) => ({
        key: item.key,
        value: item.value,
        label: item.label,
      }));

      return {
        options,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      toast.error("Error loading employee options:", error.response.data.msg);
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (isFieldEmpty(data.name)) {
      errors.name = "Name is required";
    }
    if (isFieldEmpty(data.task)) {
      errors.task = "Task is required";
    }
    if (isFieldEmpty(data.date)) {
      errors.date = "Date is required";
    }
    if (isFieldEmpty(data.owner)) {
      errors.owner = "Owner is required";
    }
    if (data.assignees.length === 0) {
      errors.assignees = "Assign To is required";
    }

    setFormErrors(errors);
    // console.log("first", Object.keys(errors));

    if (Object.keys(errors).length === 0) {
      const res = await axios
        .post(`/api/v1/task/createtask`, data)
        .then((res) => {
          if (res) {
            toast.success(res.data.msg);
            navigate("/tasks");
            setData({});
            setOwner("");
          }
        })
        .catch((error) => {
          toast.success(error?.response.data?.msg);
        });
    }
  };



  return (
    <div className="main">
      <div className="p-3" style={{ minHeight: "90vh" }}>
        <form className="p-3" onSubmit={handlesubmit}>
          <div className="row d-flex justify-content-center">
            <div className="col-6 card p-3">
              <div>
                <h5>Create Task</h5>
              </div>

              <div className="form-group mt-3 pb-1">
                <label className="h4text">Lead Name</label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handelChange}
                  className="form-control mt-2 custom-input"
                  placeholder="Name "
                />
                {formErrors.name && (
                  <p class="text-danger p-0 mt-1 m-0" role="alert">
                    {formErrors.name}
                  </p>
                )}
              </div>
              <div className="form-group mt-3 pb-1">
                <label className="h4text">Task</label>
                <input
                  type="text"
                  name="task"
                  value={data.task}
                  onChange={handelChange}
                  className="form-control mt-2 custom-input"
                  placeholder="task "
                />
                {formErrors.task && (
                  <p class="text-danger p-0 mt-1 m-0" role="alert">
                    {formErrors.task}
                  </p>
                )}
              </div>
              <div className="form-group mt-3 pb-1">
                <label className="h4text">Date</label>
                <input
                  type="date"
                  name="date"
                  value={data.date}
                  onChange={handelChange}
                  className="form-control mt-2 custom-input"
                  placeholder="dd/mm/yyyy "
                  min={new Date().toISOString().split("T")[0]}
                />
                {formErrors.date && (
                  <p class="text-danger p-0 mt-1 m-0" role="alert">
                    {formErrors.date}
                  </p>
                )}
              </div>
              <div className="form-group mt-3 pb-1">
                <label className="h4text">Owner</label>
                <Select
                  // name="leadsource"
                  value={owner}
                  onChange={handleownerselect}
                  options={employeelist}
                  className="reactselect"
                />
                {formErrors.owner && (
                  <p class="text-danger p-0 mt-1 m-0" role="alert">
                    {formErrors.owner}
                  </p>
                )}
              </div>
              <div className="form-group mt-3 pb-3">
                <label className="h4text">Assign To</label>
                {/* <Select
                  defaultValue={data.assigne}
                  isMulti
                  name="colors"
                  options={employeelist}
                  className="basic-multi-select"
                  onChange={handlePeopleChange}
                  classNamePrefix="select"
                /> */}
                <AsyncPaginate
                  loadOptions={loadEmpOptions}
                  additional={{
                    page: 1,
                  }}
                  name="colors"
                  isMulti={true} 
                  isSearchable={true}
                  isClearable={true}
                  classNamePrefix="select"
                  className="dist-form-values"
                  onChange={handlePeopleChange}
                />
                {formErrors.assignees && (
                  <p class="text-danger p-0 mt-1 m-0" role="alert">
                    {formErrors.assignees}
                  </p>
                )}
              </div>
              <div className="text-center">
                <button className="btn btn-primary" type="submit">
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default CreateTask;
