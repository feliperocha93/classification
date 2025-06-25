import { useEffect, useState } from "react";
import { classificationRequest } from "../api/classification";

export function CaptionedImage({ src, method }) {
  const [category, setCategory] = useState(null);

  useEffect(() => {
    setCategory(null);

    const getCategory = async () => {
      const response = await classificationRequest(method, src);
      setCategory(response.result);
    };

    getCategory();
  }, [src, method]);

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
