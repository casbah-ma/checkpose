import { useState, useEffect } from "react";

export default function useKeyPress(targetKey) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);
  let prevKey = "";

  // If pressed key is our target key then set to true
  function downHandler({ key }) {
    // checking keep pressing re-rendering
    if (prevKey === targetKey) return;

    if (key === targetKey) {
      setKeyPressed(true);
      prevKey = key;
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
      prevKey = "";
    }
  };
  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}