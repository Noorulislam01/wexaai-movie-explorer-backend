import React from "react";

export default function StatePanel({ title, description }) {
  return (
    <div className="state-panel">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
