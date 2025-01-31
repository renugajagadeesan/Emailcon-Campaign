import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CampaignTable.css"; // Import the CSS file
import {  FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiConfig from "../apiconfig/apiConfig";


function CampaignTable() {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
  const fetchCampaigns = async () => {
    if (!user) {
      navigate("/"); 
      return;
    }

    try {
      const res = await axios.get(`${apiConfig.baseURL}/api/stud/campaigns/${user.id}`);
      setCampaigns(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch groups");
    }
  };

  fetchCampaigns();
}, [user, navigate]);  // Ensure useEffect is dependent on `user` and `navigate`

   const handlebackcampaign = () => {
     navigate("/home");
   };

  
  return (
    <div className="admin-dashboard-page">
      <div className="admin-nav">
      <h2 className="admin-dashboard-header">Campaign History</h2>
        <button onClick={handlebackcampaign} className="admin-nav-button">
            <span className="admin-nav-icons">
              <FaArrowLeft />
            </span>{" "}
            <span className="nav-names">Home</span>
          </button>
          
        </div>
      <table className="admin-dashboard-table">
        <thead>
          <tr>
            <th>CampaignName</th>
            <th>GroupName</th>
            <th>TotalCount</th>
            <th>SendCount</th>
            <th>SendDate</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign._id}>
              <td>{campaign.campaignname}</td>
              <td>{campaign.groupname}</td>
              <td>{campaign.totalcount}</td>
              <td>{campaign.sendcount}</td>
              <td>{campaign.senddate}</td>           
            </tr>
          ))}
        </tbody>
      </table>
<ToastContainer className="custom-toast"
  position="bottom-center"
      autoClose= {2000} 
      hideProgressBar={true} // Disable progress bar
      closeOnClick= {false}
      closeButton={false}
      pauseOnHover= {true}
      draggable= {true}
      theme= "light" // Optional: Choose theme ('light', 'dark', 'colored')
/>
       
    </div>
  );
}

export default CampaignTable;