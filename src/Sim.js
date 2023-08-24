import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Sim.css";
const Sim = () => {
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
    <div className="sim">
      <img className="sim-child" alt="" src="/vector-421.svg" />
      <div className="rectangle-container">
        <div className="frame-child3" onClick={onRectangleClick} />
        <div className="frame-child4" onClick={onRectangle1Click} />
        <b className="your-thoughts-are2">Your Thoughts Are Made Of Salt</b>
        <div className="frame-child5" onClick={onRectangle2Click} />
      </div>
      <div className="sim-item" />
      <div className="div3">
        <div className="ulw-node-2b555a4d-effa-944e-container">
          <div className="ulw-node-2b555a4d-effa-944e-2">
            <b className="about2">About</b>
          </div>
        </div>
        <img className="div-inner" alt="" src="/frame-5581.svg" />
      </div>
    </div>
  );
};

export default Sim;
