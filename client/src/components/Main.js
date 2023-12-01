import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { GlobalContext } from "../GlobalContext.js";
import Login from "../components/auth/Login";
import Sidebar from "../components/sidebar/Sidebar.js";
import Dashboard from "../components/dashboard/Dashboard.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFoundPage from "./auth/NotFoundPage.js";
import Forgetpassword from "./auth/Forgetpassword.js";
// import ProtectedRoute from "./utils/ProtectedRoute.js";
import Profile from "./profile/Profile.js";
import { loginStatus } from "./utils/common.js";
import AddLeads from "./leads/AddLeads.js";
import Leads from "./leads/Leads.js";
import LeadDetails from "./leads/LeadDetails.js";
import Meeting from "./meetings/Meeting.js";
import Deals from "./deals/Deals.js";
import DealDetails from "./deals/DealDetails.js";
import EmpList from "./employee/EmpList.js";
import Empdetails from "./employee/Empdetails.js";
import AddEmployee from "./employee/AddEmployee.js";
import Customer from "./customer/Customer.js";
import Chat from "./messages/Chat.js";

function Main() {
  const context = useContext(GlobalContext);
  // const [isLogged] = context.authApi.isLogged;
  

  return (
    <Router>
      <>
        <ToastContainer autoClose={1500} position="top-right" />

        <Routes>
        {loginStatus() === true ? (
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/addleads" element={<AddLeads />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/leaddetails/:id" element={<LeadDetails />} />
              <Route path="/meetings" element={<Meeting />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/dealdetails/:id" element={<DealDetails />} />
              <Route path="/addemploye" element={<AddEmployee />} />
              <Route path="/employee" element={<EmpList />} />
              <Route path="/empdetails/:id" element={<Empdetails />} />
              <Route path="/messages" element={<Chat />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/forgetpassword" element={<Forgetpassword />} />
              <Route path="/*" element={<Navigate to="/login" replace />} />
              <Route path="/customer/:id/:url/:token" element={<Customer />} />

            </>
          )}
        </Routes>
      </>
    </Router>
  );
}

function Layout() {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
}

export default Main;
