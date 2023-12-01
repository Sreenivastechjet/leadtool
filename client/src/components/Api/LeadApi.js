import axios from "axios";

export const getLeadsByDates = async (period) => {
  const request = await axios.post(`/api/v1/lead/getleadsbydates/${period}`,
  // {}, 
  // {
  //   headers: { Authorization: token },
  // }
  );

  return request;
};

// export const getDealsByDates = async (token) => {
//   const request = await axios.post(`/api/v1/lead/getleadsbydates/${period}`,{}, {
//     headers: { Authorization: token },
//   });

//   return request;
// };
