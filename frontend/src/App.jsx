import React, { useState } from "react";
import "./styles.css";
import { FaMicrophone as MicrophoneIcon } from "react-icons/fa";
import { IoMdImage as ImageIcon } from "react-icons/io";

function App() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleGenerate = async () => {
    const formData = new FormData();
    formData.append("prompt", prompt);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.response) {
        setAnswer(data.response);
      } else if (data.error) {
        setAnswer("Error: " + JSON.stringify(data.error));
      }
    } catch (error) {
      setAnswer("Error contacting backend: " + error.message);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["image/", "audio/"];
      if (validTypes.some((type) => file.type.startsWith(type))) {
        setSelectedFile(file);
      } else {
        alert("Please upload a valid image or audio file.");
      }
    }
  };

  return (
    <div className="container">
      <div className="topBar">
        <button className="historyButton" onClick={() => alert("History not implemented")}>
          History
        </button>
        <button className="logoutButton" onClick={() => alert("Logout logic here")}>Logout</button>
      </div>

      <div className="header">Hello</div>
      <div className="subHeader">
        <span>How can</span> I assist you today?
      </div>

      <div className="promptBox">
        <div className="inputIcons">
          <label htmlFor="fileUpload" className="iconButton">
            <MicrophoneIcon size={20} color="#81d4fa" />
          </label>
          <label htmlFor="fileUpload" className="iconButton">
            <ImageIcon size={20} color="#81d4fa" />
          </label>
          <input
            type="file"
            id="fileUpload"
            accept="audio/*,image/*"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
        </div>
        <input
          type="text"
          placeholder="Enter a prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        />
        <button className="generateButton" onClick={handleGenerate}>
          Generate
        </button>
      </div>

      <div className="answerBox">{answer}</div>
      <div className="footer">Powered by Groq</div>
    </div>
  );
}

export default App;