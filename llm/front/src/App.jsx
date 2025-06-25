import { useState } from "react";
import { CaptionedImage } from "./components/CaptionedImage";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("llm");
  const [imgSrc, setImgSrc] = useState();
  const [method, setMethod] = useState("llm");

  function classifyImage() {
    setImgSrc(inputValue);
    setMethod(selectValue);
  }

  return (
    <>
      <h1>Cat or Dog</h1>

      <input
        type="text"
        style={{ width: "100%", marginBottom: "10px" }}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="method">Method:</label>
        <select
          id="method"
          value={selectValue}
          onChange={(e) => setSelectValue(e.target.value)}
        >
          <option value="knn">KNN</option>
          <option value="llm">LLM</option>
        </select>
      </div>
      <button onClick={classifyImage}>Classify!</button>
      {imgSrc && <CaptionedImage src={imgSrc} method={method} />}
    </>
  );
}

export default App;
