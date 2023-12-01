import React, { useEffect, useState , useContext} from "react";
import {GlobalContext} from "../../GlobalContext"
import MoreDetails from "./MoreDetails";
import { BsChevronUp } from "react-icons/bs";
import { BsChevronDown } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdKeyboardBackspace } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import Table from "react-bootstrap/Table";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Modal, Input } from "antd";
import { TbCurrencyRupee } from "react-icons/tb";
import "../../index.css";
import Select from "react-select";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Paper } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";
import {
  Link as ScrollLink,
  Element,
  Events,
  animateScroll as scroll,
} from "react-scroll";
import { Tabs } from "antd";
import History from "./History";
import Email from "./Email";
import Pdfview from "./Pdfview";
import { toast } from "react-toastify";
import { AsyncPaginate } from "react-select-async-paginate";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const ITEM_HEIGHT = 48;

const leadstatusopt = [
  { value: "Attempted to Contact", label: "Attempted to Contact" },
  { value: "Not Contacted", label: "Not Contacted" },
  { value: "Contact in Future", label: "Contact in Future" },
  { value: "Pending", label: "Pending" },
  { value: "Negotiation/Review", label: "Negotiation/Review" },
  { value: "Sent Agreement", label: "Sent Agreement" },
  { value: "Sent SOW", label: "Sent SOW" },
  { value: "Lost Lead", label: "Lost Lead" },
  { value: "Converted to Deal", label: "Converted to Deal" },
];
const employeelist = [
  { value: "arun", label: "Arun" },
  { value: "kiran", label: "Kiran" },
  { value: "nithin", label: "Nithin" },
  { value: "megha", label: "Megha" },
  { value: "mahima", label: "Mahima" },
];
const followup = [
  { value: "Follow up 1", label: "Follow up 1" },
  { value: "Follow up 2", label: "Follow up 2" },
  { value: "Follow up 3", label: "Follow up 3" },
  { value: "Follow up 4", label: "Follow up 4" },
  { value: "Follow up 5", label: "Follow up 5" },
];

const typeMeeting = [
  { value: "General", label: "General" },
  { value: "Stand up", label: "Stand up" },
  { value: "Team Meeting", label: "Team Meeting" },
  { value: "Others", label: "Others" },
];
const stageOpt = [
  { value: "Advance Payment", label: "Advance Payment" },
  { value: "Full Payment", label: "Full Payment" },
];
const assignopt = [
  { value: "Project Manager", label: "Project Manager" },
  { value: "Sales Executive", label: "Sales Executive" },
];
const leadstageoptions = [
  { value: "New Lead", label: "New Lead" },
  { value: "Qualified", label: "Qualified" },
  { value: "Loss", label: "Loss" },
  { value: "Proposition", label: "Proposition" },
  { value: "Negotiation", label: "Negotiation" },
  { value: "Deal Won", label: "Deal Won" },
];
function LeadDetails() {
  // const userName = useSelector((state) => state.user?.userInfo?.user?.name);
  const data = useContext(GlobalContext);
  const [userName] = data.authApi.userName
  const getempoptions = data.authApi.getempoptions;
  const [openD, setOpenD] = useState(false);
  const [selectedFile, setSelectedFiles] = useState([]);
  const [lead, setLead] = useState([]);
  const [businessname, setBusinessname] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const Navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [selectedlead, setSelectedlead] = useState(null);
  const [selectedleadval, setSelectedleadval] = useState(null);
  const [assignTo, setAssignTo] = useState(null);
  const [followUp, setFollowUp] = useState(null);
  const [fallowUpDate, setFallowUpDate] = useState("");
  const [fallowUpTime, setFallowUpTime] = useState("");
  const [dropopen, setdropopen] = useState(false);
  const [selectedassign, setSelectedassign] = useState([]);
  const [selectedfallow, setSelectedfallow] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [note, setNote] = useState("");
  const [resnotes, setResnotes] = useState("");
  const [status, setStatus] = useState("");
  const [assaignstatus, setAssaignstatus] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState("allInformation");
  const [selectedleadstage, setSelectedleadstage] = useState(null);
  const [selectedstageval, setSelectedstageval] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventError, setEventError] = useState("");

  const [formData, setFormData] = useState({
    amount: 0,
    advance: 0,
    balanceamount: 0,
    projectName: "",
    deadline: "",
    dealclosedby: "",
    paymentstatus: "",
  });
  const [selectedStage, setSelectedStage] = useState("");
  const [gst] = useState(0.18);
  // const [cardView, setCardView] = useState([]);

  const [typemeetOption, setTypemeetOption] = useState(null);
  const [assignOption, setAssignOption] = useState(null);
  const [showEventModal, setShowModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [peopleOption, setPeopleOption] = useState([]);
  const [selectedSalesPersons, setSelectedSalesPersons] = useState([]);
  const [manager, setManger] = useState("");
  const [resManager, setResManger] = useState("");
  const [newEvent, setNewEvent] = useState({
    title: "",
    people: [],
    start: "",
    end: "",
    date: "",
    description: "",
    link: "",
  });

  const modelClose = () => {
    setShowModal(false);
    setAssignModal(false);
    setNewEvent({
      title: "",
      people: [],
      start: "",
      end: "",
      date: "",
      description: "",
      link: "",
    });
    setTypemeetOption(null);
    setPeopleOption([]);
    setEventError("");
    setManger("");
    setSelectedSalesPersons([]);
    setAssignOption("");
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
      paymentstatus: selectedStage.value,
    }));

    setFormData((prevData) => {
      const gstAmount = parseInt(prevData.amount || 0) * gst;
      const totalAmount = parseInt(prevData.amount || 0) + gstAmount;
      const balanceAmount = totalAmount - prevData.advance;
      return { ...prevData, balanceamount: balanceAmount.toString() };
    });
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const menuopen = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewFile = (file) => {
    // Construct the URL for the file you want to view
    const fileURL = `/api/v1/lead/viewFile/${params.id}/${file}`;

    window.open(fileURL, "_blank");
  };
  const downloadFile = async (file) => {
    // Replace with the correct API endpoint
    const downloadUrl = `/api/v1/lead/downloadFile/${file}`;

    axios({
      url: downloadUrl,
      method: "GET",
      responseType: "blob", // Treat the response as a binary blob
    })
      .then((response) => {
        // console.log("download", response);
        const contentType = response.headers["content-type"];
        let extension = "bin"; // Default to "bin" if the extension cannot be determined

        // Check for common file types (you can extend this list)
        if (contentType) {
          if (contentType.includes("pdf")) {
            extension = "pdf";
          } else if (
            contentType.includes("jpeg") ||
            contentType.includes("jpg")
          ) {
            extension = "jpg";
          }
          // Add more conditions for other file types as needed
        }
        // Create a Blob URL for the file content
        const blob = new Blob([response.data]);
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a hidden anchor link to trigger the download
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = blobUrl;
        a.download = `file_${Date.now()}.${extension}`;
        document.body.appendChild(a);

        // Trigger the download
        a.click();

        // Clean up the anchor element and URL
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      })
      .catch((err) => {
        // console.log("Error downloading file:", error);
        toast.error(err?.response?.data?.msg);
      });
  };
  const handeldropopen = () => {
    setdropopen(!dropopen);
  };
  const canceledit = () => {
    setdropopen(!dropopen);
    setSelectedassign([]);
    setAssignTo(null);
    setSelectedfallow(null);
    setFollowUp(null);
    setFallowUpTime("");
    setFallowUpDate("");
  };

  const handelleadselect = async (selectedOption) => {
    const data = {
      status: selectedOption.value,
      createdby: userName,
    };
    const res = await axios
      .put(`/api/v1/lead/updateLeadStatus/${params.id}`, data)
      .then((res) => {
        if (res) {
          toast.success(res?.data?.msg);
          getDetails(params?.id);
        }
      })
      .catch((error) => {
        toast.error("error", error);
      });
  };

  const handelStageselect = async (selectedOption) => {
    const data = {
      leadstage: selectedOption.value,
      createdby: userName,
    };
    const res = await axios
      .put(`/api/v1/lead/updateLeadStage/${params.id}`, data)
      .then((res) => {
        if (res) {
          toast.success(res?.data?.msg);
          getDetails(params?.id);
        }
      })
      .catch((error) => {
        toast.error("error", error);
      });
  };
  const handelassignselect = (selected) => {
    setSelectedassign(selected);
    setAssignTo(selected.label);
  };
  const handelefallowselect = (selected) => {
    setSelectedfallow(selected);
    setFollowUp(selected.value);
  };

  const handlassignoptions = (option) => {
    setAssignOption(option);
  };

  const getDetails = async (id) => {
    setLoading(true);
    let res = await axios
      .get(`/api/v1/lead/getlead/${id}`)
      .then((res) => {
        if (res) {
          setLead(res?.data?.lead);
          setBusinessname(res?.data?.lead?.businessdetails);
          setSelectedFiles(res?.data?.lead.images);
          setResnotes(res?.data?.lead?.notes);
          setStatus(res?.data?.lead?.status);
          setAssaignstatus(res?.data?.lead?.leadstatus);
          setResManger(res?.data?.lead?.projectmanager[0]?.label);
          setLoading(false);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.msg);
        setLoading(false);
      });
  };

  const handelnotes = async () => {
    if (note) {
      try {
        const res = await axios.patch(
          `/api/v1/lead/updateLeadnotes/${params.id}`,
          { newnote: note, createdby: userName }
        );
        if (res) {
          getDetails(params?.id);
          setNote("");
          toast.success(res?.data?.msg);
        }
      } catch (err) {
        toast.error(err?.response?.data?.msg);
      }
    }
  };

  const handleImgChange = async (e) => {
    const selectedFile = e.target.files[0];
    setSelectedImg(selectedFile);
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("createdby", userName);

      try {
     const res =   await axios.patch(
          `/api/v1/lead/updateLeadfile/${params.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        getDetails(params?.id);
        setSelectedImg("");
        toast.success(res?.data?.msg);
      } catch (error) {
        toast.error(error?.response?.data?.msg);
      }
    }
  };
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("createdby", userName);
      try {
       const res =  await axios.patch(
          `/api/v1/lead/updateagrement/${params.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        getDetails(params?.id);
        toast.success(res?.data?.msg);
      } catch (error) {
        toast.error(error?.response?.data?.msg);
      }
    }
  };

  const handleUpdateStatus = async () => {
    const data = {
      fallowUp: followUp,
      assignTo: assignTo,
      createdby: userName,
      fallowUpTime: fallowUpTime,
      fallowUpDate: fallowUpDate,
    };

    await axios
      .put(`/api/v1/lead/leadfallowup/${params.id}`, data)
      .then((res) => {
        if (res) {
          getDetails(params?.id);
          setSelectedassign([]);
          setAssignTo(null);
          setSelectedfallow(null);
          setFollowUp(null);
          setdropopen(!dropopen);
          setFallowUpTime("");
          setFallowUpDate("");
          toast.success(res?.data?.msg);
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.msg);
      });
  };

  useEffect(() => {
    getDetails(params?.id);
  }, []);

  const back = () => {
    Navigate(`/leads`);
  };

  const handleclick = () => {
    setOpenD(!openD);
  };

  const handelDelete = async (index) => {
    if (index) {
      try {
        const res = await axios.delete(
          `/api/v1/lead/updateLead/${params.id}/${index}`
        );
        getDetails(params?.id);
        toast.success("deleted successfully");
      } catch (error) {        
        toast.error(error?.response?.data?.msg);
      }
    }
  };

  const showModal = () => {
    setOpen(true);
  };
  const showAssignModal = () => {
    setAssignModal(true);
  };
  const handleOk = (e) => {
    // e.preventdefault()
    const payload = {
      ...lead,
      ...formData,
    };
    const res = axios
      .post(`/api/v1/deal/createdeal`, payload)
      .then((res) => {
        if (res) {
          setFormData({
            amount: 0,
            advance: 0,
            balanceamount: 0,
            projectName: "",
            deadline: "",
            dealclosedby: "",
            paymentstatus: "",
          });
          setSelectedStage("");
          Navigate(`/deals`);
        }
      })
      .catch((err) => toast.error(err?.response?.data?.msg));
  };
  const handleCancel = () => {
    setOpen(false);
    setFormData({
      amount: 0,
      advance: 0,
      balanceamount: 0,
      projectName: "",
      deadline: "",
      dealclosedby: "",
      paymentstatus: "",
    });
    setSelectedStage("");
  };

  const handlePeopleChange = (selectedOptions) => {
    const people = selectedOptions.map((option) => option.label);
    setNewEvent({
      ...newEvent,
      people,
    });
  };
  const handlesalesempChange = (e) => {
    setSelectedSalesPersons(e);
    setManger("");
  };

  const handleAssign = async () => {
    setLoading(true);
    if (selectedSalesPersons.length > 0) {
      const data = {
        assignees: selectedSalesPersons,
        createdby: userName,
      };
      await axios
        .put(`/api/v1/lead/updateLeadAssignee/${params.id}`, data)
        .then((res) => {
          if (res) {
            getDetails(params?.id);
            setAssignModal(false);
            setManger("");
            setSelectedSalesPersons([]);
            setAssignOption("");
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error?.response?.data?.msg);
        });
    } else if (manager !== "") {
      const data = {
        manager: manager,
        createdby: userName,
      };
      await axios
        .put(`/api/v1/lead/updateLeadManager/${params.id}`, data)
        .then((res) => {
          if (res) {
            getDetails(params?.id);
            setAssignModal(false);
            setManger("");
            setSelectedSalesPersons([]);
            setAssignOption("");
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.msg);
        });
    }
  };
  const handlmangerChange = (e) => {
    setManger(e);
    setSelectedSalesPersons([]);
  };
  const handlMeetingChange = (selectedOptions) => {
    const title = selectedOptions.value;
    setTypemeetOption(selectedOptions);
    setNewEvent({
      ...newEvent,
      title,
    });
  };
  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  const isDataValid = () => {
    return (
      newEvent.title &&
      newEvent.people &&
      newEvent.date &&
      newEvent.start &&
      newEvent.end &&
      newEvent.link
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDataValid()) {
      return setEventError("All fields are required");
    } else {
      const startTime = new Date(`${newEvent.date}T${newEvent.start}:00`);
      const endTime = new Date(`${newEvent.date}T${newEvent.end}:00`);
      const data = {
        organiser: userName,
        meetingtype: newEvent.title,
        start: startTime,
        end: endTime,
        participants: newEvent.people,
        subject: newEvent.description,
        meetlink: newEvent.link,
      };
      const res = await axios
        .patch(`/api/v1/lead/shedulemeeting/${params.id}`, data)
        .then((res) => {
          // console.log(res);
          setNewEvent({
            title: "",
            people: [],
            start: "",
            end: "",
            description: "",
            link: "",
          });
          setShowModal(false);
          getDetails(params.id);
          setTypemeetOption(null);
          setPeopleOption([]);
          setEventError("");
        })
        .catch((err) => toast.error(err?.response?.data?.msg));
    }
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
      toast.error(error.response.data.msg);
      return {
        options: [],
        hasMore: false,
      };
    }
  };
  const antIcon = <LoadingOutlined className="loadingIcon" spin />;
  return (
    <div className="main">
      <div className="loadersCss">
        <Spin indicator={antIcon} spinning={loading}></Spin>
      </div>
      <div className="p-3">
        <div className="pt-3 pb-3 m-3 d-flex justify-content-between">
          <button className="ps-3 btn btn-outline-secondary" onClick={back}>
            {" "}
            <MdKeyboardBackspace /> Lead Information
          </button>
          <div className="d-flex">
            <button
              className="btn btn-outline-primary me-2"
              onClick={showAssignModal}
            >
              Assign
            </button>
            <button className="btn btn-primary me-2" onClick={showModal}>
              Convert
            </button>
          </div>
        </div>
        <div className="row m-3 justify-content-between">
          <div className="col-3 g-3">
            <div className="p-3 bgwhite">
              <div className="d-flex flex-column">
                {/* <button className="btn btn-primary m-1">ALL Information</button> */}
                <ScrollLink
                  to="allInformation"
                  smooth={true}
                  // activeClass="active"
                  className={`btn btn-primary m-1 ${
                    activeTab === "allInformation" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("allInformation")}
                >
                  All Information
                </ScrollLink>
                <ScrollLink
                  to="notes"
                  smooth={true}
                  // activeClass="active"
                  className={`btn btn-primary m-1 ${
                    activeTab === "notes" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("notes")}
                >
                  Notes
                </ScrollLink>
                <ScrollLink
                  to="attachments"
                  smooth={true}
                  // activeClass="active"
                  className={`btn btn-primary m-1 ${
                    activeTab === "attachments" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("attachments")}
                >
                  Attachments
                </ScrollLink>

                <ScrollLink
                  to="emails"
                  smooth={true}
                  // activeClass="active"
                  className={`btn btn-primary m-1 ${
                    activeTab === "emails" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("emails")}
                >
                  Emails
                </ScrollLink>

                <ScrollLink
                  to="invitedMeetings"
                  smooth={true}
                  // activeClass="active"
                  className={`btn btn-primary m-1 ${
                    activeTab === "invitedMeetings" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("invitedMeetings")}
                >
                  Invited Meetings
                </ScrollLink>
                <ScrollLink
                  to="agreement"
                  smooth={true}
                  // activeClass="active"
                  className={`btn btn-primary m-1 ${
                    activeTab === "agreement" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("agreement")}
                >
                  Agreement
                </ScrollLink>
              </div>
            </div>
          </div>
          <div className="col-9 g-3 bgwhite">
            <Tabs defaultActiveKey="1">
              <TabPane tab="Overview" key="1">
                <Element name="allInformation">
                  <div>
                    <div>
                      <div className="ms-3">
                        <div className="d-flex p-3">
                          <h5> Business Name * {businessname}</h5>
                        </div>
                        <div class="mb-3 row">
                          <label class="col-sm-2 col-form-label">Title</label>
                          <div class="col-md-6">
                            <input
                              type="text"
                              value={lead.leadname}
                              readOnly
                              class="form-control"
                              placeholder="N/A"
                            />
                          </div>
                        </div>
                        <div class="mb-3 row">
                          <label class="col-sm-2 col-form-label">
                            Project Manager
                          </label>
                          <div class="col-md-6">
                            <input
                              type="text"
                              readOnly
                              value={resManager}
                              class="form-control"
                              placeholder="Not Assigned"
                            />                            
                          </div>
                        </div>
                        <div class="mb-3 row">
                          <label class="col-sm-2 col-form-label">
                            Lead Assig To
                          </label>
                          <div class="col-md-6 d-flex justify-content-start">
                            {lead?.assignees?.length > 0 ? (
                              <AvatarGroup max={5}>
                                {lead?.assignees?.map((item, i) => {
                                  return (
                                    <Tooltip title={item?.value}>
                                      <Avatar
                                        alt={item.label}
                                        src="/static/images/avatar/1.jpg"
                                      />
                                    </Tooltip>
                                  );
                                })}
                              </AvatarGroup>
                            ) : (
                              <div class="col">
                                <input
                                  type="text"
                                  value={"Not Assigned"}
                                  readonly
                                  class="form-control"
                                  placeholder="Not Assigned"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div class="mb-3 row d-flex align-items-center">
                          <label class="col-sm-2 col-form-label">
                            Lead Stage
                          </label>
                          <div class="col-md-6">
                            <Select
                              onChange={(e) => handelStageselect(e)}
                              options={leadstageoptions}
                              className="reactselect"
                              value={leadstageoptions.find(
                                (option) => option.value === lead.leadstage
                              )}
                            />
                          </div>
                        </div>

                        <div class="mb-3 row d-flex align-items-center">
                          <label class="col-sm-2 col-form-label">
                            Lead Status
                          </label>
                          <div class="col-md-6 ">
                            <Select
                              onChange={(e) => handelleadselect(e)}
                              options={leadstatusopt}
                              className="reactselect"
                              value={leadstatusopt.find(
                                (option) => option.value === status
                              )}
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-8">
                            <span
                              className="d-flex justify-content-end "
                              onClick={handeldropopen}
                            >
                              <div className="btn btn-primary align-items-center mb-1">
                                <FiEdit /> Assign Fallowup
                              </div>
                            </span>
                          </div>
                        </div>

                        {dropopen ? (
                          <div className="">
                            <div class="mb-3 row">
                              <label class="col-sm-2 col-form-label">
                                Follow Up
                              </label>
                              <div class="col-md-6">
                                <Select
                                  value={selectedfallow}
                                  onChange={handelefallowselect}
                                  options={followup}
                                  className="reactselect"
                                />
                              </div>
                            </div>
                            <div class="mb-3 row">
                              <label class="col-sm-2 col-form-label">
                                Assain To
                              </label>
                              <div class="col-md-6">
                                {/* <Select
                                  defaultValue={selectedassign}
                                  onChange={handelassignselect}
                                  options={employeelist}
                                  className="reactselect"
                                /> */}
                                <AsyncPaginate
                                  loadOptions={loadEmpOptions}
                                  additional={{
                                    page: 1,
                                  }}
                                  name="colors"
                                  isMulti={false}
                                  isSearchable={true}
                                  // isClearable={true}
                                  classNamePrefix="select"
                                  className="dist-form-values"
                                  // onChange={handlePeopleChange}
                                  defaultValue={selectedassign}
                                  onChange={handelassignselect}
                                />
                              </div>
                            </div>
                            <div class="mb-3 row">
                              <label class="col-sm-2 col-form-label">
                                FollowUp Date
                              </label>
                              <div class="col-md-6">
                                <Input
                                  placeholder="default size"
                                  type="date"
                                  min={new Date().toISOString().split("T")[0]}
                                  value={fallowUpDate}
                                  onChange={(e) =>
                                    setFallowUpDate(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div class="mb-3 row">
                              <label class="col-sm-2 col-form-label">
                                FollowUp Time
                              </label>
                              <div class="col-md-6">
                                <input
                                  type="time"
                                  value={fallowUpTime}
                                  className="form-control"
                                  onChange={(e) =>
                                    setFallowUpTime(e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="row mb-3">
                              <div className="col-8">
                                <div className="d-flex justify-content-end">
                                  <button
                                    className="btn btn-primary me-3"
                                    onClick={handleUpdateStatus}
                                    disabled={
                                      !selectedassign ||
                                      !selectedfallow ||
                                      !fallowUpDate ||
                                      !fallowUpTime
                                    }
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="btn btn-warning"
                                    onClick={canceledit}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null}
                        {assaignstatus.length > 0 ? (
                          <div className="row">
                            <div className="col-2"></div>
                            <div className="col-8">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th>Task</th>
                                    <th> Assigned Date</th>
                                    <th>Assigned To</th>
                                    <th> FollowUp Date</th>
                                    <th> FollowUp Time</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {assaignstatus.map((item, index) => {
                                    return (
                                      <tr key={index}>
                                        <td>{item.fallowUp}</td>
                                        <td>
                                          {moment(item.timestamp).format(
                                            "DD/MM/YYYY"
                                          )}
                                        </td>
                                        <td>{item.assignTo}</td>
                                        <td>{item.fallowUpDate}</td>
                                        <td>
                                          {moment(
                                            item.fallowUpTime,
                                            "hh:mm a"
                                          ).format("hh:mm a")}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div>
                        <button
                          className="btn text-primary"
                          onClick={handleclick}
                        >
                          More Details{" "}
                          <span className="ps-3">
                            {!openD ? (
                              <BsChevronDown style={{ color: "black" }} />
                            ) : (
                              <BsChevronUp style={{ color: "black" }} />
                            )}
                          </span>
                        </button>
                        {openD && <MoreDetails lead={lead} />}
                      </div>
                      <div className="row">
                        <Modal
                          title="Creating a new Deal for this account"
                          open={open}
                          onOk={handleOk}
                          confirmLoading={confirmLoading}
                          onCancel={handleCancel}
                          okText="Convert"
                        >
                          <div>
                            <div className="row p-2">
                              <div className="col-3">
                                <p>Amount</p>
                              </div>
                              <div className="col-9">
                                <Input
                                  type="number"
                                  placeholder="default size"
                                  value={
                                    formData.amount === 0 ? "" : formData.amount
                                  }
                                  onChange={(e) =>
                                    handleInputChange(e, "amount")
                                  }
                                  prefix={<TbCurrencyRupee />}
                                />
                              </div>
                            </div>
                            <div className="row p-2">
                              <div className="col-3">
                                <p>Advance</p>
                              </div>
                              <div className="col-9">
                                <Input
                                  placeholder="default size"
                                  value={
                                    formData.advance === 0
                                      ? ""
                                      : formData.advance
                                  }
                                  onChange={(e) =>
                                    handleInputChange(e, "advance")
                                  }
                                  prefix={<TbCurrencyRupee />}
                                />
                              </div>
                            </div>

                            <div className="row p-2">
                              <div className="col-3">
                                <p>Balance</p>
                              </div>
                              <div className="col-9">
                                <Input
                                  placeholder="default size"
                                  value={
                                    formData.balanceamount === 0
                                      ? ""
                                      : formData.balanceamount
                                  }
                                  readOnly
                                  prefix={<TbCurrencyRupee />}
                                />
                                <span className="snall">
                                  Note: Balance Including 18% gst
                                </span>
                              </div>
                            </div>

                            <div className="row p-2">
                              <div className="col-3">
                                <p>Project Name</p>
                              </div>
                              <div className="col-9">
                                <Input
                                  placeholder="default size"
                                  type="text"
                                  value={formData.projectName}
                                  onChange={(e) =>
                                    handleInputChange(e, "projectName")
                                  }
                                />
                              </div>
                            </div>
                            <div className="row p-2">
                              <div className="col-3">
                                <p>Deadline</p>
                              </div>
                              <div className="col-9">
                                <Input
                                  placeholder="default size"
                                  type="date"
                                  min={new Date().toISOString().split("T")[0]}
                                  value={formData.deadline}
                                  onChange={(e) =>
                                    handleInputChange(e, "deadline")
                                  }
                                />
                              </div>
                            </div>
                            <div className="row p-2">
                              <div className="col-3">
                                <p>Deal Colsed By</p>
                              </div>
                              <div className="col-9">
                                <Input
                                  placeholder="default size"
                                  type="text"
                                  value={formData.dealclosedby}
                                  onChange={(e) =>
                                    handleInputChange(e, "dealclosedby")
                                  }
                                />
                              </div>
                            </div>
                            <div className="row p-2">
                              <div className="col-3">
                                <p>Payment Stage</p>
                              </div>
                              <div className="col-9">
                                <Select
                                  defaultValue="lucy"
                                  style={{ width: 120 }}
                                  value={selectedStage}
                                  options={stageOpt}
                                  onChange={(value) => setSelectedStage(value)}
                                />
                              </div>
                            </div>
                          </div>
                        </Modal>
                      </div>
                    </div>
                  </div>
                </Element>

                <Element name="notes">
                  <div className="col-12 p-3">
                    <div className="">
                      <h4>Notes</h4>
                      <div class="d-flex align-items-center justify-content-between">
                        <div className="col-8">
                          <textarea
                            class="form-control"
                            placeholder="Add a Note"
                            value={note}
                            onChange={(e) => {
                              setNote(e.target.value);
                            }}
                          ></textarea>
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={handelnotes}
                        >
                          Add Notes
                        </button>
                      </div>
                    </div>

                    <div className="container">
                      {resnotes.length > 0 ? (
                        <div className="p-5">
                          <Table>
                            <thead className="thead-success">
                              <tr>
                                <th>No</th>
                                <th>Added By</th>
                                <th>date</th>
                                <th>Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {resnotes.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{"Name"}</td>
                                    <td>
                                      {moment(item.timestamp).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </td>
                                    <td>{item.note}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>{" "}
                        </div>
                      ) : (
                        <p className="py-2">No Notes Added</p>
                      )}
                    </div>
                  </div>
                </Element>

                <Element name="attachments">
                  <div className="row">
                    <div className="col-12 p-3">
                      <div className="d-flex justify-content-between">
                        <h4>Attachments</h4>
                        <div>
                          <input
                            type="file"
                            id="file"
                            onChange={handleImgChange}
                            style={{ display: "none" }}
                            accept="image/jpeg,image/png,application/pdf"
                          />
                          <label htmlFor="file" className="btn btn-primary">
                            <span className="pe-2">
                              <div
                                style={{
                                  color: "white",
                                  display: "inline-block",
                                }}
                              >
                                <ImAttachment />
                              </div>
                            </span>
                            Attach File
                          </label>
                        </div>
                      </div>
                      {selectedFile.length > 0 ? (
                        <div className="p-5">
                          <Table>
                            <thead className="thead-success">
                              <tr>
                                <th>No</th>
                                <th>File Name</th>
                                <th>Attached By</th>
                                <th>Date Attached</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedFile.map((file, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{file.filename}</td>
                                    <td>{"Name"}</td>
                                    <td>
                                      {moment(file.timestamp).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </td>
                                    <td>
                                      <div>
                                        <IconButton
                                          aria-label="more"
                                          id="long-button"
                                          aria-controls={
                                            menuopen ? "long-menu" : undefined
                                          }
                                          aria-expanded={
                                            menuopen ? "true" : undefined
                                          }
                                          aria-haspopup="true"
                                          onClick={handleMenuClick}
                                        >
                                          <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                          id="long-menu"
                                          MenuListProps={{
                                            "aria-labelledby": "long-button",
                                          }}
                                          anchorEl={anchorEl}
                                          open={menuopen}
                                          onClose={handleMenuClose}
                                          PaperComponent={({ children }) => (
                                            <Paper
                                              style={{
                                                maxHeight: ITEM_HEIGHT * 4.5,
                                                width: "100px",
                                              }}
                                            >
                                              {children}
                                            </Paper>
                                          )}
                                        >
                                          <MenuItem
                                            onClick={() => {
                                              handleMenuClose();
                                              handleViewFile(file.filename);
                                            }}
                                          >
                                            {"View"}
                                          </MenuItem>
                                          <MenuItem
                                            onClick={() => {
                                              handleMenuClose();
                                              downloadFile(file.filename);
                                            }}
                                          >
                                            {"Download"}
                                          </MenuItem>
                                          <MenuItem
                                            // onClick={handleMenuClose}
                                            style={{ color: "red" }}
                                            onClick={() => {
                                              handleMenuClose();
                                              handelDelete(file.filename);
                                            }}
                                          >
                                            {"Delete"}
                                          </MenuItem>
                                        </Menu>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>{" "}
                        </div>
                      ) : (
                        <p>No Attachments</p>
                      )}
                    </div>
                  </div>
                </Element>

                <Element name="emails">
                  <div className="row card">
                    <div className="col-12 p-3">
                      <div className="d-flex justify-content-between">
                        <h4>Emails</h4>
                        <button
                          className="btn btn-primary"
                          onClick={toggleModal}
                        >
                          Compose Email
                        </button>
                      </div>
                      <Email
                        visible={modalVisible}
                        toggleModal={toggleModal}
                        id={params.id}
                        getDetails={getDetails}
                      />

                      <div className="container">
                        {lead.emails?.length > 0 ? (
                          <div className="p-5">
                            <Table>
                              <thead className="thead-success">
                                <tr>
                                  <th>No</th>
                                  <th>Send By</th>
                                  <th>date</th>
                                  <th style={{ maxWidth: "20%" }}>Content</th>
                                  <th>Sent To</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lead?.emails.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{item?.sentby}</td>
                                      <td>
                                        {moment(item?.timestamp).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </td>
                                      <td>{item?.content}</td>
                                      <td>{item?.to}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </Table>{" "}
                          </div>
                        ) : (
                          <p className="py-2">No Emails Sent</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Element>

                <Element name="invitedMeetings">
                  <div className="row">
                    <div className="col-12 p-3">
                      <div className="d-flex justify-content-between">
                        <h4>Invited Meetings</h4>
                        <button
                          className="btn btn-primary"
                          onClick={() => setShowModal(true)}
                        >
                          Shedule Meet
                        </button>
                      </div>
                      <div className="container">
                        {lead.meetings?.length > 0 ? (
                          <div className="p-5">
                            <Table>
                              <thead className="thead-success">
                                <tr>
                                  <th>No</th>
                                  <th>Organiser</th>
                                  <th>Meeting Date & Time</th>
                                  <th>Subject</th>
                                  <th>Participants</th>
                                  <th>Meet Link</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lead?.meetings.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{item?.organiser}</td>
                                      <td>
                                        {moment(item?.start).format(
                                          "DD/MM/YYYY, h:mm:ss a"
                                        )}
                                      </td>
                                      <td>{item?.subject}</td>
                                      <td className="d-flex">
                                        {item?.participants.map((name, i) => {
                                          return <p>{name}, &nbsp;</p>;
                                        })}
                                      </td>
                                      <td>
                                        <a
                                          href={item?.meetlink}
                                          target="_blank"
                                        >
                                          {"Link"}
                                        </a>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </Table>{" "}
                          </div>
                        ) : (
                          <p className="py-2">No Meetings Sheduled</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Element>

                <Element name="agreement">
                  <div className="d-flex justify-content-between">
                    <h4 className="p-3">Agreement</h4>

                    <div>
                      <input
                        type="file"
                        id="agreement"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        accept="application/pdf"
                      />
                      <label htmlFor="agreement" className="btn btn-primary">
                        <span className="pe-2">
                          <div
                            style={{
                              color: "white",
                              display: "inline-block",
                            }}
                          >
                            <ImAttachment />
                          </div>
                        </span>
                        {lead.agreement
                          ? "ReUpload Agreement"
                          : "Attach Agreement"}
                      </label>
                    </div>
                  </div>
                  <Pdfview  id={params.id} lead={lead} getDetails={getDetails} />
                </Element>
              </TabPane>
              <TabPane tab="History" key="2">
                <History history={lead.history} />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
      <Modal
        title="Create Event"
        open={showEventModal}
        onOk={handleSubmit}
        onCancel={modelClose}
        okText="Create"
        disabled={!isDataValid()}
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
              <p>Add Peoples</p>
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
          <div className="row p-2">
            <div className="col-3">
              <p>Meeting Link</p>
            </div>
            <div className="col-9">
              <Input
                placeholder="Description...."
                type="text"
                name="link"
                value={newEvent.link}
                onChange={handleNewEventChange}
              />
            </div>
          </div>
          {eventError && (
            <span className="alert alert-danger p-1" role="alert">
              {eventError}
            </span>
          )}
        </div>
      </Modal>
      <Modal
        title="Assign To"
        open={assignModal}
        onOk={handleAssign}
        onCancel={modelClose}
        okText="Assign"
        // disabled={!isDataValid()}
      >
        <div>
          <div className="row p-2">
            <div className="col-3">
              <p>Assign</p>
            </div>
            <div className="col-9">
              <Select
                placeholder="Select Type"
                options={assignopt}
                onChange={handlassignoptions}
                value={assignOption}
              />
            </div>
          </div>
          {assignOption?.value === "Project Manager" && (
            <div>
              <div className="row p-2">
                <div className="col-3">
                  <p>Project Manager</p>
                </div>
                <div className="col-9">
                  <AsyncPaginate
                    loadOptions={loadEmpOptions}
                    additional={{
                      page: 1,
                    }}
                    name="colors"
                    isMulti={false}
                    isSearchable={true}
                    isClearable={false}
                    classNamePrefix="select"
                    className="dist-form-values"
                    onChange={handlmangerChange}
                  />
                </div>
              </div>
            </div>
          )}
          {assignOption?.value === "Sales Executive" && (
            <div>
              <div className="row p-2">
                <div className="col-3">
                  <p>Sales Executive</p>
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
                    onChange={handlesalesempChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default LeadDetails;
