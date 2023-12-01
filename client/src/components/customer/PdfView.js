import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import pdfFile from "../images/sample.pdf";
import { pdfjs } from "react-pdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { toast } from "react-toastify";
import { isEmailValid } from "../utils/common";
import { useParams } from "react-router-dom";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function PdfView() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [name, setName] = useState("");
  const [signatureOptions, setSignatureOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [fontSize, setFontSize] = useState("56px");
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [otpEerr, setOtpErr] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState("");

  const { id, url, token } = useParams();
  const fileURL = `/api/v1/lead/viewFile/${id}/${url}`;

  const otpFieldStyle = {
    width: "38px",
    marginRight: "10px",
    paddingLeft: "12px",
    height: "40px",
  };

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

  const generateSignatureOptions = (name) => {
    const option1 = { text: `${name}`, font: "Tangerine" };
    const option2 = { text: `${name}`, font: "Pacifico" };
    const option3 = { text: `${name}`, font: "Ubuntu" };

    setSignatureOptions([option1, option2, option3]);
  };

  const handleCreateSignature = () => {
    if (name) {
      generateSignatureOptions(name);
    } else {
      toast.error("Name can't be empty");
    }
  };

  const handleGenerateCode = async () => {
    if (email === "") {
      toast.error("Email can't be empty");
    } else if (!isEmailValid(email)) {
      toast.error("Enter valid email");
    } else {
      const data = email.toLocaleLowerCase();
      const res = await axios
        .post(`/api/v1/lead/generateOtp/${id}/${token}`, { data })
        .then((res) => {
          if (res) {
            toast.success(res?.data?.msg);
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data.msg);
        });
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleConfirmSignature = () => {
    const signatureDiv = document.getElementById("signatureDiv");

    if (signatureDiv) {
      html2canvas(signatureDiv).then(async (canvas) => {
        const image = canvas.toDataURL("image/png");
        const filename = `${
          signatureOptions[selectedOption]?.text
        }_${Date.now()}.png`;
        // Create form data and append image and filename
        // Convert data URL to Blob
        const imageBlob = dataURLtoBlob(image);

        // Create FormData and append File with the same filename
        const file = new File([imageBlob], filename, { type: "image/png" });
        const formData = new FormData();
        formData.append("file", file);

        // const imgElement = document.createElement("img");
        // imgElement.src = image;
        // imgElement.alt = "Generated Signature";
        // document.body.appendChild(imgElement);

        await axios
          .post(
            `/api/v1/lead/uploadsignature/${id}/${token}`,

            formData,

            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((res) => {
            if (res) {
              toast.success(res?.data?.msg); 
              getDetails();
              window.location.reload()             
            }
          })
          .catch((error) => {
            toast.error("Error sending data to server:", error);
          });
      });
    }
  };
  function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtpErr("");
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    //Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };
  const handleVerifyOTP = async () => {
    const isValidOTP = otp.every((digit) => !isNaN(digit) && digit !== "");

    if (isValidOTP) {
      // toast.success("Entered OTP is " + otp.join(""));
      const JOtp = otp.join("");
      await axios
        .post(`/api/v1/lead/verifyeOtp/${id}/${token}`, { JOtp })
        .then((res) => {
          if (res) {
            toast.success(res?.data?.msg);
            setOtp([...otp.map((v) => "")]);
            getDetails();
            window.location.reload()
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.msg);
        });
    } else {
      setOtpErr("Please enter a valid OTP");
    }
  };

  const getDetails = async () => {
    await axios
      .get(`/api/v1/lead/verifyTokenAndGetDetails/${id}/${token}`)
      .then((res) => {
        if (res) {
          setData(res.data);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.msg);
      });
  };
  useEffect(() => {
    getDetails();
  }, []);

  const downloadFile = async () => {
    // Replace with the correct API endpoint
    const downloadUrl = `/api/v1/lead/downloadFile/${url}`;

    axios({
      url: downloadUrl,
      method: "GET",
      responseType: "blob", // Treat the response as a binary blob
    })
      .then((response) => {
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
        toast.error(err?.response?.data?.msg);
      });
  };

  return (
    <>
    {((data.signature !== undefined && data.signature !== "") && data.otpverified === true) ? "Verified" : 

   
      <div className="row">
        <div className="col-sm-12 col-md-8 col-lg-6 p-3 ">
          <div className="">
            <Document file={fileURL} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} className="border border-gray" />
            </Document>
          </div>
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


        <div className="col-md-6 p-3">
          <div className="text-center mb-3">
            <button onClick={downloadFile} className="btn btn-primary">Download</button>
          </div>
          {(data?.signature == "" || data?.signature == undefined) && (
            <div className="card p-5">
              <div className="row ">
                <div className="col-3 d-flex align-items-center">
                  <label>Enter name:</label>
                </div>
                <div className="col-9">
                  <input
                    placeholder="Name"
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setSignatureOptions([]);
                      setSelectedOption("");
                    }}
                  />
                </div>
                <div className="text-center my-3">
                  <button
                    className="btn btn-primary"
                    onClick={handleCreateSignature}
                  >
                    Create Signature
                  </button>
                </div>
              </div>
              <div>
                {signatureOptions.length > 0 && name && (
                  <>
                    <h6>Select Signature To Sign Digitaly</h6>
                    <div className=" d-flex">
                      {signatureOptions.map((option, index) => (
                        <div
                          key={index}
                          style={{ fontFamily: option?.font }}
                          className="p-3"
                        >
                          <input
                            type="radio"
                            id={`option${index}`}
                            name="signatureOption"
                            value={index}
                            className="form-check-input p-2"
                            checked={selectedOption === index.toString()}
                            onChange={handleOptionChange}
                          />
                          <label
                            class="form-check-label ps-2"
                            htmlFor={`option${index}`}
                          >
                            {option?.text}
                          </label>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {selectedOption !== "" && name && (
                <div className="m-auto">
                  <div>
                    <div style={{ border: "solid 1px", width: "400px" }}>
                      <div
                        id="signatureDiv"
                        style={{
                          marginTop: "10px",
                          marginBottom: "10px",
                          fontFamily: signatureOptions[selectedOption]?.font,
                          fontSize: fontSize,
                          width: "100%",
                          height: "100%",
                          textAlign: "center",
                        }}
                      >
                        {signatureOptions[selectedOption]?.text}
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <button
                      onClick={handleConfirmSignature}
                      className="btn btn-primary"
                    >
                      Confirm signature
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {data.otpverified === false && (
            <div className="card mt-3 p-5">
              <div className="row ">
                <div className="col-3 d-flex align-items-center">
                  <label>Enter Email:</label>
                </div>
                <div className="col-9">
                  <input
                    placeholder="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="text-center my-3">
                  <button
                    className="btn btn-primary"
                    onClick={handleGenerateCode}
                  >
                    Send Verification Code
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col text-center">
                  <div>
                    <p>Enter the OTP sent to you to verify your identity</p>

                    {otp.map((data, index) => {
                      return (
                        <input
                          className=""
                          type="number"
                          name="otp"
                          maxLength="1"
                          key={index}
                          value={data}
                          onChange={(e) => handleChange(e.target, index)}
                          onFocus={(e) => e.target.select()}
                          style={otpFieldStyle}
                        />
                      );
                    })}
                    {otpEerr && <p className="alert">{otpEerr}</p>}
                  </div>

                  <div className="mt-2">
                    <button
                      className="btn btn-warning me-2"
                      onClick={(e) => setOtp([...otp.map((v) => "")])}
                    >
                      Clear
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleVerifyOTP}
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
       }
    </>
  );
}

export default PdfView;
