import React from "react";
import Lottie from "lottie-react";
import WaterLoading from "./lottiefiles/WaterLoading.json";

const WaterIsLoading = ({ style }) => {
  return (
    <center>
      <div style={{ height: "50px", ...style }}>
        <Lottie
          animationData={WaterLoading}
          style={{ height: "100px" }}
          loop={true}
          autoplay={true}
        />
      </div>
    </center>
  );
};
export default WaterIsLoading;
