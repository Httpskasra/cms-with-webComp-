import React from "react";

export const Button_raw = () => {
  const [Name, setName] = React.useState("test");

  return (
    <div style={{ color: "red" }}>
      <input type="text " onChange={(e) => setName(e.target.value)} />
      {Name}
    </div>
  );
};
