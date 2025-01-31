import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SendbulkModal.css";
import apiConfig from "../apiconfig/apiConfig";
// import { useNavigate } from "react-router-dom";

const SendbulkModal = ({ isOpen, onClose, previewContent = [],bgcolor}) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewtext, setPreviewtext] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const campaign = JSON.parse(localStorage.getItem("campaign"));
  // const navigate=useNavigate();



  useEffect(() => {
    if (isOpen) {
      console.log("PreviewContent in SendbulkModal:", previewContent); // Log to verify
    }
  }, [isOpen, previewContent]);

  // Fetch groups on modal open
  useEffect(() => {
    if (isOpen) {
      axios
        .get(`${apiConfig.baseURL}/api/stud/groups/${user.id}`)
        .then((response) => setGroups(response.data))
        .catch((error) => {
          console.error("Error fetching groups:", error);
          toast.error("Failed to fetch groups.");
        });
    }
  }, [isOpen,user]);
 const handleSend = async () => {
  if (!selectedGroup || !message || !previewtext) {
    toast.warning("Please select a group and enter a message and previewtext.");
    return;
  }

  if (!previewContent || previewContent.length === 0) {
    toast.warning("No preview content available.");
    return;
  }

  setIsProcessing(true);

  try {
    const studentsResponse = await axios.get(
      `${apiConfig.baseURL}/api/stud/groups/${selectedGroup}/students`
    );
    const students = studentsResponse.data;

    if (students.length === 0) {
      toast.warning("No students found in the selected group.");
      setIsProcessing(false);
      return;
    }
let sentCount=0;
    for (const student of students) {
      const personalizedContent = previewContent.map((item) => {
        const personalizedItem = { ...item };

        if (item.content) {
          Object.entries(student).forEach(([key, value]) => {
            const placeholderRegex = new RegExp(`\\{?${key}\\}?`, 'g'); // Handles both {placeholder} and placeholder
            const cellValue = value != null ? String(value).trim() : ''; // Gracefully handle null/undefined
            personalizedItem.content = personalizedItem.content.replace(placeholderRegex, cellValue);
          });
        }
        return personalizedItem;
      });

      const emailData = {
        recipientEmail:student.Email, // Assuming 'Email' is a key in the student object
        subject: message,
        body: JSON.stringify(personalizedContent),
        bgcolor,
        previewtext,
        userId:user.id,
      };

      console.log("Sending email data:", emailData); // Debugging info
      await axios.post(`${apiConfig.baseURL}/api/stud/sendbulkEmail`, emailData);
      sentCount++;
    }

    // Store campaign history after sending emails
     const campaignHistoryData = {
      campaignname: campaign.camname,
      groupname: groups.find(group => group._id === selectedGroup)?.name, // Get the group name from the groups array
      totalcount: students.length,
      sendcount: sentCount, // Now correctly tracking sent emails
      senddate: new Date().toLocaleString(), // Format date and time
      user: user.id,
    };


    await axios.post(`${apiConfig.baseURL}/api/stud/camhistory`, campaignHistoryData);


    toast.success("Emails sent successfully!");
    setTimeout(() => {
      setSelectedGroup("");
      setMessage("");
      setPreviewtext("");
      setIsProcessing(false);
      onClose();
      // navigate('/home')
    }, 5000);
  } catch (error) {
    console.error("Error sending emails:", error);
    toast.error("Failed to send emails.");
    setIsProcessing(false);
  }
};


  if (!isOpen) return null;

  return (
    <div className="send-modal-overlay">
      <div className="send-modal-content">
        <button className="send-modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Send Bulk Mail</h2>
        <div className="send-modal-form">
          <label htmlFor="group-select">Select Group:</label>
          <select
            id="group-select"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">-- Select Group --</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
          <label htmlFor="message-input">Subject:</label>
          <textarea
            id="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here"
          />
           <label htmlFor="message-input">Preview Text:</label>
          <textarea
            id="message-input"
            value={previewtext}
            onChange={(e) => setPreviewtext(e.target.value)}
            placeholder="Enter your Previewtext here"
          />
          <button
            className="send-modal-submit-btn"
            onClick={handleSend}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Send Mail"}
          </button>
        </div>
      </div>
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
};

export default SendbulkModal;
