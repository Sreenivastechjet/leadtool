import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
// import pdfFile from "../images/sample.pdf";
import { pdfjs } from "react-pdf";
import { Modal, Input } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function Pdfview({ id, lead, getDetails }) {
  // console.log("first>>>", lead , id)
  const [showEventModal, setShowModal] = useState(false);
  const [invite, setInvite] = useState({
    name: "",
    email: "",
    number: "",
  });
  const [eventError, setEventError] = useState("");

  // console.log("agreement", lead.agreement);
  useEffect(() => {
    setInvite({
      name: lead?.leadname,
      email: lead?.email,
      number: lead?.number,
    });
  }, [lead]);

  const fileURL = `/api/v1/lead/viewFile/${id}/${lead.agreement}`;
  const imgUrl = `/api/v1/lead/viewFile/${id}/${lead.signature}`;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
    }
  };

  const renderPagination = () => {
    const pageButtons = [];
    const maxButtons = 5; // Maximum number of buttons to show
    const middleButton = Math.ceil(maxButtons / 2);

    if (numPages <= maxButtons) {
      for (let i = 1; i <= numPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={i === pageNumber ? "active1 m-1 p-1 btn" : "m-1 p-1 btn"}
          >
            {i}
          </button>
        );
      }
    } else {
      // Display first two pages
      for (let i = 1; i <= 3; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={i === pageNumber ? "active1 m-1 p-1 btn" : "m-1 p-1 btn"}
          >
            {i}
          </button>
        );
      }

      // Display ellipsis
      pageButtons.push(<span key="ellipsis">...</span>);

      // Display last two pages
      for (let i = numPages - 1; i <= numPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={i === pageNumber ? "active1 m-1 p-1 btn" : "m-1 p-1 btn"}
          >
            {i}
          </button>
        );
      }
    }

    return pageButtons;
  };

  const isDataValid = () => {
    return invite.name && invite.email && invite.number;
  };

  const modelClose = () => {
    setShowModal(false);
    setInvite({
      name: "",
      email: "",
      number: "",
    });
  };

  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    setInvite({
      ...invite,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDataValid()) {
      return setEventError("All fields are required");
    } else {
      setEventError("");
      const data = {
        createdby: "Sree",
        name: invite.name,
        email: invite.email,
        number: invite.number,
        pdfLink: lead.agreement,
      };
      // console.log("first",data)
      await axios
        .post(`/api/v1/lead/sendVerificationMailLink/${id}`, data)
        .then((res) => {
          if (res) {
            toast.success(res?.data?.msg);
            setShowModal(false);
            getDetails(id);
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
        });
    }
  };

  return (
    <>
      {lead.agreement != undefined ? (
        <div className="row">
          <div className="col-8">
            <div className="">
              <Document
                file={fileURL}
                onLoadSuccess={onDocumentLoadSuccess}
                style={{ width: "100%" }}
              >
                <Page pageNumber={pageNumber} className="border border-gray" />
              </Document>

              <div className="d-flex justify-content-center m-1">
                <button
                  onClick={() => goToPage(Math.max(pageNumber - 1, 1))}
                  disabled={pageNumber <= 1}
                  className="btn btn-primary"
                >
                  Previous
                </button>
                {renderPagination()}
                <button
                  onClick={() => goToPage(Math.min(pageNumber + 1, numPages))}
                  disabled={pageNumber >= numPages}
                  className="btn btn-primary"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="col-4 p-3">
            {
              // console.log("first", lead?.otp)
              (lead?.signature == "" ||
                lead?.signature == undefined ||
                lead?.otp == "" ||
                lead?.otp == undefined) && (
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                  >
                    Send Invitation
                  </button>
                </div>
              )
            }
            <div className="card ps-3 mt-3">
              <p>Invited by : {lead?.invitedby} </p>
              <p>
                Invited Date : <br />{" "}
                {moment(lead?.invitedDate).format("MMMM Do YYYY, h:mm:ss a")}
              </p>
              <p>Name : {lead?.invitedname}</p>
              <p>Email : {lead?.invitedemail}</p>
            </div>
            <div className="card ps-3 mt-3">
              <p>
                Signed :{" "}
                {lead?.signature ? (
                  <span className="text-success">Yes</span>
                ) : (
                  <span className="text-danger">Pending</span>
                )}
              </p>
              <p>
                Signed Date : <br />
                {lead?.signatureverifieddate ? (
                  <span className="text-success">
                    {moment(lead?.signatureverifieddate).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </span>
                ) : (
                  <span className="text-danger">Pending</span>
                )}
              </p>

              <p>
                Verified OTP{" "}
                {lead?.otpverified == true ? (
                  <span className="text-success">Yes</span>
                ) : (
                  <span className="text-danger">Pending</span>
                )}
              </p>
              <p>
                Verified Date :{" "}
                {lead?.otpverifieddate ? (
                  <span className="text-success">
                    {" "}
                    {moment(lead?.otpverifieddate).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </span>
                ) : (
                  <span className="text-danger">Pending</span>
                )}
              </p>
            </div>
            <div className="mt-5">
              {(lead?.signature !== "" || lead?.signature !== undefined) && (
                <>
                  <p>Client Signature : </p>

                  <div className="card ">
                    <img src={imgUrl} alt="signature" className="img-fluid" />
                  </div>
                </>
              )}
            </div>
          </div>

          <Modal
            title="Send Invitation"
            open={showEventModal}
            onOk={handleSubmit}
            onCancel={modelClose}
            okText="Create"
            disabled={!isDataValid()}
          >
            <div>
              <div className="row p-2">
                <div className="col-3">
                  <p>Name</p>
                </div>
                <div className="col-9">
                  <Input
                    placeholder="name"
                    type="text"
                    name="name"
                    value={invite.name}
                    onChange={handleNewEventChange}
                  />
                </div>
              </div>
              <div className="row p-2">
                <div className="col-3">
                  <p>Email</p>
                </div>
                <div className="col-9">
                  <Input
                    placeholder="email"
                    type="email"
                    name="email"
                    value={invite.email}
                    onChange={handleNewEventChange}
                  />
                </div>
              </div>
              <div className="row p-2">
                <div className="col-3">
                  <p>Number</p>
                </div>
                <div className="col-9">
                  <Input
                    placeholder="number"
                    type="number"
                    name="number"
                    value={invite.number}
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
        </div>
      ) : (
        <div className="p-3">No agreement found</div>
      )}
    </>
  );
}

export default Pdfview;
