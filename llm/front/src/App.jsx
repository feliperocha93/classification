import { useEffect, useState } from "react";
import "./App.css";

function CaptionedImage({ src, method }) {
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const getCategory = async () => {
      const response = await fetch("http://localhost:3000/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method,
          path: src,
        }),
      }).then((res) => res.json());

      setCategory(response.result);
    };

    getCategory();
  }, [src]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h2 style={{ color: "gray" }}>It's a {category || "..."}</h2>
      <img
        src={src}
        alt={category}
        style={{ height: "350px", marginTop: "20px", borderRadius: "10px" }}
      />
    </div>
  );
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [imgSrc, setImgSrc] = useState();
  const [method, setMethod] = useState("llm");

  function classifyImage() {
    setImgSrc(inputValue);
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
          value={method}
          onChange={(e) => setMethod(e.target.value)}
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
