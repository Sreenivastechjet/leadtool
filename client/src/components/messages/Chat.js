import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import Avatar from "@mui/material/Avatar";
import profile from "../images/profile.png";
import { stringSortingByChar } from "../utils/common";
import ChatContainer from "./ChatContainer";

const chartdata = [
  {
    img: { profile },
    name: "John Doe",
    text:"itemitemitemitemitekjjhvkhgvkhgvmitemitem"
  },
  {
    img: { profile },
    name: "Jane Smith",
    text:"itemitemitemitemitekjjhvkhgvkhgvmitemitem"
  },
  {
    img: { profile },
    name: "Jane Smith",
    text:"itemitemitemitemitekjjhvkhgvkhgvmitemitem"
  },
  {
    img: { profile },
    name: "John Doe",
    text:"itemitemitemitemitekjjhvkhgvkhgvmitemitem"
  },
 
];

function Chat() {
  return (
    <div className="main p-3">
      <div className="row bgwhite" style={{ height: "87vh" }} >
        <div className="col-3 p-2">
          <div class="input-group-text">
            <FiSearch color="black" />
            <input
              type="search"
              placeholder="Search.."
              className="search ps-2"
            />
          </div>
          <div className="p-2 pt-3" style={{height:"80vh", overflow: "auto" }}>
            {chartdata.map((item, i) => {
              console.log(item);
              return (
                <div key={item.name}>
                  <div className="row mb-3 pe-1">
                    <div className="col-2">
                      <Avatar
                        alt="R"
                        src={item.img.profile}
                        className="border border-primary"
                      />
                    </div>
                    <div className="col-8">
                      <h6 className="p-0 m-0">{item.name}</h6>
                      <span className="p-0">{stringSortingByChar(item.text, 20)}</span>
                    </div>
                    <div className="col-1">
                      <p>{"10:30"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-9 border-start">
        <ChatContainer  />
        </div>
      </div>
    </div>
  );
}

export default Chat;
