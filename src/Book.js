import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Book.css";
const Book = () => {
  const navigate = useNavigate();

  const onRectangleClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onRectangle1Click = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onRectangle2Click = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="book">
      <img className="book-child" alt="" src="/vector-422.svg" />
      <div className="frame-div">
        <div className="frame-child6" onClick={onRectangleClick} />
        <div className="frame-child7" onClick={onRectangle1Click} />
        <b className="your-thoughts-are3">Your Thoughts Are Made Of Salt</b>
        <div className="frame-child8" onClick={onRectangle2Click} />
      </div>
      <div className="book-item" />
      <div className="div4">
        <div className="ulw-node-2b555a4d-effa-944e-frame">
          <div className="ulw-node-2b555a4d-effa-944e-3">
            <b className="about3">About</b>
          </div>
        </div>
        <img className="frame-icon" alt="" src="/frame-5582.svg" />
      </div>
    </div>
  );
};

export default Book;
