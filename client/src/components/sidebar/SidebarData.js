import React from "react";
import * as IoIcons from "react-icons/io";

import { BiHomeAlt2 } from "react-icons/bi";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { MdOutlineVideocam } from "react-icons/md";
import { TbBulb } from "react-icons/tb";
import { TbTargetArrow } from "react-icons/tb";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { AiOutlineMail } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi";
export const SidebarData = (userRole) => {
  const commonItems = [
    {
      title: "Home",
      path: "/dashboard",
      icon: <BiHomeAlt2 />,
    },
    {
      title: "Leads",
      path: "/leads",
      icon: <MdOutlinePeopleAlt />,
    },
    {
      title: "Meetings",
      path: "/meetings",
      icon: <MdOutlineVideocam />,
    },
    {
      title: "Deals",
      path: "/deals",
      icon: <IoIcons.IoMdPeople />,
    },
    // {
    //   title: "Projects",
    //   path: "/projects",
    //   icon: <TbBulb />,
    // },
    // {
    //   title: "Tasks",
    //   path: "/tasks",
    //   icon: <TbTargetArrow />,
    // },
    // {
    //   title: "Documents",
    //   path: "/documents",
    //   icon: <HiOutlineDocumentText />,
    // },
    {
      title: "Messages",
      path: "/messages",
      icon: <AiOutlineMail />,
    },
    {
      title: "Settings",
      path: "/profile",
      icon: <FiSettings />,
    },
    userRole === "Admin" && {
      title: "Employee List",
      path: "/employee",
      icon: <HiUserGroup />,
    },
    // {
    //   title: "Client",
    //   path: "/customer",
    //   icon: <HiUserGroup />,
    // },
    
  ];
  
  const filteredItems = commonItems.filter((item) => item);

  return filteredItems;
};
