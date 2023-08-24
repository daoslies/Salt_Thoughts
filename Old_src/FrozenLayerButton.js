import React, { useState } from "react";
import Button from "@mui/material/Button";

function FrozenLayerButton({ layerIndex, x_position, setfrozenLayers }) {

  console.log('Freezee', layerIndex)

  const [isFrozen, setIsFrozen] = useState(false);


  function handleFrozenLayerButtonClick() {
    setIsFrozen(!isFrozen);
    if (!isFrozen) {
        setfrozenLayers((prev) => [...prev, layerIndex]);
      }
    if (isFrozen) {
        setfrozenLayers((prev) => prev.filter((layer) => layer !== layerIndex));
    }
  }

  return (
    <div key={layerIndex} style={{ position: "absolute", left: x_position + 'px' }}>
      <Button
        variant="contained"
        color={isFrozen ? "secondary" : "primary"}
        onClick={() => handleFrozenLayerButtonClick(layerIndex)}
      >
        {isFrozen ? "Frozen" : "Freeze"}
      </Button>
    </div>
  );
}

export default FrozenLayerButton;
