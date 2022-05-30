import React from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/Lotties/download.json";
import "./lottie.css";

const DownloadLottie = () => {
  const animationOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };

  return (
    <div className="lottie">
      <Lottie options={animationOptions} height={70} width={70} />
    </div>
  );
};

export default DownloadLottie;
