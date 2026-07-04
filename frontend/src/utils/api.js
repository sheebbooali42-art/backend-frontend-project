import { client } from "./helper.js";
import { cookies } from "next/headers.js";



 export const fetchRooms = async (queryObject = {}) => {
  try {
    const query = new URLSearchParams(queryObject).toString();

    const { data } = await client.get(`/room-type${query ? `?${query}` : ""}`
    );
    

    return {
      success: data.success,
      data: data.rooms,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message || "Internal Server Error",
    };
  }
};



export const fetchRoomsById = async (id) => {
    try {
        const response = await client.get(`room-type/${id}`);

        return {
            success: response.data.success,
            data: response.data.rooms,
            message: response.data.message
        }

    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        }
    }
};

export const fetchCategory = async () => {
    try {
        const response = await client.get("category");

        return {
            success: response.data.success,
            data: response.data.categories,
            message: response.data.message
        }

    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        }

    }
};

export const fetchCategoryById = async (id) => {
    try {
        const response = await client.get(`category/${id}`);

        return {
            success: response.data.success,
            data: response.data.category,
            message: response.data.message
        }

    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        }
    }
};

export const fetchProduct = async (queryObject = {}) => {
    try {
        const query = new URLSearchParams();
        if (queryObject.status) {
            query.append("status", queryObject.status)
        }
        if (queryObject.limit) {
            query.append("limit", queryObject.limit)
        }

        if (queryObject.bestSeller) {
            query.append("bestSeller", queryObject.bestSeller)
        }

        if (queryObject.room) {
            query.append("room", queryObject.room)
        }

        if (queryObject.category) {
            query.append("category", queryObject.category)
        }
        if (queryObject.min && queryObject.max) {
            query.append("min", queryObject.min)
            query.append("max", queryObject.max)
        }

        if (queryObject.sort) {
            query.append("sort", queryObject.sort)
        }



        const response = await client.get(`product?${query.toString()}`);

        return {
            success: response.data.success,
            data: response.data.products,
            message: response.data.message
        }

    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        }

    }
};

 

export const fetchProductById = async (id) => {
  try {
    const { data } = await client.get(`/product/${id}`);

    return {
      success: data.success,
      product: data.product,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      product: null,
      message:
        error?.response?.data?.message || "Internal Server Error",
    };
  }
};


export const getProfile = async () => {
    try {

        const cookieStore = await cookies();
        const token = cookieStore.get("jwt")?.value;
        const response = await client.get(`user/profile`,{
            headers:{
                Authorization: token
            }
        });
 
        return {
            success: response.data.success,
            data: response.data.user,
            message: response.data.message
        }
    } catch (error) {
        return {
            success: false,
            data: [],
            message: "Internal Server Error"
        }
    }
};