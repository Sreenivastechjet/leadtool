import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../GlobalContext";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "./meeting.css";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button, Modal, Input } from "antd";
import Select from "react-select";
// import { getempoptions } from "../Api/AuthApi";
import { AsyncPaginate } from "react-select-async-paginate";
import { toast } from "react-toastify";
// import { useSelector } from "react-redux";

// const employeelist = [
//   { value: "arun", label: "Arun" },
//   { value: "kiran", label: "Kiran" },
//   { value: "nithin", label: "Nithin" },
//   { value: "megha", label: "Megha" },
//   { value: "mahima", label: "Mahima" },
// ];
const typeMeeting = [
  { value: "General", label: "General" },
  { value: "Stand up", label: "Stand up" },
  { value: "Team Meeting", label: "Team Meeting" },
  { value: "Others", label: "Others" },
];

function Meeting() {
  const data = useContext(GlobalContext);
  const [userEmail] = data?.authApi?.userEmail;
  const [userName] = data?.authApi?.userName;
  // console.log("emailknbgvvfvfvg", userEmail);
  const getempoptions = data.authApi.getempoptions;
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([]);
  const [cardView, setCardView] = useState([]);
  const [showEventModal, setShowModal] = useState(false);
  const [typemeetOption, setTypemeetOption] = useState(null);
  const [peopleOption, setPeopleOption] = useState([]);
  // const organiser = useSelector((state) => state.user.userInfo?.user?.name);
  // const email = useSelector((state) => state.user.userInfo?.user?.email);
  const [newEvent, setNewEvent] = useState({
    title: "",
    people: [],
    start: "",
    end: "",
    date: "",
    description: "",
  });

  const [selectedEvent, setSelectedEvent] = useState(undefined);
  const [modalState, setModalState] = useState(false);

  const modelClose = () => {
    setModalState(false);
    setShowModal(false);
    setNewEvent({
      title: "",
      people: [],
      start: "",
      end: "",
      date: "",
      description: "",
    });
    setTypemeetOption(null);
    setPeopleOption([]);
  };

  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };
  const handlePeopleChange = (e) => {
    const people = e;
    setNewEvent({
      ...newEvent,
      people,
    });
  };
  const handlMeetingChange = (selectedOptions) => {
    const title = selectedOptions.value;
    setTypemeetOption(selectedOptions);
    setNewEvent({
      ...newEvent,
      title,
    });
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const startTime = new Date(`${newEvent.date}T${newEvent.start}:00`);
    const endTime = new Date(`${newEvent.date}T${newEvent.end}:00`);
    const data = {
      organiser: userName,
      title: newEvent.title,
      start: startTime,
      end: endTime,
      participents: newEvent.people,
      description: newEvent.description,
    };
    // console.log("meeting", data);
    const res = await axios
      .post("/api/v1/event/cratemeeting", data)
      .then((res) => {
        // console.log(res);
        setNewEvent({
          title: "",
          people: [],
          start: "",
          end: "",
          description: "",
        });
        geteventdata();
        setShowModal(false);
        setTypemeetOption(null);
        setPeopleOption([]);
        getupcomingmeetings();
      })
      .catch((err) => toast.error(err?.response?.data?.msg)
      );
  };

  const geteventdata = async () => {
    const res = await axios
      .post(`/api/v1/event/getallmeetings/${userEmail}`)
      .then((response) => {
        const eventsData = response?.data.map((event) => ({
          id: event._id,
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
          allDay: event.allDay,
          description: event.description,
          organiser: event.organiser,
          participents: event.participents,
        }));

        setEvents(eventsData);
      })
      .catch((err) => toast.error(err?.response?.data?.msg));
  };
  const getupcomingmeetings = async () => {
    const res = await axios
      .post(`/api/v1/event/getupcomingmeetings/${userEmail}`)
      .then((response) => {
        setCardView(response.data);
      })
      .catch((err) => toast.error(err?.response?.data?.msg));
  };
  useEffect(() => {
    geteventdata();
  }, [userEmail]);
  useEffect(() => {
    getupcomingmeetings();
  }, [userEmail]);

  const handleSelectedEvent = (event) => {
    // console.log("first", event);
    setSelectedEvent(event);
    setModalState(true);
  };

  return (
    <div className="main">
      <div className="container" style={{ height: "90vh" }}>
        <div className="row">
          <div className="col-8 container">
            <div className="mt-5 p-5 bgwhite">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                // onSelectSlot={(e) => handleSelect(e)}
                onSelectEvent={(e) => handleSelectedEvent(e)}
              />
            </div>
          </div>
          <div className="col-4 pt-5">
            <div className="d-flex justify-content-between p-2 bgwhite">
              <h6 className="">Meeting</h6>
              {/* <p>View All</p> */}
            </div>
            <div
              className="container  bgwhite position-relative"
              style={{
                maxHeight: "74vh",
                minHeight: "74vh",
                overflowY: "auto",
              }}
            >
              <div className="">
                {cardView.map((item, index) => {
                  return (
                    <div className="d-flex justify-content-center" key={index}>
                      <div
                        class="card mb-2"
                        style={{ width: "20rem", borderLeft: "5px solid pink" }}
                      >
                        <div class="card-body pb-0">
                          <div className="row">
                            <div className="col-4">
                              <h5 class="card-title">Title : </h5>
                            </div>
                            <div className="col-8">
                              <h6>{item.title}</h6>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-4">
                              <h6 class="card-title">Date : </h6>
                            </div>
                            <div className="col-8">
                              <h6>
                                {" "}
                                {moment(item.start).format("DD-MM-YYYY")}
                              </h6>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-4">
                              <h6 class="card-title">Timings : </h6>
                            </div>
                            <div className="col-8">
                              <h6>
                                {" "}
                                {moment(item.start).format("LT")} to{" "}
                                {moment(item.end).format("LT")}
                              </h6>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-4">
                              <h6 class="card-title">Organiser : </h6>
                            </div>
                            <div className="col-8">
                              <h6>{item.organiser}</h6>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-4">
                              <h6 class="card-title">Participants : </h6>
                            </div>
                            <div className="col-8">
                              <h6>
                                {item.participents.map((person, i) => (
                                  <p
                                    key={i}
                                    className=" badge text-bg-info me-1 mb-0 p-1"
                                  >
                                    {person.label}
                                  </p>
                                ))}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="addmeeting">
                <button className="addbtn" onClick={() => setShowModal(true)}>
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Create Event"
        open={showEventModal}
        onOk={handleSubmit}
        onCancel={modelClose}
        okText="Create"
      >
        <div>
          <div className="row p-2">
            <div className="col-3">
              <p>Meeting Type</p>
            </div>
            <div className="col-9">
              <Select
                placeholder="Select Type"
                options={typeMeeting}
                onChange={handlMeetingChange}
                defaultValue={typemeetOption}
              />
            </div>
          </div>
          <div className="row p-2">
            <div className="col-3">
              <p>Add Participants</p>
            </div>
            <div className="col-9">
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
            </div>
          </div>
          <div className="row p-2">
            <div className="col-3">
              <p>Date</p>
            </div>
            <div className="col-9">
              <Input
                placeholder="End"
                type="date"
                name="date"
                min={new Date().toISOString().split("T")[0]}
                value={newEvent.date}
                onChange={handleNewEventChange}
              />
            </div>
          </div>

          <div className="row p-2">
            <div className="col-3">
              <p>Start Time</p>
            </div>
            <div className="col-9">
              <Input
                placeholder="Start"
                type="time"
                name="start"
                format="HH:mm"
                value={newEvent.start}
                onChange={handleNewEventChange}
              />
            </div>
          </div>
          <div className="row p-2">
            <div className="col-3">
              <p>End Time</p>
            </div>
            <div className="col-9">
              <Input
                placeholder="End"
                type="time"
                name="end"
                format="HH:mm"
                value={newEvent.end}
                onChange={handleNewEventChange}
              />
            </div>
          </div>
          <div className="row p-2">
            <div className="col-3">
              <p>Description</p>
            </div>
            <div className="col-9">
              <Input
                placeholder="Description...."
                type="text"
                name="description"
                value={newEvent.description}
                onChange={handleNewEventChange}
              />
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="Event"
        open={modalState}
        onCancel={modelClose}
        footer={null}
      >
        <div class="card mb-2" style={{ width: "100%" }}>
          <div class="card-body pb-0">
            <div className="row">
              <div className="col-4">
                <h6 class="card-title">Title : </h6>
              </div>
              <div className="col-8">
                <h5>{selectedEvent?.title}</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <h6 class="card-title">Date : </h6>
              </div>
              <div className="col-8">
                <h5> {moment(selectedEvent?.start).format("DD-MM-YYYY")}</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <h6 class="card-title">Timings : </h6>
              </div>
              <div className="col-8">
                <h5>
                  {" "}
                  {moment(selectedEvent?.start).format("LT")} to{" "}
                  {moment(selectedEvent?.end).format("LT")}
                </h5>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <h6 class="card-title">Organiser : </h6>
              </div>
              <div className="col-8">
                <h5>{selectedEvent?.organiser}</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <h6 class="card-title">Participants : </h6>
              </div>
              <div className="col-8">
                <h5>
                  {selectedEvent?.participents?.map((person, i) => (
                    <p key={i} className=" badge text-bg-info me-1 mb-0 p-1">
                      {person?.label}
                    </p>
                  ))}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default Meeting;
