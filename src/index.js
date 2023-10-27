import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ChapterText from "./Your_Thoughts_Are_Made_Of_Salt_The_Machine_1";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <div className="book" id="bookcheck">
      <div
        className="chapter-text"
        style={{ whiteSpace: "pre-wrap" }}
        dangerouslySetInnerHTML={{ __html: ChapterText }}
        onMouseDown={(e) => e.stopPropagation()}
      />
    </div>
  </React.StrictMode>
);

export { root };

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
