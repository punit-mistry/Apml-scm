import React, { useState } from "react";
import axios from "axios";

function WhatsAppSender({ DriverNumber }) {
  const [message, setMessage] = useState("");
  const [isScanned, setIsScanned] = useState(false);

  const handleScan = async () => {
    try {
      const response = await axios.get("http://localhost:3000/qrcode"); // Adjust the URL accordingly
      if (response.status === 200) {
        setIsScanned(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    try {
      let data = JSON.stringify({
        message: message,
        DriverNumber: DriverNumber,
      });
      console.log(data);
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/send-message",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          alert("Message sent successfully!");
        })
        .catch((error) => {
          console.log(error);
        }); // Adjust the URL accordingly
    } catch (error) {
      console.error(error.message);
      alert("Error sending message.");
    }
  };

  return (
    <div>
      {!isScanned ? (
        <div className="flex gap-5">
          <input
            type="text"
            placeholder="Send WhatsApp Message.."
            value={message}
            className=" w-60 border-2 border-black h-10 p-2 rounded-lg"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-green-600 p-2 rounded-lg text-white font-bold"
            onClick={handleSendMessage}
          >
            💬 Send Message
          </button>
        </div>
      ) : (
        <div>
          <p>Scan the QR code with WhatsApp:</p>
          <img
            src="http://localhost:3000/qrcode"
            alt="QR Code"
          />
          <button onClick={handleScan}>Scan QR Code</button>
        </div>
      )}
    </div>
  );
}

export default WhatsAppSender;
