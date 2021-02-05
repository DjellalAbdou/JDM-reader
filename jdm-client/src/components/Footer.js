import React from "react";
import magnet from "../assets/magnet.png";
import Colors from "../constants/Colors";
import { Heart } from "react-feather";

export default function Footer() {
    return (
        <div className="footerContainer">
            <div>
                The application was created/bootstraped with nodejs in the
                backend and react for the front
            </div>
            <div className="logoFooterContainer">
                <img src={magnet} width={50} alt="magnet icon" />
            </div>
            <div className="love">
                <p>made with</p>
                <Heart size={16} strokeWidth="3" color={Colors.$roze} />
                <p>by per5u5</p>
            </div>
        </div>
    );
}
