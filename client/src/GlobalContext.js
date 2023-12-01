import React, { createContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuth from './components/Api/AuthApi';


export const GlobalContext = createContext();

function DataProvider(props) {
    const [token,setToken] = useState(null)

    const initToken = useCallback( async () => {
        if(localStorage.getItem('loginToken')){
          await axios.get(`/api/v1/auth/refreshToken`)
        .then(res => {
          setToken(res.data.accessToken)
        }).catch(err => toast.error(err.response.data.msg))
          }
      },[])
    
      useEffect(() => {
        initToken()
      },[initToken])

    const data = {
        token:[token,setToken],
        authApi: useAuth(token),
      }

  return (
    <GlobalContext.Provider value={data}>
    {props.children}
  </GlobalContext.Provider>
  )
}

export default DataProvider