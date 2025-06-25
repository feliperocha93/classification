import { useState } from "react";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [imgSrc, setImgSrc] = useState(0);

  function classifyImage() {
    setImgSrc(inputValue);
  }

  return (
    <>
      <h1>Cat or Dog</h1>
      <input
        type="text"
        style={{ width: "100%" }}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={classifyImage}>Cat or Dog</button>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={imgSrc}
          style={{ width: "100%", height: "auto", marginTop: "10px" }}
        />
        <span>Caption</span>
      </div>
    </>
  );
}

export default App;
