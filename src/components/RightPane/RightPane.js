import React, { useState, useEffect } from "react";
import "./RightPane.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Chart } from "react-google-charts";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import TextField from "@material-ui/core/TextField";
import { withRouter } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from "../../constants/apiConstants";
import userGif from "../../assets/gif/user.gif";
import logoutGif from "../../assets/gif/logout.gif";
import upgradeGif from "../../assets/gif/upgrade.gif";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import { useSelector } from "react-redux";
import axios from "axios";

// New
// import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import { useAlert } from "react-alert";
import { PieChart } from "react-minimal-pie-chart";
import Select from "react-select";
import { getStorage, setStorage } from "../../utils/storageHandler";
import Loader from "../Loader/Loader";
import AccountIcon from "../../assets/img/account.svg";
import LogoutIcon from "../../assets/img/logout.svg";
import { useTheme } from "../../contexts/themeContext";
import imgIcon from "../../assets/img/image.svg";
import otherIcon from "../../assets/img/other.svg";
import documentIcon from "../../assets/img/document.svg";
import videoIcon from "../../assets/img/video.svg";
import audioIcon from "../../assets/img/audio.svg";
import imgDarkIcon from "../../assets/img/imagedark.svg";
import otherDarkIcon from "../../assets/img/otherdark.svg";
import documentDarkIcon from "../../assets/img/documentdark.svg";
import videoDarkIcon from "../../assets/img/videodark.svg";
import audioDarkIcon from "../../assets/img/audiodark.svg";

const chartOptions = {
  pieHole: 0.6,
  slices: [
    {
      // color: "#2BB673",
      color: "#6a41ea",
      // color: "black",
      // color: "#0f0",
      // offset: 0.05,
    },
    {
      color: "#f8228d",
      // color: "black",
      // color: "#05e395",
      offset: 0.1,
    },
  ],
  legend: {
    position: "none",
  },
  tooltip: {
    showColorCode: true,
  },
  // pieSliceBorderColor: "#343951",
  pieSliceBorderColor: "white",
  chartArea: {
    left: 10,
    top: 20,
    bottom: 10,
    width: "100%",
    height: "90%",
  },
  fontName: "Roboto",
  backgroundColor: "none",
  // title: "Storage",
};
const useUpgradeStyles = makeStyles((theme) => ({
  paper: {
    position: "relative",
    top: "5%",
    left: "7%",
    width: "66%",
    height: "90%",
    // backgroundColor: "#05e395",
    backgroundColor: "white",
    // backgroundImage: "linear-gradient(to bottom right,#00b3ff, #ecfaff )",
    // border: "2px solid #000",
    // boxShadow: "0 0 20px rgb(0, 195, 255)",
    borderRadius: "1%",
    padding: theme.spacing(2, 4, 3),
    color: "black",
    textAlign: "center",
  },
}));
// const useUpgradeCounterStyles = makeStyles((theme) => ({
//   root: {
//     "& .MuiTextField-root": {
//       margin: theme.spacing(1),
//       width: "25ch",
//       backgroundColor: "none",
//     },
//   },
// }));
const RightPane = (props) => {
  const [openUpgrade, setOpenUpgrade] = useState(false);
  const [openCustom, setOpenCustom] = useState(false);
  const [userAnim, setUserAnim] = useState(true);
  const [LogoutAnim, setLogoutAnim] = useState(true);
  const classesUpgrade = useUpgradeStyles();
  const current_plan = isNaN(props.b) ? 20 : props.b;
  const fileChange = useSelector((state) => state.fileSystem);
  const darkTheme = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [usedStorage, setUsedStorage] = useState(0);
  const [unusedStorage, setUnusedStorage] = useState(0);
  const [remainingGB, setRemainingGB] = useState(0);
  const [totalStorage, setTotalStorage] = useState(0);
  const [usedStorageGb, setUsedStorageGb] = useState(0);
  const [currentCustomPlan, setCurrentCustomPlan] = useState("");
  const [customEmailSubject, setCustomEmailSubject] = useState(
    "Hey, I want to buy a custom plan for my company."
  );
  const [customEmailMessage, setCustomEmailMessage] = useState("");

  const planOptions = [
    { value: "1TB", label: "1TB" },
    { value: "2TB", label: "2TB" },
    { value: "5TB", label: "5TB" },
    { value: "customPlan", label: "Custom plan" },
  ];

  const {
    imageCount,
    audioCount,
    videoCount,
    documentCount,
    othersCount,
    imageSize,
    audioSize,
    videoSize,
    documentSize,
    othersSize,
  } = useSelector((state) => state.storage);
  const storageData = getStorage();
  const newAlert = useAlert();

  useEffect(() => {
    setUsedStorage(storageData.used_gb);

    setUnusedStorage(storageData.rem_gb);

    setRemainingGB(storageData.rem_gb);

    setTotalStorage(
      parseFloat(localStorage.getItem("total_bytes")) / 1000000000
    );

    setUsedStorageGb(storageData.used_gb);
  });

  // useEffect(() => {
  //   Axios(
  //     `https://api.anteagle.tech/api/getdata/?ping=${localStorage.getItem(
  //       "ping"
  //     )}`,
  //     {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json, text/plain, */*", // It can be used to overcome cors errors
  //         "Content-Type": "application/json",
  //         Authtoken: localStorage.getItem("authtoken"),
  //       },
  //       data: JSON.stringify({
  //         IMEI: localStorage.getItem("IMEI"),
  //       }),
  //     }
  //   )
  //     .then((res) => {
  //       console.log(res);
  //       props.setA(
  //         ((res.data.current_storage * res.data.filled_per) / 100).toFixed(2)
  //       );
  //       props.setB(res.data.current_storage);
  //       localStorage.setItem(
  //         "used",
  //         isNaN(
  //           ((res.data.current_storage * res.data.filled_per) / 100).toFixed(2)
  //         )
  //           ? 0
  //           : ((res.data.current_storage * res.data.filled_per) / 100).toFixed(
  //               2
  //             ) *
  //               1000 *
  //               1000 *
  //               1000
  //       );
  //       localStorage.setItem(
  //         "total",
  //         isNaN(res.data.current_storage)
  //           ? 20 * 1000 * 1000 * 1000
  //           : res.data.current_storage * 1000 * 1000 * 1000
  //       );
  //     })
  //     .catch(() => {
  //       if (localStorage.getItem("used") == null)
  //         localStorage.setItem("used", 0);
  //       if (localStorage.getItem("total") == null)
  //         localStorage.setItem("total", 20 * 1000 * 1000 * 1000);
  //     });
  // }, [fileChange]);
  let used = isNaN(props.a) ? 100 : (props.a / props.b) * 100;
  let unused = isNaN(props.b) ? 0 : ((props.b - props.a) / props.b) * 100;

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  let title = capitalize(
    props.location.pathname.substring(1, props.location.pathname.length)
  );
  if (props.location.pathname === "/") {
    title = "Welcome";
  }

  // function renderLogout() {
  //   if (props.location.pathname === "/") {
  //     return (
  //       <div className="ml-auto">
  //         <button className="btn btn-danger" onClick={() => handleLogout()}>
  //           Logout
  //         </button>
  //       </div>
  //     );
  //   }
  // }
  function handleLogout() {
    localStorage.clear();

    props.history.push("/login");
  }

  // New

  let userName = localStorage.getItem("user_name");

  if (userName.length > 12) {
    userName = `${userName.slice(0, 18)}...`;
  }

  //helper function for displaying rzpay
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay(e, price) {
    setOpenUpgrade(false);
    setIsLoading(true);
    e.preventDefault();
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("razorpay SDK failed to load. Are you online?");
      setIsLoading(false);
      return;
    }

    var orderData = {
      planType: price,
      uniqueID: localStorage.getItem("IMEI"),
    };
    const result = await axios.post(
      "https://api.sarvvid-ai.com/payment/orders",
      orderData
    );

    console.log("payment orders...", result);

    if (!result) {
      alert("Server error, are you online?");
      return;
    }
    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: "rzp_test_12xfURrtE5J5vm", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "Sarvvid AI Incorporated.",
      description: "SarvvidBox storage upgrade",
      image: { logo: "https://i.imgur.com/WkCZuRi.webp" },
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          uniqueID: localStorage.getItem("IMEI"),
          planType: price,
        };

        const result = await axios.post(
          "https://api.sarvvid-ai.com/payment/success",
          data
        );

        console.log("Payment success...", result);

        const storageData = setStorage(
          result.data.used_bytes,
          result.data.updatedStorage
        );

        setUsedStorage(storageData.used_gb);

        setUnusedStorage(storageData.rem_gb);

        setRemainingGB(storageData.rem_gb);

        setTotalStorage(
          parseFloat(localStorage.getItem("total_bytes")) / 1000000000
        );

        setUsedStorageGb(storageData.used_gb);

        newAlert.success(result.data.message);
      },
      prefill: {
        name: "Sarvvid AI",
        email: "support@sarvvidai.com",
        contact: "9999999999",
      },
      notes: {
        address: "Sarvvid AI Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    console.log("razorpay...", res);
    if (res == true) {
      setIsLoading(false);
    }
  }

  const getSize = (fileSize) => {
    if (fileSize < 1000000) return `${(fileSize / 1000).toFixed(2)} kb`;
    else if (fileSize < 1000000000)
      return `${(fileSize / 1000000).toFixed(2)} mb`;
    else return `${(fileSize / 1000000000).toFixed(2)} gb`;
  };

  const handlePlans = (value) => {
    if (value.value === "customPlan") {
      setOpenCustom(true);
    } else {
      setCurrentCustomPlan(value);
    }
  };

  const sendCustomEmail = async () => {
    const data = {
      IMEI: localStorage.getItem("IMEI"),
      emailSubject: customEmailSubject,
      emailContent: customEmailMessage,
    };

    try {
      const result = await axios.post(
        "https://api.sarvvid-ai.com/customplan/quote",
        data
      );

      if (result.status === 200) {
        newAlert.success(result.data.message);
      }

      setOpenCustom(false);
      setOpenUpgrade(false);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  return (
    <div
      className="rightPane"
      style={{ background: `${darkTheme ? "#121212" : "#fff"}` }}
    >
      {isLoading ? <Loader /> : ""}
      <div className="rightPane_user">
        <div className="user_info">
          {localStorage.getItem("avatar") ? (
            <img src={localStorage.getItem("avatar")} alt="account" />
          ) : (
            <img src={AccountIcon} alt="account" />
          )}
          <div className="user_details">
            <h3 style={{ color: `${darkTheme ? "#ccc" : "#121212"}` }}>
              {userName}
            </h3>
            <h6 style={{ color: `${darkTheme ? "#aaa" : "#252525"}` }}>
              {localStorage.getItem("user_number")}
            </h6>
          </div>
        </div>
      </div>
      <hr />
      <div className="storage_detail">
        <div className="storage_detail_header">
          <div className="storage_detail_header1">
            <h2
              className="storage_detail_heading"
              style={{ color: `${darkTheme ? "#ccc" : "#121212"}` }}
            >
              Storage
            </h2>
            {/* <h3>SarvvidPro plan</h3> */}
          </div>
          <h4>{`${totalStorage.toFixed(0)} GB`}</h4>
        </div>
        {/* <Chart
          width={"100%"}
          height={"250px"}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={[
            ["Storage Status", "Size"],
            ["Used", usedStorage],
            ["Unused", unusedStorage],
          ]}
          options={chartOptions}
          rootProps={{ "data-testid": "1" }}
        /> */}
        <div style={{ width: "200px" }}>
          <PieChart
            data={[
              { title: "Used", value: usedStorage, color: "#6a41ea" },
              { title: "Unused", value: unusedStorage, color: "#f8228d" },
            ]}
            lineWidth={30}
            rounded={true}
            animate={true}
            animationDuration={1000}
          />
        </div>
        <p
          className="storage_total"
          style={{ color: `${darkTheme ? "#ccc" : "#121212"}` }}
        >
          {remainingGB.toFixed(2) + " GB"}
        </p>
        <p
          className="storage_detail_desc"
          style={{ color: `${darkTheme ? "#aaa" : "#252525"}` }}
        >
          {`${usedStorageGb.toFixed(2)} GB of ${totalStorage.toFixed(
            2
          )} GB used`}
        </p>
      </div>
      <div className="storage_btn_section">
        <button className="storage_button" onClick={() => setOpenUpgrade(true)}>
          Upgrade plan
        </button>
        <p>Upgrade your plan and get 50Gb</p>
      </div>
      <div className={`file_details_section ${darkTheme ? "dark" : ""}`}>
        <div className="file_detail">
          <div className="file_detail_name">
            <div className={`file_icon ${darkTheme ? "dark" : ""}`}>
              {darkTheme ? (
                <img src={documentDarkIcon} alt="documents" />
              ) : (
                <img src={documentIcon} alt="documents" />
              )}
            </div>
            <div className="file_details" style={{ marginLeft: "1.4rem" }}>
              <h4>Documents</h4>
              <p>{documentCount}</p>
            </div>
          </div>
          <div>
            <p className="file_detail_size">{getSize(documentSize)}</p>
          </div>
        </div>
        <div className="file_detail">
          <div className="file_detail_name">
            <div className={`file_icon ${darkTheme ? "dark" : ""}`}>
              {darkTheme ? (
                <img src={imgDarkIcon} alt="documents" />
              ) : (
                <img src={imgIcon} alt="documents" />
              )}
            </div>
            <div className="file_details">
              <h4>Images</h4>
              <p>{imageCount}</p>
            </div>
          </div>
          <div>
            <p className="file_detail_size">{getSize(imageSize)}</p>
          </div>
        </div>
        <div className="file_detail">
          <div className="file_detail_name">
            <div className={`file_icon ${darkTheme ? "dark" : ""}`}>
              {darkTheme ? (
                <img src={videoDarkIcon} alt="documents" />
              ) : (
                <img src={videoIcon} alt="documents" />
              )}
            </div>
            <div className="file_details">
              <h4>Videos</h4>
              <p>{videoCount}</p>
            </div>
          </div>
          <div>
            <p className="file_detail_size">{getSize(videoSize)}</p>
          </div>
        </div>
        <div className="file_detail">
          <div className="file_detail_name">
            <div className={`file_icon ${darkTheme ? "dark" : ""}`}>
              {darkTheme ? (
                <img src={audioDarkIcon} alt="documents" />
              ) : (
                <img src={audioIcon} alt="documents" />
              )}
            </div>
            <div className="file_details" style={{ marginLeft: "1.4rem" }}>
              <h4>Audios</h4>
              <p>{audioCount}</p>
            </div>
          </div>
          <div>
            <p className="file_detail_size">{getSize(audioSize)}</p>
          </div>
        </div>
        <div className="file_detail">
          <div className="file_detail_name">
            <div className={`file_icon ${darkTheme ? "dark" : ""}`}>
              {darkTheme ? (
                <img src={otherDarkIcon} alt="documents" />
              ) : (
                <img src={otherIcon} alt="documents" />
              )}
            </div>
            <div className="file_details">
              <h4>Other files</h4>
              <p>{othersCount}</p>
            </div>
          </div>
          <div>
            <p className="file_detail_size">{getSize(othersSize)}</p>
          </div>
        </div>
      </div>
      <div className="Detail-Modal">
        <Modal
          open={openUpgrade}
          onClose={() => {
            setOpenUpgrade(!openUpgrade);
          }}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          className="upgrade_modal"
          style={{ borderRadius: "40px" }}
        >
          <div className="modal_inner">
            <div className="div_upgrade_heading">
              <h2 id="simple-modal-title" className="upgradeStorageHeading">
                Upgrade your decentralized cloud
              </h2>
            </div>
            <div className="upgrade_plans_div">
              <div className="upgrade_plan_div">
                <div className="upgrade_plan_top">
                  <h2>SarvvidBasic</h2>
                  <h3>Free plan</h3>
                </div>
                <div className="upgrade_plan_mid1">
                  {/* <img src={UpgradeCircle20} alt="SarvvidBasic" /> */}
                  <div className="upgrade_plan_mid_text">
                    <p className="upgrade_plan_storage">20 GB</p>
                  </div>
                </div>
                <div className="upgrade_plan_bottom">
                  {/* features explainer */}
                  {/* <p style={{ margin: "2%" }}>Base Plan Includes:</p> */}
                  {/* <div className="upgrade_plan_description">
                    <CheckRoundedIcon className="upgrade_plan_tick" />
                    <span className="upgrade_plan_info">20 GB storage</span>
                  </div> */}
                </div>
                <div className="upgrade_plan_cta">
                  {/* button */}
                  {current_plan === 20 ? (
                    <button
                      type="button"
                      className="upgrade_plan_button"
                      disabled={true}
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button type="button" className="upgrade_plan_button">
                      Free
                    </button>
                  )}
                  <p style={{ fontSize: "12px" }}>*monthly plan</p>
                </div>
              </div>

              <div className="upgrade_plan_div">
                <div className="upgrade_plan_top">
                  <h2>SarvvidPlus</h2>
                  <h3>Advanced plan</h3>
                </div>
                <div className="upgrade_plan_mid2">
                  {/* <img src={UpgradeCircle100} alt="SarvvidPlus" /> */}
                  <div className="upgrade_plan_mid_text">
                    <p className="upgrade_plan_storage">100 GB</p>
                  </div>
                </div>

                <div className="upgrade_plan_bottom">
                  {/* features explainer */}
                  {/* <p style={{ margin: "2%" }}>Base Plan Includes:</p> */}
                  {/* <div className="upgrade_plan_description">
                    <CheckRoundedIcon className="upgrade_plan_tick" />
                    <span className="upgrade_plan_info">20 GB storage</span>
                  </div> */}
                </div>
                <div className="upgrade_plan_price">
                  <h4>&#x20B9;200 + 18% GST</h4>
                </div>
                <div className="upgrade_plan_cta">
                  {current_plan === 100 ? (
                    <button
                      type="button"
                      className="upgrade_plan_button"
                      disabled={true}
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="upgrade_plan_button"
                      onClick={(e) => displayRazorpay(e, "sarvvidPlus")}
                    >
                      Buy now
                    </button>
                  )}
                  <p style={{ fontSize: "12px" }}>*monthly plan</p>
                </div>
              </div>

              <div className="upgrade_plan_div">
                <div className="upgrade_plan_top">
                  <h2>SarvvidPro</h2>
                  <h3>Pro plan</h3>
                </div>
                <div className="upgrade_plan_mid3">
                  {/* <img src={UpgradeCircle200} alt="SarvvidPro" /> */}
                  <div className="upgrade_plan_mid_text">
                    <p className="upgrade_plan_storage">200 GB</p>
                  </div>
                </div>
                <div className="upgrade_plan_bottom">
                  {/* features explainer */}
                  {/* <p style={{ margin: "2%" }}>Base Plan Includes:</p>
                  <div className="upgrade_plan_description">
                    <CheckRoundedIcon className="upgrade_plan_tick" />
                    <span className="upgrade_plan_info">20 GB storage</span>
                  </div> */}
                </div>
                <div className="upgrade_plan_price">
                  <h4>&#x20B9;400 + 18% GST</h4>
                </div>
                <div className="upgrade_plan_cta">
                  {current_plan === 200 ? (
                    <button
                      type="button"
                      className="upgrade_plan_button"
                      disabled={true}
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="upgrade_plan_button"
                      onClick={(e) => displayRazorpay(e, "sarvvidPro")}
                    >
                      Buy now
                    </button>
                  )}
                  <p style={{ fontSize: "12px" }}>*monthly plan</p>
                </div>
              </div>

              <div className="upgrade_plan_div">
                <div className="upgrade_plan_top">
                  <h2>SarvvidMax</h2>
                  <h3>Enterprise plan</h3>
                </div>
                <div className="upgrade_plan_mid4">
                  {/* <img src={UpgradeCircle500} alt="SarvvidMax" /> */}
                  <div className="upgrade_plan_mid_text">
                    <p className="upgrade_plan_storage">500 GB</p>
                  </div>
                </div>
                <div className="upgrade_plan_bottom">
                  {/* features explainer */}
                  {/* <p style={{ margin: "2%" }}>Max Plan Includes:</p>
                  <div className="upgrade_plan_description">
                    <CheckRoundedIcon className="upgrade_plan_tick" />
                    <span className="upgrade_plan_info">100 GB storage</span>
                  </div> */}
                  {/* <div className="upgrade_plan_description">
                    <CheckRoundedIcon className="upgrade_plan_tick" />
                    <span className="upgrade_plan_info">
                      Access to Sarvvid experts
                    </span>
                  </div>
                  <div className="upgrade_plan_description">
                    <CheckRoundedIcon className="upgrade_plan_tick" />
                    <span className="upgrade_plan_info">
                      Option to add your family
                    </span>
                  </div>
                  <div className="upgrade_plan_description">
                    <CheckRoundedIcon className="upgrade_plan_tick" />
                    <span className="upgrade_plan_info">
                      Extra member benefits
                    </span>
                  </div> */}
                </div>
                <div className="upgrade_plan_price">
                  <h4>&#x20B9;1000 + 18% GST</h4>
                </div>
                <div className="upgrade_plan_cta">
                  {current_plan === 500 ? (
                    <button
                      type="button"
                      className="upgrade_plan_button"
                      disabled={true}
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="upgrade_plan_button"
                      onClick={(e) => displayRazorpay(e, "sarvvidMax")}
                    >
                      Buy now
                    </button>
                  )}
                  <p style={{ fontSize: "12px" }}>*monthly plan</p>
                </div>
              </div>
            </div>
            <hr />
            <div className="upgrade_plans_div2">
              <div className="upgrade_plan_div" style={{ height: "350px" }}>
                <div
                  className="upgrade_plan_top"
                  style={{ marginBottom: "1rem" }}
                >
                  <h2>SarvvidBusiness</h2>
                </div>

                <Select
                  options={planOptions}
                  value={currentCustomPlan}
                  onChange={(value) => handlePlans(value)}
                  placeholder="Choose plan"
                />
                {currentCustomPlan.value == "customPlan" && (
                  <textarea
                    name="message"
                    id="message"
                    cols="30"
                    rows="10"
                  ></textarea>
                )}
                <div
                  className="upgrade_plan_price"
                  style={{ marginTop: "1rem" }}
                >
                  <h4>
                    {`${
                      currentCustomPlan.value == "1TB"
                        ? "₹2000 + 18% GST"
                        : currentCustomPlan.value == "2TB"
                        ? "₹4000 + 18% GST"
                        : currentCustomPlan.value == "5TB"
                        ? "₹10000 + 18% GST"
                        : ""
                    }`}{" "}
                  </h4>
                </div>
                <div className="upgrade_plan_cta">
                  {current_plan === 500 ? (
                    <button
                      type="button"
                      className="upgrade_plan_button"
                      disabled={true}
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="upgrade_plan_button"
                      onClick={(e) =>
                        displayRazorpay(
                          e,
                          `sarvvidBusiness${currentCustomPlan.value}`
                        )
                      }
                    >
                      {currentCustomPlan.value == "customPlan"
                        ? "Submit"
                        : "Buy now"}
                    </button>
                  )}
                  <p style={{ fontSize: "12px" }}>*monthly plan</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          open={openCustom}
          onClose={() => {
            setOpenCustom(!openCustom);
          }}
          className="custom_modal"
        >
          <div className="custom_modal_inner">
            <div className="custom_input">
              <h4> Subject </h4>
              <input
                type="text"
                className="subject_input"
                value={customEmailSubject}
                onChange={(e) => setCustomEmailSubject(e.value)}
              />
            </div>
            <div className="custom_input">
              <h4> Message </h4>
              <textarea
                id=""
                cols="30"
                rows="10"
                className="message_input"
                placeholder="Please type your quote here"
                value={customEmailMessage}
                onChange={(e) => setCustomEmailMessage(e.value)}
              ></textarea>
            </div>
            <div className="upgrade_plan_cta" onClick={() => sendCustomEmail()}>
              <button className="upgrade_plan_button">Send</button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default withRouter(RightPane);
