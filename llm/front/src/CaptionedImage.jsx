import { useEffect, useState } from "react";

export function CaptionedImage({ src, method }) {
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
