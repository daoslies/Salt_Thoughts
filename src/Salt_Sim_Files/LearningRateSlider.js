import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import "./LearningRateSlider.css"; // Import the CSS file

const LearningRateSlider = ({ learningRate, setLearningRate }) => {
  
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [learningRateButtonColor, setLearningRateButtonColor] = React.useState('primary');


  const handleSetLearningRateClick = () => {
    setIsSliderOpen(!isSliderOpen);
    setLearningRateButtonColor(learningRateButtonColor === 'primary' ? 'secondary' : 'primary');
  };

  return (
    <div>
      <Button variant="contained" 
        color={learningRateButtonColor} 
        onClick={handleSetLearningRateClick}>

          {isSliderOpen ? "Close Slider" : "Set Learning Rate"}

      </Button>

      {isSliderOpen && (
        <div className="slider-container">
          <Slider
            value={Math.log10(learningRate)}
            onChange={(event, newValue) => {
                setLearningRate(10 ** newValue);
            }}
            step={0.01}
            min={Math.log10(0.0000000001)}
            max={Math.log10(10)}
            marks={[
                { value: Math.log10(0.0000000001), label: "0.0000000001" },
                { value: Math.log10(0.0001), label: "0.0001" },
                { value: Math.log10(1), label: "1" },
                { value: Math.log10(10), label: "10" },
            ]}
            />
        </div>
      )}
      <p style={{ textAlign: "center" }}>Learning rate: {learningRate.toFixed(10)}</p>
    </div>
  );
};

export default LearningRateSlider;
