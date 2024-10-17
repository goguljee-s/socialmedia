import React, { useContext } from 'react'
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { DataContext } from '../../contexts/ContextProvider';
function Dropdownmenu({ menuItems, active,position }) {
  const {close } = useContext(DataContext);
  return (
    <div
      className={active ? "menu-container mactive" : "menu-container"}
      style={{
        top: position.top,
        left: 0,
      }}
    >
      <div className="menu">
        <div className="close-cp">
          <button className="cls-cpbtn" onClick={() => close("menu")}>
            <CloseSharpIcon />
          </button>
        </div>
        <div className="menuItems">
          {menuItems.map((btn) => (
            <div key={btn.name}>
              <button onClick={btn.function}>{btn.name}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dropdownmenu