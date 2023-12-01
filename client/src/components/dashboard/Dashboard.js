import React, { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../../GlobalContext";
import MixedChart from "./Chart";
import { getLeadsByDates } from "../Api/LeadApi";
import Select from "react-select";
import "./dashboard.css";
import ToDo from "./ToDo";
import { getChartData, getDealsByDates } from "../Api/DealApi";
import axios from "axios";
import Table from "react-bootstrap/Table";
import moment from "moment";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";


const dayOptions = [
  { value: "today", label: "Today" },
  { value: "this-month", label: "This Month" },
  { value: "this-year", label: "This Year" },
];

function Dashboard() {
  const context = useContext(GlobalContext);
  const [userEmail] = context.authApi.userEmail;
  const [day, setDay] = useState("this-year");
  const [dealday, setDealDay] = useState("this-year");
  const [count, setCount] = useState(0);
  const [dealCount, setDealCount] = useState(0);
  const [barchart, setBarchart] = useState([]);
  const [cardView, setCardView] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);

  const getLeads = async () => {
    const res = await getLeadsByDates(day)
      .then((res) => {
        if (res) {
          setCount(res?.data?.count);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.msg);
      });
  };
  const getDeals = async () => {
    const res = await getDealsByDates(dealday)
      .then((res) => {
        if (res) {
          setDealCount(res?.data?.count);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.msg);
      });
  };

  const getdataforChart = async () => {
    setChartLoading(true);
    const res = await getChartData()
      .then((res) => {
        if (res) {
          setBarchart(res?.data);
          setChartLoading(false);
        }
      })
      .catch((err) => {
        setChartLoading(false);
        toast.error(err.response.data.msg);
      });
  };
  const getupcomingmeetings = async () => {
    setLoading(true);
    const res = await axios
      .post(`/api/v1/event/getupcomingmeetings/${userEmail}`)
      .then((response) => {
        if (response) {
          setCardView(response?.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data.msg);
      });
  };
  useEffect(() => {
    getdataforChart();
    getupcomingmeetings();
  }, []);
  useEffect(() => {
    getLeads();
  }, [day]);
  useEffect(() => {
    getDeals();
  }, [dealday]);
  

  const antIcon = <LoadingOutlined className="loadingIcon" spin />;
  return (
    <div className="main">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mt-5 g-3">
            <div className="card" style={{ height: "150px" }}>
              <div className="card-body ">
                <div className="">
                  <div className="row">
                    <div className="col-7">
                      <h5 className="">Total No. of Leads</h5>
                      {loading ? (
                        <Spin indicator={antIcon} spinning={loading}></Spin>
                      ) : (
                        <h2 className="p-1">{count}</h2>
                      )}
                    </div>
                    <div className="col-5">
                      <Select
                        defaultValuevalue={day}
                        onChange={(selected) => setDay(selected.value)}
                        options={dayOptions}
                        className="reactselect"
                        placeholder="This Year"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-5 g-3">
            <div className="card" style={{ height: "150px" }}>
              <div className="card-body ">
                <div className="">
                  <div className="row">
                    <div className="col-7">
                      <h5 className="">No. Of Deals</h5>
                      {loading ? (
                        <Spin indicator={antIcon} spinning={loading}></Spin>
                      ) : (
                        <h2 className="p-1">{dealCount}</h2>
                      )}
                    </div>
                    <div className="col-5">
                      <Select
                        defaultValuevalue={dealday}
                        onChange={(selected) => setDealDay(selected.value)}
                        options={dayOptions}
                        className="reactselect"
                        placeholder="This Year"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mt-5 g-3">
            <div className="card" style={{ height: "150px" }}>
              <div className="card-body ">
                <div className="">
                  <div className="row">
                    <div className="col-7">
                      <h5 className="">Revenue</h5>
                      <p className="p-1">{"Counting....."}</p>
                    </div>
                    <div className="col-5">
                      <Select
                        defaultValuevalue={day}
                        // onChange={(selected) => setDay(selected.value)}
                        options={dayOptions}
                        className="reactselect"
                        placeholder="Today"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-2">
        <div className="row">
          <div className="col-md-8 g-3" style={{ height: "60vh" }}>
            <div className="card bgwhite">
              <div className=" p-3">
                <h5>Projects Overview</h5>
                {chartLoading ? (
                  <Spin indicator={antIcon} spinning={chartLoading}></Spin>
                ) : (
                  <>
                    <MixedChart
                      bardata={barchart?.monthlyData}
                      linedata={barchart?.totalMonthlyStatus}
                    />

                    <div className="d-flex justify-content-around ">
                      <h5 className="text-center">
                        Total No, of Projects <br /> {barchart?.totalCount}
                      </h5>
                      <h5 className="text-center">
                        Active Projects <br /> {barchart?.totalActiveCount}
                      </h5>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4 g-3">
            <div className="card  bgwhite">
              <ToDo />
            </div>
          </div>
        </div>
      </div>

      <div className="container p-4">
        <div className="bgwhite p-5 card">
          <div>
            <h5>My Meeting</h5>
          </div>
          {cardView.length > 0 ? (
            <Table striped bordered hover className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Organiser</th>
                  <th>Participants</th>
                </tr>
              </thead>
              <tbody>
                {cardView.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{item.title}</td>
                      <td>{moment(item.start).format("DD-MM-YYYY")}</td>
                      <td>
                        {" "}
                        {moment(item.start).format("LT")} to{" "}
                        {moment(item.end).format("LT")}
                      </td>
                      <td>{item.organiser}</td>
                      <td>
                        <h6>
                          {item.participents.map((person, i) => (
                            <p
                              key={i}
                              className=" badge text-bg-light me-1 mb-0 p-1"
                            >
                              {person.label}
                            </p>
                          ))}
                        </h6>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            "No Sheduled Meetings"
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
