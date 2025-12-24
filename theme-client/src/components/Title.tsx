// import React from "react";
import { useState } from "react";
export const TitleComp = () => {
  const [Title, setTitle] = useState("test");

  return (
    <div style={{ color: "blue" }}>
      <input
        type="text "
        onChange={(e) => setTitle(e.target.value)}
        className="border"
      />
      <h1>{Title}</h1>
    </div>
  );
};
