import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import SettingsIcon from "@mui/icons-material/Settings";
import moment from "moment";
import note from "../images/note.png";
import mail from "../images/mail.png";
import tag from "../images/tag.png";
import prof from "../images/prof.png";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import Divider from '@mui/material/Divider';

function History({ history }) {
  const fieldToIcon = {
    notes: <img src={note} className="img-fluid" />,
    "file attached": <img src={tag} className="img-fluid" />,
    status: <img src={prof} className="img-fluid" />,
    email: <img src={mail} className="img-fluid" />,
    "Lead Created": <img src={prof} className="img-fluid" />,
    meeting: <img src={prof} className="img-fluid" />,
    "Agreement Attached": <img src={tag} className="img-fluid" />,
  };
  const fieldToDisplayName = {
    notes: "Notes",
    "file attached": "File Attached",
    status: "Status",
    email: "Email Sent",
    "Lead Created": "Lead Created",
    meeting: "Meeting",
  };

  const groupHistoryByDate = (history) => {
    const groupedHistory = {};
    history.forEach((entry) => {
      const date = moment(entry.timestamp).format("YYYY-MM-DD");
      if (!groupedHistory[date]) {
        groupedHistory[date] = [];
      }
      groupedHistory[date].push(entry);
    });
    return groupedHistory;
  };

  const [openDates, setOpenDates] = useState([]);

  const toggleDate = (date) => {
    setOpenDates((prevOpenDates) =>
      prevOpenDates.includes(date)
        ? prevOpenDates.filter((d) => d !== date)
        : [...prevOpenDates, date]
    );
  };

  const renderHistoryByDate = (groupedHistory) => {
    return Object.entries(groupedHistory).map(([date, entries]) => (
      <div key={date}>
       <hr class="hr-custom"/>        
        <div className="date-label" onClick={() => toggleDate(date)}>
          <span>            
              {formatDateLabel(date)}{" "}
              <span className="ps-2">
              {openDates.includes(date) ? <FaAngleDown /> : <FaAngleUp />}
            </span>
          </span>
        </div>
        {!openDates.includes(date) && (
          <Stepper orientation="vertical">
            {entries.map((entry, entryIndex) => (
              <Step key={entryIndex}>     
                <StepLabel
                  icon={
                    fieldToIcon[entry.changes[0].field] || (
                      <SettingsIcon
                        color="primary"
                        className="ms-2 border rounded"
                      />
                    )
                  }
                >
                  <div style={{ marginLeft: "-140px", paddingTop: "20px" }}>
                    {moment(entry.timestamp).format("DD/MM/YYYY ")} <br />
                    {moment(entry.timestamp).format("LT")}
                  </div>
                  <ul>
                    {entry.changes.map((change, changeIndex) => (
                      <p
                        key={changeIndex}
                        style={{
                          marginTop: "-40px",
                          position: "absolute",
                        }}
                      >
                        <strong>
                          {fieldToDisplayName[change.field] || change.field}{" "}
                        </strong>
                        <br />
                        <strong>By:</strong> {entry.createdby}
                        <br />
                        <strong>Value:</strong> {change.newValue}
                      </p>
                    ))}
                  </ul>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
      </div>
    ));
  };

  const formatDateLabel = (date) => {
    const today = moment().format("YYYY-MM-DD");
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

    if (date === today) {
      return "Today";
    } else if (date === yesterday) {
      return "Yesterday";
    } else {
      return moment(date).format("MMMM Do YYYY");
    }
  };

  const groupedHistory = groupHistoryByDate(history);

  return (
    <div
      className="container mt-3"
      style={{ padding: "0px 50px 50px 120px", minHeight: "60vh" }}
    >
      {renderHistoryByDate(groupedHistory)}
    </div>
  );
}

export default History;
