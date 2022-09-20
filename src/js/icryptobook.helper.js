import Axios from "axios";

const API_URI = `https://core.icryptobook.com`;
const getAllCryptoFastNews = () => {
  return Axios.post(
    `${API_URI}/graphql`,
    {
      query: `
      query GetAllCryptoFastNews {
        getAllCryptoFastNews {
          data {
            title
            content
            createdAt
          }
        }
      }
      `,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
export const icryptobookHelper = {
  getAllCryptoFastNews,
};
