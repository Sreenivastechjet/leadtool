import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const tasks = [
  {
    __id: "456",
    name: "name",
    email: "email",
    assign: "assign",
    status: "Pending",
    owner: "oener",
  },
];

const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Completed", label: "Completed" },
  { value: "To Do", label: "To Do" },
];

function Task() {
  const [task, setTask] = useState([]);
  const [taskList, setTaskList] = useState("");
  const assignee = useSelector((state) => state.user.userInfo?.user?.email);

  const handleStatusChange = async (selectedOption, id) => {
    setTaskList(selectedOption.value);
    const res = await axios
      .patch(`/api/v1/task/updatetask/${id}/${selectedOption.value}`)
      .then((res) => {
        if (res) {
          // console.log(res);
          toast.success(res.data.msg)
          getlist();
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.msg)
      });
  };
  const getlist = async (e) => {
    // const assigneeValue = "lenovo@gmail.com"
    // const assigneeValue = "sree@gmail.com"
    const res = await axios
      .post(`/api/v1/task/getalltasks/${assignee}`)
      .then((res) => {
        setTask(res.data);
      })
      .catch((error) => {
        toast.error("error", error);
      });
  };
  useEffect(() => {
    getlist();
  }, []);

  return (
    <div className="main">
      <div className="p-3">
        <div className="pt-3 pb-3 m-3 d-flex justify-content-end">
          <div className="d-flex">
            <NavLink to={`/createtask`} style={{ textDecoration: "none" }}>
              <button className="btn btn-primary me-2">Add Task</button>
            </NavLink>
          </div>
        </div>

        <div>
          <div style={{ height: "400px", width: "100%", overflowY: "scroll" }}>
            <Table striped bordered hover className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Lead Name</th>
                  <th>Task</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Assigne</th>
                </tr>
              </thead>
              <tbody>
                {task.map((item, index) => {
                  return (
                    <tr key={item}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.task}</td>
                      <td>{item.date}</td>
                      <td style={{ width: "200px" }}>
                        <Select
                          options={statusOptions}
                          defaultValue={statusOptions.find(
                            (option) => option.value === item.status
                          )}
                          onChange={(selectedOption) =>
                            handleStatusChange(selectedOption,item._id)
                          }
                        />
                      </td>
                      <td>{item.owner}</td>
                      <td>
                        <p className="d-flex">
                          {item.assignees.map((emp, i) => {
                            // console.log("asfasf>>>", emp)
                            return <span> {emp.label}, &nbsp; </span>;
                          })}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task;
