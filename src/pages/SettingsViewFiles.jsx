import React, { useState, useEffect } from "react";
import "./MiddlePaneSettings.css";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Card from "./Card/Card";
import { Route } from "react-router-dom";
import Navigation from "../components/Navigation";
import SearchBar from "../components/SearchBar";
import {
  useTheme,
  useThemeUpdate,
  useMenuToggle,
  useMenuUpdateToggle,
} from "../contexts/themeContext";

// New

import moonIcon from "../assets/img/moon.svg";
import sunIcon from "../assets/img/sun.svg";
import MenuIcon from "@material-ui/icons/MenuRounded";
import sarvvid from "../assets/img/sarvvidLogo.svg";
import sarvvidDark from "../assets/img/sarvvidLogodark.svg";
import gridIcon from "../assets/img/grid.svg";
import gridDarkIcon from "../assets/img/griddark.svg";
import RainbowShadow from "../assets/img/rainbow_shadow.png";
import AccountIcon from "../assets/img/sample_userimg.png";
import { Height } from "@material-ui/icons";
import { getStorage } from "../utils/storageHandler";
import { Modal } from "@material-ui/core";
import axios from "axios";
import { useAlert } from "react-alert";
import { setStorage } from "../utils/storageHandler";
import Select from "react-select";
import Loader from "../components/Loader/Loader";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));
const SettingsViewFiles = () => {
  const darkTheme = useTheme();
  const toggleTheme = useThemeUpdate();
  const toggleMenu = useMenuToggle();
  const toggleBtn = useMenuUpdateToggle();
  const classes = useStyles();
  const current_plan = 0;
  const newAlert = useAlert();

  let userName = localStorage.getItem("user_name");
  let user_number = localStorage.getItem("user_number");

  const storageData = getStorage();

  const [usedStorage, setUsedStorage] = useState(0);
  const [unusedStorage, setUnusedStorage] = useState(0);
  const [remainingGB, setRemainingGB] = useState(0);
  const [totalStorage, setTotalStorage] = useState(0);
  const [usedStorageGb, setUsedStorageGb] = useState(0);
  const [openUpgrade, setOpenUpgrade] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCustomPlan, setCurrentCustomPlan] = useState("");
  const [customEmailSubject, setCustomEmailSubject] = useState(
    "Hey, I want to buy a custom plan for my company."
  );
  const [customEmailMessage, setCustomEmailMessage] = useState("");
  const [openCustom, setOpenCustom] = useState(false);
  const [profileImage, setProfileImage] = useState();

  const planOptions = [
    { value: "1TB", label: "1TB" },
    { value: "2TB", label: "2TB" },
    { value: "5TB", label: "5TB" },
    { value: "customPlan", label: "Custom plan" },
  ];

  useEffect(() => {
    setUsedStorage(storageData.used_gb);

    setUnusedStorage(storageData.rem_gb);

    setRemainingGB(storageData.rem_gb);

    setTotalStorage(
      parseFloat(localStorage.getItem("total_bytes")) / 1000000000
    );

    setUsedStorageGb(storageData.used_gb);

    // console.log("usedstorage...", usedStorage);
    // console.log("unusedstorage...", unusedStorage);
    // console.log("remainingGB...", remainingGB.toFixed(2));
    // console.log("totalStorage...", totalStorage);
    // console.log("usedStorageGb...", usedStorageGb.toFixed(2));
  });

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

  const handleImage = async (e) => {
    console.log("image...", e.target.files);
    // setProfileImage(e.target.files);
    // console.log("profile image...", profileImage);
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("uniqueID", localStorage.getItem("IMEI"));

    try {
      const resp = await axios({
        method: "post",
        url: "https://api.sarvvid-ai.com/update/u/profile/image",
        headers: {
          "Content-type": "multipart/form-data",
        },
        data: formData,
      });

      console.log("upload profile image resp...", resp);
      localStorage.setItem("avatar", resp.data.imgUri);
      newAlert.success(resp.data.message);
    } catch (error) {
      console.log("upload profile error...", error);
    }
  };

  return (
    <div
      className={`middlePane ${toggleMenu ? "" : "opened"} ${
        darkTheme ? "dark-theme" : ""
      }`}
    >
      {isLoading ? <Loader /> : ""}
      <div className="mobile_header" style={{ marginTop: "2rem" }}>
        <div
          className={`menu-btn ${toggleBtn ? "" : "opened"}`}
          onClick={() => toggleBtn()}
        >
          <MenuIcon
            style={{
              fontSize: "2rem",
              color: `${darkTheme ? "#fafafa" : "#000"}`,
            }}
          />
        </div>
        <div className="min_logo">
          {darkTheme ? (
            <img
              className="sarvvid_logo"
              src={sarvvidDark}
              alt="Sarvvid AI"
            ></img>
          ) : (
            <img className="sarvvid_logo" src={sarvvid} alt="Sarvvid AI"></img>
          )}
        </div>
        <div
          className={`min-theme-toggle ${darkTheme ? "dark" : ""}`}
          onClick={() => toggleTheme()}
        >
          <div className="min_theme_toggle">
            <img src={moonIcon} alt="mooon" />
            <img src={sunIcon} alt="sun" />
          </div>
        </div>
      </div>
      <h2 className="preference_title">Preferences ⚙</h2>

      <div className={`settings-container ${darkTheme ? "dark" : ""}`}>
        <div
          className="middlePane_cards_settings"
          style={{ background: `${darkTheme ? "#121212" : "#fff"}` }}
        >
          <div className="midPane-header_settings">
            <h3>Account</h3>
          </div>
          <div className="rightPane_user">
            <div className="user_info_settings">
              <div className="user_details_settings">
                <h3
                  style={{
                    color: `${darkTheme ? "#ccc" : "#11243d"}`,
                    fontSize: "1.2rem",
                  }}
                >
                  {userName}
                </h3>
                <h6 style={{ color: `${darkTheme ? "#aaa" : "#acacac"}` }}>
                  {user_number}
                </h6>
                <h6
                  style={{
                    textDecoration: "underline",
                    color: `${darkTheme ? "#aaa" : "#acacac"}`,
                  }}
                >
                  {/* Not you? Click here to change your account{" "} */}
                </h6>
              </div>
              <div className="user_avatar">
                <img
                  className="user_img"
                  src={localStorage.getItem("avatar")}
                  alt="account"
                />
                <label
                  htmlFor="imagePicker"
                  style={{
                    color: `${darkTheme ? "#aaa" : "#acacac"}`,
                    height: "max-content",
                    width: "max-content",
                    display: "block",
                    margin: 0,
                  }}
                >
                  <p className="change_link">Change avatar</p>
                  <input
                    id="imagePicker"
                    style={{ visibility: "hidden", width: "0%" }}
                    type="file"
                    onChange={(e) => {
                      handleImage(e);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div
          className="middlePane_cards_settings"
          style={{ background: `${darkTheme ? "#121212" : "#fff"}` }}
        >
          <div className="midPane-header_settings">
            <h3>Storage</h3>
          </div>
          <div className="settings_sec">
            <div className="user_info_settings">
              <div className="user_avatar">
                <h3 className="user_storage_data">
                  {" "}
                  {`${usedStorageGb.toFixed(2)} / ${totalStorage.toFixed(
                    2
                  )} GB `}
                </h3>
              </div>
              <div className="upgrade_btn">
                <button
                  className="storage_button"
                  onClick={() => setOpenUpgrade(true)}
                >
                  Upgrade plan
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="middlePane_cards_settings"
          style={{ background: `${darkTheme ? "#121212" : "#fff"}` }}
        >
          <div className="midPane-header_settings">
            <h3>Support</h3>
          </div>
          <div className="settings_sec">
            <div className="user_info_settings">
              <div className="user_details_settings">
                <h3 style={{ color: `${darkTheme ? "#ccc" : "#11243d"}` }}>
                  Contact Us
                </h3>
                <h6 style={{ color: `${darkTheme ? "#aaa" : "#acacac"}` }}>
                  Email: abc@123.com \n Phone: +91-9888888888
                </h6>
              </div>
              <div className="user_details_settings">
                <h3 style={{ color: `${darkTheme ? "#ccc" : "#11243d"}` }}>
                  For more information
                </h3>
                <h6
                  style={{
                    textDecoration: "underline",
                    color: `${darkTheme ? "#aaa" : "#acacac"}`,
                  }}
                >
                  Click here to view our privacy policy{" "}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="footer_msg"
        style={{ marginTop: "2rem", color: "#acacac" }}
      >
        <p>© Copyright Sarvvid™ 2022</p>
      </div>

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
              <div className="upgrade_plan_price" style={{ marginTop: "1rem" }}>
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
  );
};

export default SettingsViewFiles;
