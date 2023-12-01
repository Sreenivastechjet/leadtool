import React, { useState, useEffect, useContext } from "react";
import {GlobalContext} from "../../GlobalContext"
import dummypic from "../images/profile.png";
import axios from "axios";
import { upperFirst } from "../utils/common";
import { useSelector, useDispatch } from "react-redux";
import { getuserInfo } from "../../store/UserSlice";
import { toast } from "react-toastify";
import { ImAttachment } from "react-icons/im";import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function Profile() {
  const context = useContext(GlobalContext);
  const [userData] = context.authApi.userData;
  const [userId] = context.authApi.userId;
  // console.log("userData", userData)


  const token = useSelector((state) => state.token.accessToken);
  const userInfo = useSelector((state) => state.user?.userInfo?.user);
  const loading1 = useSelector((state) => state.user?.loading);
  const [passwordData, setPasswordData] = useState({
    existingPassword: "",
    newPassword: "",
    confirmPassword: "",
    email: "",
  });
  const [error, setError] = useState("");
  const fileURL = `/api/v1/lead/viewFile/${userId}/${userData?.image}`;


  const updateProfileImage = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = axios
        .patch(`api/v1/auth/pictute/upload/${userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
         if(res){
          toast.success(res?.data?.msg);
          // getuserInfo(token)
         }
        })
        .catch((error) => {
          toast.error(error.response?.data?.msg);
        });
    }
  };

  const handlepassChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setError("");
  };
  const updatePassword = async () => {
    const data = {
      oldPassword: passwordData?.existingPassword,
      newPassword: passwordData?.newPassword,
      email: userData?.email,
    };
    if (
      !passwordData.existingPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setError("All password fields are required.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirm password should be same");
      return;
    } else {
      await axios
        .patch("/api/v1/auth/resetPassword", data)
        .then((res) => {
          toast.success(res?.data?.msg);
          setPasswordData({});
          window.location.reload()
          // getuserInfo(token)
        })
        .catch((error) => {
          toast.error(error?.response?.data?.msg);
        });
    }
  };
  const antIcon = <LoadingOutlined className="loadingIcon" spin />;
  return (
    <div className="main">
      <div className="loadersCss">
                <Spin indicator={antIcon} spinning={loading1}></Spin>
              </div>
      <div className="container p-5">
        <div className="bgwhite rounded">
          <h4 className="p-3">Profile Setting</h4>

          <div className="p-5">
            {/* <div className="col-8">
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary m-2" onClick={updateProfile}>
                  Update Details
                </button>
              </div>
            </div> */}

            <div class="mb-3 row">
              <label class="col-sm-2 col-form-label">User Name</label>
              <div class="col-md-6">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Please enter name"
                  value={userData?.name}
                  // onChange={(e) =>
                  //   setUserData({ ...userData, name: e.target.value })
                  // }
                  required
                />
              </div>
            </div>

            <div class="mb-3 row">
              <label class="col-sm-2 col-form-label">Email</label>
              <div class="col-md-6">
                <input
                  type="email"
                  class="form-control text-lowercase"
                  placeholder="Please enter email"
                  value={userData?.email}
                  // onChange={(e) =>
                  //   setUserData({ ...userData, email: e.target.value })
                  // }
                  required
                />
              </div>
            </div>
            <div class="mb-3 row">
              <label class="col-sm-2 col-form-label">Number</label>
              <div class="col-md-6">
                <input
                  type="number"
                  class="form-control"
                  placeholder="Please enter number"
                  value={userData?.number}
                  // onChange={(e) =>
                  //   setUserData({ ...userData, number: e.target.value })
                  // }
                  required
                />
              </div>
            </div>

            <div class="mb-3 row">
              <label class="col-sm-2 col-form-label">Job Title</label>
              <div class="col-md-6">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Please enter title"
                  value={userData?.role}
                  // onChange={(e) =>
                  //   setUserData({ ...userData, title: e.target.value })
                  // }
                  required
                />
              </div>
            </div>
            <div class="mb-3 row">
              <label class="col-sm-2 col-form-label">Profile pic</label>
              <div class="col-md-6 d-flex justify-content-between">
                <img
                  src={userData?.image ? fileURL : dummypic}
                  // alt={upperFirst(userData?.name)}
                  width="100"
                  height="100"
                  className="border border-primary-subtle rounded-circle"
                />

                <div>
                  <input
                    type="file"
                    id="agreement"
                    onChange={!userData?.image ? updateProfileImage : null}
                    style={{ display: "none" }}
                    accept=".png, .jpg, .jpeg"
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
                    {
                      userInfo?.image ? "Update Picture" : "Upload Pictute"
                    }
                    
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2 mt-3 rounded bgwhite">
          <h4 className="p-3">Change Password</h4>

          <div className="p-5">
            <div class="mb-3 row">
              <label class="col-sm-2 col-form-label">Existing Password</label>
              <div class="col-md-6">
                <input
                  type="password"
                  class="form-control"
                  name="existingPassword"
                  placeholder="Enter existing password"
                  value={passwordData.existingPassword}
                  onChange={handlepassChange}
                />
              </div>
            </div>
            <div class="mb-3 row">
              <label class="col-sm-2 col-form-label">New Password</label>
              <div class="col-md-6">
                <input
                  type="password"
                  class="form-control"
                  placeholder="Enter new password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlepassChange}
                />
              </div>
            </div>
            <div class="mb-3 row">
              <label class="col-sm-2 col-form-label">
                Confirm New Password
              </label>
              <div class="col-md-6">
                <input
                  type="password"
                  class="form-control"
                  placeholder="Enter confirm new password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlepassChange}
                />
                <div>{error && <p className="text-danger">{error}</p>}</div>
              </div>
            </div>

            <div className="col-8">
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-primary m-2"
                  onClick={updatePassword}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
