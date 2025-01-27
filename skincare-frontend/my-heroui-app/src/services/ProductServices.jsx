import axios from "axios";

const API_URL = "http://localhost:4000/products"; 

export const fetchProducts = async (query) => {
  try {
    const response = await axios.get(API_URL, {
      params: { query },
    });
    return response.data; // returns the response data with product information
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products.");
  }
};
