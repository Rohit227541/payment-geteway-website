import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if(token && config.headers){
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error)=>{
    return Promise.reject(error);
  }
);



export const authService = {


  signup: async (data:any)=>{

    const response = await api.post(
      "/gateway/signup",
      {
        merchantName:data.email.split("@")[0],
        email:data.email,
        password:data.password
      }
    );

    return response.data;

  },


  verifyEmail: async(data:{email:string;code:string})=>{

    const response = await api.post(
      "/verifyEmail",
      {
        email:data.email,
        otp:data.code
      }
    );

    return response.data;

  },


  resendOtp: async(data:{email:string})=>{

    const response = await api.post(
      "/resend-otp",
      data
    );

    return response.data;

  },


  login: async(data:{email:string;password:string})=>{

    const response = await api.post(
      "/gateway/login",
      data
    );

    return response.data;

  },


  forgotPassword: async(data:{email:string})=>{

    const response = await api.post(
      "/forgot-password",
      data
    );

    return response.data;

  },


  resetPassword: async(data:any)=>{

    const response = await api.post(
      "/verify-password-reset",
      data
    );

    return response.data;

  },


  resendResetOtp: async(data:any)=>{

    const response = await api.post(
      "/request-password-change",
      data
    );

    return response.data;

  }

};



export const kycService = {

  submitKyc: async(formData:FormData)=>{

    const response = await api.post(
      "/merchant/kyc",
      formData,
      {
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }
    );

    return response.data;

  }

};


export default api;