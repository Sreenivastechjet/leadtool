// import axios from "axios";

// export const getuserInfo = async (token) => {
//   const request = await axios.get("/api/v1/auth/userinfo", {
//     headers: { Authorization: token },
//   });

//   return request;
// };



// export const getempoptions = async (search,page) => {
//   const request = await axios.post(`/api/v1/auth/empminifiedlist?search=${search}&page=${page}`, 
//   // {
//   //   headers: { Authorization: token },
//   // }
//   );

//   return request;
// };

import axios from "axios";
import React, { useState, useEffect } from "react";

function useAuth(token) {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [isSalesManager, setSalesManager] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState([])
  const [toDo, setToDO] = useState([])

  const [callback, setCallback] = useState(false);

  
  useEffect(() => {
    if (token) {
      const getData = async () => {
        const res = await axios.get(`/api/v1/auth/userinfo`, {
          headers: { Authorization: token },
        });
        // console.log("token =", res.data.user.name);
        setUser(res.data.user);
        setUserName(res.data.user.name)
        setUserId(res.data.user._id)
        setUserEmail(res.data.user.email)
        setToDO(res.data.user?.mytodo)
        setUserRole(res.data?.user?.role)
        setIsLogged(true);
        if (res.data.user.role === "Admin") {
          setIsAdmin(true);
          // readAllUsers(token)
        }
        if (res.data.user.role === "Sales Manager") {
          setSalesManager(true);          
        }
      };
      getData();
    }
  }, [token]);

const getempoptions = async (search,page) => {
  const request = await axios.post(`/api/v1/auth/empminifiedlist?search=${search}&page=${page}`, 
  // {
  //   headers: { Authorization: token },
  // }
  );

  return request;
};
  

    

  return {
    userData: [user, setUser],
    userId: [userId, setUserId],
    userName: [userName, setUserName],
    userEmail: [userEmail, setUserEmail],
    todos: [toDo, setToDO],
    isLogged: [isLogged, setIsLogged],
    userRole:[userRole, setUserRole],
    isSalesManager: [isSalesManager, setSalesManager],
    isAdmin: [isAdmin, setIsAdmin],
    allUsers: [allUsers, setAllUsers],
    callback: [callback, setCallback],
    getempoptions:getempoptions,
  };
}

export default useAuth;
