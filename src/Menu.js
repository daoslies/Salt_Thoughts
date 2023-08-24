import "./Menu.css";

import Dyanmic_Menu_Elements from "./Dynamic_Menu_Elements";

const Menu = () => {
  return (
    <div className="menu">
      <img className="menu-child" alt="" />
      <div className="rectangle-parent">
        <b className="your-thoughts-are">Your Thoughts Are Made Of Salt</b>
      </div>


      <Dyanmic_Menu_Elements/>



      <div className="footer">
        <img className="div-child" alt="" />
        <div className="ulw-node-2b555a4d-effa-944e-">
          <b className="about">About</b>
        </div>
      </div>
    </div>
  );
};

export default Menu;
