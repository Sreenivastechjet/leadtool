import React, { useState, useEffect, useRef, useContext } from "react";
import { GlobalContext } from "../../GlobalContext";
import Avatar from "@mui/material/Avatar";
import profile from "../images/profile.png";
import ChatInput from "./ChatInput";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// const messages = [
//   {
//     id: 1,
//     message: "Hello, how are you?",
//     fromSelf: false, // received message
//   },
//   {
//     id: 2,
//     message: "Hi there! I'm doing well, thanks.",
//     fromSelf: true, // sent message
//   },
//   {
//     id: 3,
//     message: "What's up?",
//     fromSelf: false,
//   },
//   {
//     id: 4,
//     message: "Hello, how are you?",
//     fromSelf: false, // received message
//   },
//   {
//     id: 5,
//     message: "Hi there! I'm doing well, thanks.",
//     fromSelf: true, // sent message
//   },
//   {
//     id: 6,
//     message: "What's up?",
//     fromSelf: false,
//   },
//   {
//     id: 7,
//     message: "Hello, how are you?",
//     fromSelf: false, // received message
//   },
//   {
//     id: 8,
//     message: "Hi there! I'm doing well, thanks.",
//     fromSelf: true, // sent message
//   },
//   {
//     id: 9,
//     message: "What's up?",
//     fromSelf: false,
//   },
//   // Add more dummy messages as needed
// ];

function ChatContainer({ currentChat, socket }) {
  const data = useContext(GlobalContext);
  const [userId] = data?.authApi?.userId;
  // console.log("first",userId)
  const scrollRef = useRef();
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);


  const handleSendMsg = async (msg) => {
    // console.log("first", msg);
    
    await axios.post(`/api/v1/chat/addmsg`, {
      from: userId,
      to: currentChat?._id,
      message: msg,
    }).then((res)=>{
      console.log(res)
      getmsg()
    }).catch((err)=>{
      console.log(err)
    }
    )

    // const msgs = [...messages];
    // msgs.push({ fromSelf: true, message: msg });
    // setMessages(msgs);
  };

  const getmsg = async()=>{
    await axios.post(`/api/v1/chat/getmsg`, {
      from: userId,
      to: currentChat?._id,
    }).then((res)=>{
      // console.log("res", res)
      setMessages(res?.data)
    }).catch((err)=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    getmsg()
  },[userId, currentChat])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <Container>
      <div className="d-flex align-items-center bg-light p-3 border-bottom">
        <Avatar
          alt={currentChat?.name.charAt(0)}
          // src={currentChat?.image}
          src={currentChat?.image ? `/api/v1/lead/viewFile/${currentChat?._id}/${currentChat?.image}` : profile}
          className="border border-primary"
        />
        <h5 className="ps-3">{currentChat?.name}</h5>
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

export default ChatContainer;

const Container = styled.div`
  height: 87vh;
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
        color: black;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
        color: black;
      }
    }
  }
`;
