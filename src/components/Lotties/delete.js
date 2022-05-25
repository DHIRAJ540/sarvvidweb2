import React from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/Lotties/delete.json";
import "./lottie.css";

const DeleteLottie = () => {
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

export default DeleteLottie;
