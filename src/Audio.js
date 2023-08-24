import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Audio1.css";
const Audio1 = () => {
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
    <div className="audio">
      <img className="audio-child" alt="" src="/vector-42.svg" />
      <div className="rectangle-group">
        <div className="rectangle-div" onClick={onRectangleClick} />
        <div className="frame-child1" onClick={onRectangle1Click} />
        <b className="your-thoughts-are1">Your Thoughts Are Made Of Salt</b>
        <div className="frame-child2" onClick={onRectangle2Click} />
      </div>
      <div className="audio-item" />
      <div className="div2">
        <div className="ulw-node-2b555a4d-effa-944e-wrapper">
          <div className="ulw-node-2b555a4d-effa-944e-1">
            <b className="about1">About</b>
          </div>
        </div>
        <img className="div-item" alt="" src="/frame-558.svg" />
      </div>
    </div>
  );
};

export default Audio1;
