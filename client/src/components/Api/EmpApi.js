import axios from "axios";

export const getempDetailsbyId = async ({id}) => {
    const request = await axios.get(`/api/v1/auth/getempbyid/${id}`)
  //     headers: { Authorization: token },
  //   }
    // );
  
    return request;
  };


  export const updateempDetailsbyId = async ({id}, data) => {
    const request = await axios.put(`/api/v1/auth/updateProfile/${id}`, {data})
  //   {}, {
  //     headers: { Authorization: token },
  //   }
    // );
  
    return request;
  };