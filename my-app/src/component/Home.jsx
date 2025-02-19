
import React, { useState , useEffect } from 'react';
import {FaFileAlt, FaHistory, FaUserPlus, FaEye,FaUser} from 'react-icons/fa';
import './Home.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiConfig from "../apiconfig/apiConfig.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SendbulkModal from './SendbulkModal.jsx';
import GroupModal from './GroupModal.jsx';
import GroupModalnew from './GroupModalnew.jsx';
import ListPage from './ListPage.jsx';
import { FaRegClipboard } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa";

const Home = () => {
  const [view, setView] = useState("main");
 const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignName, setCampaignName] = useState("");
const [showGroupModal, setShowGroupModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
    const [showListPageModal, setShowListPageModal] = useState(false);
       const [showPopup, setShowPopup] = useState(false);



  const navigate=useNavigate();
 const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      const modalShown = localStorage.getItem("modalShown");
      if (!modalShown) {
        setShowPopup(true); // Show modal on first navigation
        localStorage.setItem("modalShown", "true"); // Mark modal as shown
      }
    }
  }, [user, navigate]);

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("modalShown"); // Reset modalShown for next login
    navigate("/");
  };

  const closePopup = () => {
    setShowPopup(false); // Close the modal
  };
  const handleMainView = () => {
    setView("main");
  };

  const handleCampaignView = () => {
    setView("campaign");
  };

  const handleContactView = () => {
    setView("contact");
  };
 const handleCreateContactView = () => {
    setView("create-contact");
  };
  const handleCreateCampaign = () => {
    setShowCampaignModal(true);
  };
  const handleviewcontacts=()=>{
    setShowListPageModal(true);
  }

  const handleCreateButton = () => {
  if (!user || !user.id) {
    toast.error("Please ensure the user is valid");
    return; // Stop further execution if user is invalid
  }

  if (campaignName && user && user.id) {
    axios
      .post(`${apiConfig.baseURL}/api/stud/campaign`, { camname: campaignName, userId: user.id })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("campaign", JSON.stringify(response.data.campaign));
        toast.success("Campaign created")
        setTimeout(()=>{
        setShowCampaignModal(false);
        setCampaignName("");
        },(4000))
         setTimeout(()=>{
        navigate('/editor');
        },(3000))
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to create campaign");
      });
  } else {
    toast.error("Please ensure all fields are filled and user is valid");
  }
};
const handlecampaignhistory=()=>{
    navigate('/campaigntable')
}

  return (
    <div className="sidebar-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title" onClick={handleMainView}>
          EmailCon
        </h2>
        <button
          className="sidebar-button campaign-button"
          onClick={handleCampaignView}
        >
          Campaign
        </button>
        <button
          className="sidebar-button contact-button"
          onClick={handleContactView}
        >
          Contact
        </button>
        <button
          onClick={handleLogout}
          className="logout-content">
          <span className='text-log'>Logout</span> <span className='icon-log'><FaSignOutAlt /></span>
        </button>
        {/* <div>
            <img src="../"/>
        </div> */}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {view === "main" && (
          <div className="card-grid">
            <div className="cards" onClick={handleCampaignView}>
              <FaRegClipboard className="icons campaign-icon" />
              <span className="card-texts">Campaign</span>
            </div>
            <div className="cards" onClick={handleContactView}>
              <FaAddressBook className="icons contact-icon" />
              <span className="card-texts">Contact</span>
            </div>
          </div>
        )}

        {view === "campaign" && (
          <div className="card-grid">
            <div className="cards" onClick={handleCreateCampaign}>
              <FaFileAlt className="icons campaign-create-icon" />
              <span className="card-texts">Create Campaign</span>
            </div>
            <div className="cards" onClick={handlecampaignhistory}>
              <FaHistory className="icons campaign-history-icon" />
              <span className="card-texts">Campaign History</span>
            </div>
          </div>
        )}

        {view === "contact" && (
          <div className="card-grid">
            <div className="cards" onClick={handleCreateContactView}>
              <FaUserPlus className="icons contact-create-icon" />
              <span className="card-texts">Create Contact</span>
            </div>
            <div className="cards" onClick={handleviewcontacts}>
              <FaEye className="icons contact-view-icon" />
              <span className="card-texts">View Contact</span>
            </div>
          </div>
        )}
        {view === "create-contact" && (
          <div className="card-grid">
            <div className="cards" onClick={() => setShowNewGroupModal(true)}>
              <FaUserPlus className="icons contact-create-icon" />
              <span className="card-texts">New Group</span>
            </div>
            <div className="cards" onClick={() => setShowGroupModal(true)}>
              <FaUser className="icons contact-view-icon" />
              <span className="card-texts">Existing Group</span>
            </div>
          </div>
        )}
      </div>

      {/* Show group existing modal    */}
      {showGroupModal && (
        <GroupModal onClose={() => setShowGroupModal(false)} />
      )}
      {/* Show new group modal    */}
      {showNewGroupModal && (
        <GroupModalnew onClose={() => setShowNewGroupModal(false)} />
      )}
      {/* show group list */}
      {showListPageModal && (
        <ListPage onClose={() => setShowListPageModal(false)} />
      )}
      {/* welcome popup */}
      {showPopup && (
        <div className="home-overlay overlay">
          <div className="home-modal">
            <button className="home-close-button" onClick={closePopup}>
              ✕
            </button>
            <h2>Welcome to Emailcon {user.username}!</h2>
            <p>Explore the features and manage your groups efficiently.</p>
          </div>
        </div>
      )}
      {/* Modal for Creating Campaign */}
      {showCampaignModal && (
        <div className="campaign-modal-overlay">
          <div className="campaign-modal-content">
            <h3>Create Campaign</h3>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="Enter Campaign Name"
              className="modal-input"
            />
            <button
              className="modal-create-button"
              onClick={handleCreateButton}
            >
              Create
            </button>
            <button
              onClick={() => setShowCampaignModal(false)}
              className="modal-create-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <SendbulkModal campaignName={campaignName} />

      <ToastContainer
        className="custom-toast"
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={true} // Disable progress bar
        closeOnClick={false}
        closeButton={false}
        pauseOnHover={true}
        draggable={true}
        theme="light" // Optional: Choose theme ('light', 'dark', 'colored')
      />
    </div>
  );
};

export default Home;