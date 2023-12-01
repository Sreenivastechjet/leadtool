import axios from "axios";

export const getDealsByDates = async (period) => {
  const request = await axios.post(`/api/v1/deal/getdealssbydates/${period}`,
//   {}, {
//     headers: { Authorization: token },
//   }
  );

  return request;
};


export const getChartData = async () => {
    const year = 2023
    const request = await axios.post(`/api/v1/deal/getdealssforchart/${year}`,
  //   {}, {
  //     headers: { Authorization: token },
  //   }
    );
  
    return request;
  };

