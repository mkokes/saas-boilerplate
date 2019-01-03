import React from "react";
import Nav from "../components/nav";

const Header = ({ children }) => (
  <div className="container">
    <Nav />
    {children}
  </div>
);
export default Header;
