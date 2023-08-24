import React from 'react';

import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';


export default function ToggleSwitch({ onInputAndOrStateChange, onOutputAndOrStateChange }) {
  const [inputAndOrState, setInputAndOrState] = React.useState(false);
  const [outputAndOrState, setOutputAndOrState] = React.useState(false);

  const handleInputAndOrStateChange = event => {
    setInputAndOrState(event.target.checked);
    onInputAndOrStateChange(event.target.checked);
  };

  const handleOutputAndOrStateChange = event => {
    setOutputAndOrState(event.target.checked);
    onOutputAndOrStateChange(event.target.checked);
  };

  return (
    <div>
      <FormControlLabel
        control={
          <Switch
            checked={inputAndOrState}
            onChange={handleInputAndOrStateChange}
            color="primary"
            size="medium"
          />
        }
        label="And/Or Input"
      />
      <FormControlLabel
        control={
          <Switch
            checked={outputAndOrState}
            onChange={handleOutputAndOrStateChange}
            color="primary"
            size="medium"
          />
        }
        label="And/Or Output"
      />
    </div>
  );
}