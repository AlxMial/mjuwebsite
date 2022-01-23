import React from 'react';

const Switch = ({ isOn, handleToggle, onColor,float,disble }) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
        disabled={disble}
      />
      <label
        style={{ background: isOn && onColor,
            float: float  }}
        className="react-switch-label"
        htmlFor={`react-switch-new`}
      >
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default Switch;