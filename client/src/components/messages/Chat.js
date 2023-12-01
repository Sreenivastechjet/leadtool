import React, { useEffect, useState, useRef, useContext } from "react";
import { GlobalContext } from "../../GlobalContext";
import { FiSearch } from "react-icons/fi";
import Avatar from "@mui/material/Avatar";
import profile from "../images/profile.png";
import { stringSortingByChar } from "../utils/common";
import ChatContainer from "./ChatContainer";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";

const host = "your_socket_io_server_host";
const chartdata = [
  {
    id: 1,
    img: { profile },
    name: "John Doe",
    text: "itemitemitemitemitekjjhvkhgvkhgvmitemitem",
  },
  {
    id: 2,
    img: { profile },
    name: "Jane Smith",
    text: "itemitemitemitemitekjjhvkhgvkhgvmitemitem",
  },
  {
    id: 3,
    img: { profile },
    name: "Smith Jane",
    text: "itemitemitemitemitekjjhvkhgvkhgvmitemitem",
  },
  {
    id: 4,
    img: { profile },
    name: "Doe John",
    text: "itemitemitemitemitekjjhvkhgvkhgvmitemitem",
  },
];

function Chat() {
  const data = useContext(GlobalContext);
  const [userId] = data?.authApi?.userId;
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);



  // const image = `/api/v1/lead/viewFile/${userId}/${url}`;
  // console.log("first", contacts);
  const getallusers = async () => {
    const res = await axios
      .post(`/api/v1/chat/allusers/${userId}`)
      .then((res) => {
        if (res) {
          // console.log("first", res.data);
          setContacts(res?.data)
        }
      })
      .catch((err) => {
        toast.error(err.response?.data.message);
      });
  };

  useEffect(() => {
    getallusers();
  }, [userId]);

  useEffect(() => {
    setCurrentUser(1);
  });

  // useEffect(() => {
  //   if (currentUser) {
  //     socket.current = io(host);
  //     socket.current.emit("add-user", currentUser.id);
  //   }
  // }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    setCurrentChat(contact);
  };
  return (
    <div className="main p-3">
      <div className="row bgwhite" style={{ height: "87vh" }}>
        <div className="col-3 p-2">
          <div class="input-group-text">
            <FiSearch color="black" />
            <input
              type="search"
              placeholder="Search.."
              className="search ps-2"
            />
          </div>
          <div
            className="p-2 pt-3"
            style={{ height: "80vh", overflow: "auto" }}
          >
            {contacts.map((contact, index) => {
              console.log("contact", contact);
              return (
                <div
                  key={contact._id}
                  onClick={() => changeCurrentChat(index, contact)}
                  role="button"
                >
                  <div className="row mb-3 pe-1">
                    <div className="col-2">
                      <Avatar
                        alt={contact?.name.charAt(0)}
                        src={`/api/v1/lead/viewFile/${contact._id}/${contact?.image}`}
                        className="border border-primary"
                      />
                    </div>
                    <div className="col-8">
                      <h6 className="p-0 m-0">{contact?.name}</h6>
                      <span className="p-0">
                        {stringSortingByChar(contact?.text, 20)}
                      </span>
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
        <div className="col-9 border-start chatcontainer">
          <ChatContainer currentChat={currentChat} socket={socket} />
        </div>
      </div>
    </div>
  );
}

export default Chat;
