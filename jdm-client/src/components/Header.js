import React, { Component } from "react";
import logo from "../assets/magnet.png";

export default class Header extends Component {
    render() {
        return (
            <>
                <div className="navbar">
                    <img src={logo} width={40} alt="no logo" />
                    <h1>JDM Reader Magnet</h1>
                </div>
                <div className="background-bar" />
            </>
        );
    }
}
