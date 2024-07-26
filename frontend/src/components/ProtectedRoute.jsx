import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constant";
import { useState,useEffect } from "react";

function ProtectedRoute({ children }) {
  const [isAutherized, setIsAuthorized] = useState(null);
  
  useEffect(()=>{
    auth().catch(()=>setIsAuthorized(false))
  },[])

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if(res.status === 200){
        localStorage.setItem(ACCESS_TOKEN,res.data.access)
        setIsAuthorized(true)
      }
    } catch (error) {
      setIsAuthorized(false1);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;
    if(tokenExpiration < now){
        await refreshToken();
    }else{
        setIsAuthorized(true)
    }
  };

  if (isAutherized === null) {
    return <div className="">Loading.....</div>;
  }
  return isAutherized ? children : <Navigate to="/login" />;
}
export default ProtectedRoute
