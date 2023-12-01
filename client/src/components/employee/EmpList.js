import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { NavLink } from "react-router-dom";
import { Pagination, Input } from "antd";

function EmpList() {
  const { Search } = Input;
  const [emp, setEmp] = useState([]);
  const [length, setLength] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [pageSize, setPageSize] = useState(8);
  const [page, setPage] = useState(1);
  const handleSearchChange = (e) => {
    setPage(1);
    setSearchKey(e.target.value);
  };

  const getEmp = async () => {
    const res = await axios
      .post(
        `/api/v1/auth/getallemplist?page=${page}&pageSize=${pageSize}&search=${searchKey}`
      )
      .then((res) => {
        setEmp(res?.data?.emplist);
        setLength(res?.data?.totallist);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getEmp();
  }, [page]);
  return (
    <div className="main" style={{ height: "92vh" }}>
      <div className="p-4">
        <div className="pb-3 mt-3 d-flex justify-content-between">
          <h4>Employee List</h4>
          <div>
            <NavLink to={`/addemploye`} style={{ textDecoration: "none" }}>
              <button className="btn btn-primary"> + Add Employee</button>
            </NavLink>
          </div>
        </div>
        <div className="d-flex">
          <Search
            style={{ width: "500px", padding: "10px 20px 10px 0px" }}
            size="large"
            className="serach_customerswithId"
            placeholder="Search by Name / Email"
            enterButton
            onSearch={getEmp}
            value={searchKey.trimStart()}
            onChange={handleSearchChange}
          />
        </div>
        <Table striped bordered hover className="table">
          <thead>
            <tr>
              <th>Employee Id</th>
              <th>Employee Name</th>
              <th>Email</th>
              <th>Number</th>
              <th>Position</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {emp.map((item, index) => {
              return (
                <tr key={item}>
                  <td>{item.employeeId}</td>
                  <td>
                    {
                      <NavLink
                        to={`/empdetails/${item._id}`}
                        style={{ textDecoration: "none" }}
                      >
                        {item.name}
                       </NavLink>
                    }
                  </td>
                  <td>{item.email}</td>
                  <td>{item.number}</td>
                  <td>{item.role}</td>
                  <td>{"Active"}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {length == 0 ? (
          <div className="text-center mt-5">"No data found"</div>
        ) : (
          <div className="d-flex justify-content-between p-3 bgwhite">
            <p>
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, length)} of {length} Employee
            </p>
            <Pagination
              hideOnSinglePage={true}
              showSizeChanger={false}
              current={page}
              total={length}
              pageSize={pageSize}
              onChange={(pageNo, pageSize) => {
                setPage(pageNo);
              }}
              size="default"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default EmpList;
