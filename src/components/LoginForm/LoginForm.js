import React, { useState, useMemo } from "react";
import axios from "axios";
import "./LoginForm.css";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../../constants/apiConstants";
import { withRouter } from "react-router-dom";
import md5 from "md5";
import sarvvid from "../../assets/img/sarvvid.png";
import loginbg from "../../assets/img/loginbg.png";
import QRCode from "react-qr-code";
import Backdrop from "@material-ui/core/Backdrop";
import QRC from "./QRC/QRC.js";
import Navbar from "../Navbar/Navbar";
import logo from "../../assets/img/sarvvid-logo.svg";
import sarvvidIcon from "../../assets/img/sarvvid_logo_notext.svg";
import sarvvidLogo from "../../assets/img/sarvvid-logo.svg";
import qrCodeIcon from "../../assets/img/qr_icon.svg";

import { motion, useAnimation } from "framer-motion";

// NEW ONES
import { useDispatch } from "react-redux";
import { updateAllDataInfo } from "../../actions/allData";
import { getStorage, setStorage } from "../../utils/storageHandler";
import { v4 as uuid } from "uuid";
import { sha256 } from "js-sha256";
import { setEntry } from "../../actions/fileSystem";
import { Modal } from "@material-ui/core";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import countryList from "react-select-country-list";
import Select from "react-select";
import { useAlert } from "react-alert";

const crypto = require("crypto");
const platform = require("platform");
let countriesInfo = require("countries-information");
const browser = platform.name + platform.version;

const QRvalue = JSON.stringify({
  "browser-name": browser,
  timestamp: new Date(),
});

const Hash = crypto.createHash("sha256").update(QRvalue).digest("hex");

function LoginForm(props) {
  const [state, setState] = useState({
    email: "",
    authtoken: "",
    piid: "",
    successMessage: null,
  });
  const [err, showerr] = useState(false);
  const [aerr, showautherr] = useState(false);
  const [dis, setdis] = useState(false);
  const [countryValue, setCountryValue] = useState({
    value: "IN",
    label: "India",
  });
  const [countryCode, setCountryCode] = useState("+91");

  const countryOptions = useMemo(() => countryList().getData(), []);

  const countryChangeHandler = (value) => {
    setCountryValue(value);
    console.log("country value...", value);
    console.log(
      countriesInfo.getCountryInfoByCode(value.value).countryCallingCodes[0]
    );
    setCountryCode(
      countriesInfo.getCountryInfoByCode(value.value).countryCallingCodes[0]
    );
  };

  const dispatch = useDispatch();
  const alert = useAlert();

  // const [QR, setQR] = useState(false);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // const handleQRCode = () => {
  //   setQR(!QR);
  // };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    const payload = {
      email: state.email,
      password: state.password,
    };
    console.log(state.email);
    console.log(state.authtoken);
    console.log(state.piid);
    if (state.authtoken.trim() == "" || state.piid.trim() == "") {
      showerr(true);
      showautherr(false);
    } else if (state.authtoken.length < 40 || state.authtoken.length > 40) {
      showautherr(true);
      showerr(false);
    } else {
      showautherr(false);
      showerr(false);
      localStorage.setItem("authtoken", state.authtoken);
      localStorage.setItem("ping", state.piid);
      localStorage.setItem("IMEI", state.email);
      axios
        .post(
          `https://api.sarvvid-ai.com/login?IMEI=${state.email}&ping=${state.piid}`,
          {
            Accept: "application/json, text/plain, */*",
            Authtoken: state.authtoken, // It can be used to overcome cors errors
            "Content-Type": "application/json",
            verificationToken: enc,
          }
        )
        .then(function (response) {
          console.log(response.data);
          if (response.data.code === 200) {
            const temp = response.data.data;
            var new_data = JSON.parse(localStorage.getItem("fileSystem"));
            var newEntry = {};
            newEntry.name = "SarvvidBox";
            newEntry.type = "__folder__";
            newEntry.creatorName = "";
            newEntry.size = 0;
            newEntry.path = "/SarvvidBox";
            newEntry.parentPath = "/";
            newEntry.children = [];
            newEntry.date = "";
            newEntry.parentID = md5("/" + "__folder__");
            const id_1 = md5("/SarvvidBox" + "__folder__");
            new_data[id_1] = newEntry;
            let i = 0;
            for (i = 0; i < temp.length; i++) {
              var newEntry_1 = {};
              newEntry_1.name = temp[i];
              newEntry_1.type = "__file__";
              newEntry_1.creatorName = "";
              newEntry_1.size = 0;
              newEntry_1.path = "/SarvvidBox/" + temp[i];
              newEntry_1.parentPath = "/SarvvidBox";
              newEntry_1.parentID = md5("/SarvvidBox" + "__folder__");
              newEntry_1.date = "";
              new_data[md5("/SarvvidBox/" + temp[i] + "__file__")] = newEntry_1;
              new_data[md5("/SarvvidBox" + "__folder__")].children.push(
                md5("/SarvvidBox/" + temp[i] + "__file__")
              );
            }
            console.log(new_data);
            localStorage.setItem("fileSystem", JSON.stringify(new_data));
            console.log("dfuysdgfuysdgfuysdgfsdfsdyfsyfds HI I am IN");
            setState((prevState) => ({
              ...prevState,
              successMessage: "Login successful. Redirecting to home page..",
            }));
            localStorage.setItem(ACCESS_TOKEN_NAME, 1);
            redirectToHome();
            props.showError(null);
          } else if (response.code === 204) {
            props.showError("Username and password do not match");
          } else {
            props.showError("Username does not exists");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const redirectToHome = () => {
    props.updateTitle("Home");
    props.history.push("/");
  };

  const redirectToRegister = () => {
    props.history.push("/register");
    props.updateTitle("Register");
  };

  // NEW ONES

  // ENC key
  let SCHT = {
    0: "92a2",
    1: "0f11",
    2: "0cf1",
    3: "6955",
    4: "7779",
    5: "e171",
    6: "0b6a",
    7: "751a",
    8: "713f",
    9: "c939",
    A: "73c5",
    B: "d832",
    C: "d6d3",
    D: "d289",
    E: "a703",
    F: "603f",
    G: "77d8",
    H: "4fc8",
    I: "85d1",
    J: "de77",
    K: "8788",
    L: "3042",
    M: "48d5",
    N: "1c41",
    O: "c396",
    P: "84f8",
    Q: "f40c",
    R: "c78e",
    S: "3494",
    T: "089f",
    U: "c19a",
    V: "a66f",
    W: "41df",
    X: "a82f",
    Y: "9723",
    Z: "b7c0",
  };

  let key =
    "541DBC699AD251F68C3C55A86C147CFD7C6D2E90BE9E170507B153560C8A65AAAFB2BB839B16F9DED96A41FE15406FEC0116BFDD7BCF7F27B827F2E047E8196DDF03E3A7C6364FD6626041CB8B8133051D969DC67E7ED6EF0944DE6A0BC96443225EE15C60AC49C17EEFA5AF3E54FECB19FD1573BF94C9D5198DB816FC814EF3";
  let enc = "";
  let i = 0;
  for (i = 0; i < key.length; i++) {
    enc += SCHT[key.slice(i, i + 1)];
  }

  // States
  const [loginOpened, setLoginOpened] = useState(false);
  const [splashOpened, setSplashOpened] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass] = useState("");
  const [userPh, setUserPh] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userCPass, setUserCPass] = useState("");
  const [validPhone, setValidPhone] = useState(false);
  const [validPass, setValidPass] = useState(false);

  // Functions

  const validatePhone = (value) => {
    setUserPh(value);

    const phRegx = /^[0-9]{10}$/;

    if (value.match(phRegx)) {
      setValidPhone(true);
    } else {
      setValidPhone(false);
    }
  };

  const validatePass = (value) => {
    const passRegx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    if (value.match(passRegx)) {
      setValidPass(true);
    } else {
      setValidPass(false);
    }
  };

  // clear credentials

  const clearCredentials = () => {
    setUserEmail("");
    setUserPass("");
    setUserCPass("");
    setUserPh("");
  };

  // check empty inputs

  const checkEmpty = () => {
    return (
      userPh != "" && userPass != "" && userEmail != "" && countryCode != ""
    );
  };

  // forgot password

  const forgotPassHandler = async (e) => {
    e.preventDefault();

    try {
      const resp = await axios({
        method: "post",
        url: "https://api.sarvvid-ai.com/forgetpassword",
        headers: { verificationtoken: enc },
        data: {
          email: userEmail,
        },
      });

      console.log("forgot pass resp...", resp);
      setForgotMessage(resp.data.message);
      setCurrentScreen("forgotpasssuccess");

      setModalOpen(false);
    } catch (error) {
      console.log("forgotpass error...", error);
      setCurrentScreen("loginerror");
      if (error.response) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg(
          "We are having some network issues, try again after sometime"
        );
      }
    }

    clearCredentials();
  };

  // register through sarvvid-web

  const registerWeb = async (e) => {
    e.preventDefault();

    if (checkEmpty()) {
      if (validPhone) {
        try {
          console.log("register started...");

          // console.log("user Pass...", userPass);
          // console.log("user Mail...", userEmail);
          // console.log("user Phone...", userPh);
          console.log("user code...", countryCode);

          const userId = sha256(userEmail).slice(0, 24);
          // console.log("user ID...", userId);

          const resp = await axios({
            method: "post",
            url: `https://api.sarvvid-ai.com/webregister`,
            headers: { verificationToken: enc },
            data: {
              email: userEmail,
              password: userPass,
              phone: userPh,
              uniqueID: userId,
              countryCode: countryCode,
            },
          });

          const msresp = await axios({
            method: "get",
            url: `https://api.sarvvid-ai.com/ms?ms=${130}&IMEI=${userId}`,
          });

          console.log("signup resp...", resp);

          if (resp.data.status === 200) {
            console.log("Signed up successfully");
            console.log("file sytem...", resp.data.filesys);

            localStorage.setItem("IMEI", resp.data.IMEI);
            localStorage.setItem("authtoken", resp.data.authtoken);
            localStorage.setItem("ping", 130);
            localStorage.setItem("user_name", resp.data.username);
            localStorage.setItem("user_number", resp.data.phone);
            localStorage.setItem("filled_per", resp.data.storageFilled);
            // localStorage.setItem("remaining_per", resp.data.storageRemain);

            const temp = resp.data.data;

            let new_fileSystem = resp.data.filesys;
            localStorage.setItem("fileSystem", JSON.stringify(new_fileSystem));
            localStorage.setItem(
              "recycleBin",
              JSON.stringify(resp.data.recycleBin)
            );
            var new_data = JSON.parse(localStorage.getItem("fileSystem"));
            var newEntry = {};
            newEntry.name = "SarvvidBox";
            newEntry.type = "__folder__";
            newEntry.creatorName = "";
            newEntry.size = 0;
            newEntry.path = "/SarvvidBox";
            newEntry.parentPath = "/";
            newEntry.children = [];
            newEntry.date = "";
            newEntry.parentID = md5("/" + "__folder__");
            const id_1 = md5("/SarvvidBox" + "__folder__");
            new_data[id_1] = newEntry;
            let i = 0;
            for (i = 0; i < temp.length; i++) {
              var newEntry_1 = {};
              newEntry_1.name = temp[i];
              newEntry_1.type = "__file__";
              newEntry_1.creatorName = "";
              newEntry_1.size = 0;
              newEntry_1.path = "/SarvvidBox/" + temp[i];
              newEntry_1.parentPath = "/SarvvidBox";
              newEntry_1.parentID = md5("/SarvvidBox" + "__folder__");
              newEntry_1.date = "";
              new_data[md5("/SarvvidBox/" + temp[i] + "__file__")] = newEntry_1;
              new_data[md5("/SarvvidBox" + "__folder__")].children.push(
                md5("/SarvvidBox/" + temp[i] + "__file__")
              );
            }
            console.log("new data...", new_data);
            if (new_fileSystem.length > 2) {
              localStorage.setItem("fileSystem", new_fileSystem);
              // setEntry(JSON.parse(new_fileSystem));
            } else {
              localStorage.setItem("fileSystem", JSON.stringify(new_data));
              // setEntry(new_data);
            }

            axios(
              `https://api.sarvvid-ai.com/getdata?ping=${localStorage.getItem(
                "ping"
              )}`,
              {
                method: "POST",
                headers: {
                  Accept: "application/json, text/plain, */*", // It can be used to overcome cors errors
                  "Content-Type": "application/json",
                  Authtoken: localStorage.getItem("authtoken"),
                  verificationToken: enc,
                },
                data: JSON.stringify({
                  IMEI: localStorage.getItem("IMEI"),
                }),
              }
            )
              .then((res) => {
                console.log("getdata...", res);
                props.setA(
                  (
                    (res.data.current_storage * res.data.filled_per) /
                    100
                  ).toFixed(2)
                );
                props.setB(res.data.current_storage);
                localStorage.setItem(
                  "used",
                  isNaN(
                    (
                      (res.data.current_storage * res.data.filled_per) /
                      100
                    ).toFixed(2)
                  )
                    ? 0
                    : (
                        (res.data.current_storage * res.data.filled_per) /
                        100
                      ).toFixed(9) *
                        1000 *
                        1000 *
                        1000
                );
                localStorage.setItem(
                  "total",
                  isNaN(res.data.current_storage)
                    ? 20 * 1000 * 1000 * 1000
                    : res.data.current_storage * 1000 * 1000 * 1000
                );
              })
              .catch(() => {
                if (localStorage.getItem("used") == null)
                  localStorage.setItem("used", 0);
                if (localStorage.getItem("total") == null)
                  localStorage.setItem("total", 20 * 1000 * 1000 * 1000);
              });

            console.log("HI I AM IN");
            setState((prevState) => ({
              ...prevState,
              successMessage: "Register successful. Redirecting to home page..",
            }));
            localStorage.setItem(ACCESS_TOKEN_NAME, 1);

            setCurrentScreen("regsuccess");
          }
        } catch (error) {
          console.log("signup error...", error);
          setCurrentScreen("loginerror");
          if (error.response) {
            setErrorMsg(error.response.data.message);
          } else {
            setErrorMsg(
              "We are having some network issues, try again after sometime"
            );
          }
        }
      } else {
        // alert("Invalid phone number");
        alert.error("Invalid phone number");
      }
    } else {
      alert.error("Please fill all the fields");
    }

    clearCredentials();
  };

  // login through sarvvid-web

  const loginWeb = async (e) => {
    e.preventDefault();

    try {
      console.log("login started...");

      // console.log("user Pass...", userPass);
      // console.log("user Mail...", userEmail);

      console.log("enc key...", enc);

      const resp = await axios({
        method: "post",
        url: `https://api.sarvvid-ai.com/weblogin`,
        headers: { verificationToken: enc },
        data: {
          email: userEmail,
          password: userPass,
        },
      });

      console.log("login resp...", resp);

      if (resp.status === 200) {
        console.log("Logged in successfully");

        dispatch(updateAllDataInfo(resp.data));

        console.log("file sytem...", resp.data.filesys);

        localStorage.setItem("IMEI", resp.data.IMEI);
        localStorage.setItem("authtoken", resp.data.authtoken);
        localStorage.setItem("ping", 130);
        localStorage.setItem("user_name", resp.data.username);
        localStorage.setItem("user_number", resp.data.phone);
        localStorage.setItem("avatar", resp.data.imgUri);

        const storageData = setStorage(
          resp.data.used_bytes,
          resp.data.current_storage
        );

        const temp = resp.data.data;

        let new_fileSystem = resp.data.filesys;
        localStorage.setItem("fileSystem", JSON.stringify(new_fileSystem));
        localStorage.setItem(
          "recycleBin",
          JSON.stringify(resp.data.recycleBin)
        );
        var new_data = JSON.parse(localStorage.getItem("fileSystem"));
        var newEntry = {};
        newEntry.name = "SarvvidBox";
        newEntry.type = "__folder__";
        newEntry.creatorName = "";
        newEntry.size = 0;
        newEntry.path = "/SarvvidBox";
        newEntry.parentPath = "/";
        newEntry.children = [];
        newEntry.date = "";
        newEntry.parentID = md5("/" + "__folder__");
        const id_1 = md5("/SarvvidBox" + "__folder__");
        new_data[id_1] = newEntry;
        let i = 0;
        for (i = 0; i < temp.length; i++) {
          var newEntry_1 = {};
          newEntry_1.name = temp[i];
          newEntry_1.type = "__file__";
          newEntry_1.creatorName = "";
          newEntry_1.size = 0;
          newEntry_1.path = "/SarvvidBox/" + temp[i];
          newEntry_1.parentPath = "/SarvvidBox";
          newEntry_1.parentID = md5("/SarvvidBox" + "__folder__");
          newEntry_1.date = "";
          new_data[md5("/SarvvidBox/" + temp[i] + "__file__")] = newEntry_1;
          new_data[md5("/SarvvidBox" + "__folder__")].children.push(
            md5("/SarvvidBox/" + temp[i] + "__file__")
          );
        }
        console.log(new_data);
        if (new_fileSystem.length > 2) {
          localStorage.setItem("fileSystem", new_fileSystem);
          // setEntry(JSON.parse(new_fileSystem));
        } else {
          localStorage.setItem("fileSystem", JSON.stringify(new_data));
          // setEntry(new_data);
        }

        axios(
          `https://api.sarvvid-ai.com/getdata?ping=${localStorage.getItem(
            "ping"
          )}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*", // It can be used to overcome cors errors
              "Content-Type": "application/json",
              Authtoken: localStorage.getItem("authtoken"),
              verificationToken: enc,
            },
            data: JSON.stringify({
              IMEI: localStorage.getItem("IMEI"),
            }),
          }
        )
          .then((res) => {
            console.log("getdata...", res);
            props.setA(
              ((res.data.current_storage * res.data.filled_per) / 100).toFixed(
                2
              )
            );
            props.setB(res.data.current_storage);
            localStorage.setItem(
              "used",
              isNaN(
                (
                  (res.data.current_storage * res.data.filled_per) /
                  100
                ).toFixed(2)
              )
                ? 0
                : (
                    (res.data.current_storage * res.data.filled_per) /
                    100
                  ).toFixed(9) *
                    1000 *
                    1000 *
                    1000
            );
            localStorage.setItem(
              "total",
              isNaN(res.data.current_storage)
                ? 20 * 1000 * 1000 * 1000
                : res.data.current_storage * 1000 * 1000 * 1000
            );
          })
          .catch(() => {
            if (localStorage.getItem("used") == null)
              localStorage.setItem("used", 0);
            if (localStorage.getItem("total") == null)
              localStorage.setItem("total", 20 * 1000 * 1000 * 1000);
          });

        console.log("dfuysdgfuysdgfuysdgfsdfsdyfsyfds HI I am IN");
        setState((prevState) => ({
          ...prevState,
          successMessage: "Login successful. Redirecting to home page..",
        }));
        localStorage.setItem(ACCESS_TOKEN_NAME, 1);

        props.updateTitle("Home");
        props.history.push("/");

        // window.location.reload();
      } else {
        console.log("TRYING AGAIN<<<<<<<<<<<<<<");
      }
    } catch (error) {
      console.log("login error...", error);
      setCurrentScreen("loginerror");
      if (error.response) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg(
          "We are having some network issues, try again after sometime"
        );
      }

      // alert("Network error");
    }

    clearCredentials();
  };

  const variants = {
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: 1,
      },
    },
    rotate: {
      rotate: "360deg",
      transition: {
        duration: 1,
      },
    },
  };

  const splashControls = useAnimation();
  const logoControls = useAnimation();
  const loginControls = useAnimation();
  const signupControls = useAnimation();
  const showQRControls = useAnimation();

  async function sequence() {
    await splashControls.start("visible");
    await splashControls.start("rotate");
    await splashControls.start("hidden");
    await logoControls.start("visible");
    setSplashOpened(true);
    setCurrentScreen("signin");
  }

  return (
    <div className="login">
      <div className="main">
        <div className="forms">
          <div className={`splash ${splashOpened && "hidden"}`}>
            <motion.img
              onLoad={sequence}
              animate={splashControls}
              className="loginLogo"
              src={sarvvidIcon}
              variants={variants}
              alt="Sarvvid AI"
            />
          </div>
          <div
            className={`form-main ${!splashOpened && "hidden"} ${
              loginOpened ? "active1" : ""
            }`}
          >
            <div
              className={`form-container ${
                !(currentScreen === "signup") && "hidden"
              } sign-up-container`}
            >
              <form action="#">
                <div className="form">
                  <h1>Create Account</h1>

                  <p>Email</p>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                  <div className="number-sec">
                    <div className="select-sec">
                      <p>Country</p>
                      <Select
                        options={countryOptions}
                        value={countryValue}
                        onChange={countryChangeHandler}
                        placeholder="Country"
                        className="country-select"
                      />
                    </div>
                    <div style={{ width: "55%" }}>
                      <p>Phone no.</p>
                      <input
                        type="number"
                        value={userPh}
                        onChange={(e) => validatePhone(e.target.value)}
                        style={{
                          borderColor: `${
                            userPh ? (validPhone ? "green" : "red") : "#FFF"
                          }`,
                        }}
                      />
                    </div>
                  </div>

                  <p>Password</p>
                  <input
                    type="password"
                    value={userPass}
                    onChange={(e) => setUserPass(e.target.value)}
                  />
                  <div className={"center"} style={{ textAlign: "center" }}>
                    <button type="submit" onClick={(e) => registerWeb(e)}>
                      Sign Up
                    </button>
                  </div>
                  <h3>
                    Already have an account.{" "}
                    <span onClick={() => setCurrentScreen("signin")}>
                      Sign in
                    </span>
                  </h3>
                </div>
              </form>
            </div>

            <div
              className={`form-container ${
                !(currentScreen === "signin") && "hidden"
              } sign-in-container`}
            >
              <form action="#">
                <div className="form">
                  <h1>Sign in</h1>
                  <p>Email</p>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                  <p>Password</p>

                  <input
                    type="password"
                    value={userPass}
                    onChange={(e) => setUserPass(e.target.value)}
                  />

                  <div
                    className={"center loginbuttons"}
                    style={{ textAlign: "center" }}
                  >
                    <button type="submit" onClick={(e) => loginWeb(e)}>
                      Sign In
                    </button>
                    <button
                      className="btn-md"
                      onClick={(e) => {
                        setCurrentScreen("qrscan");
                        e.preventDefault();
                      }}
                    >
                      Scan QR{" "}
                      <img
                        style={{
                          width: "18px",
                          height: "18px",
                          margin: "0px 3px",
                        }}
                        src={qrCodeIcon}
                        alt="qr"
                      />
                    </button>
                  </div>

                  <h3 style={{ marginTop: "25px" }}>
                    Forgot your password?{" "}
                    <span onClick={() => setCurrentScreen("forgotpass")}>
                      Click here
                    </span>
                  </h3>

                  <h3>
                    New to Sarvvid{" "}
                    <span onClick={() => setCurrentScreen("signup")}>
                      Sign up
                    </span>
                  </h3>
                </div>
              </form>
            </div>

            <div
              className={`form-container ${
                !(currentScreen === "qrscan") && "hidden"
              } qr-scan-container`}
            >
              <div className="qrform">
                <h1 style={{ height: "25px" }}>Scan QR</h1>

                <QRC
                  updateTitle={props.updateTitle}
                  history={props.history}
                  setA={(val) => {
                    props.setA(val);
                  }}
                  setB={(val) => {
                    props.setB(val);
                  }}
                />

                <div
                  className={"center loginbuttons"}
                  style={{ textAlign: "center" }}
                >
                  <button
                    type="submit"
                    onClick={(e) => {
                      setCurrentScreen("signin");
                      e.preventDefault();
                    }}
                  >
                    Go Back
                  </button>
                </div>
                <div>
                  <ul style={{ listStyle: "none" }}>
                    <li style={{ textAlign: "center" }}>
                      To use SarvvidBox on your computer:
                    </li>
                    <li style={{ textAlign: "center" }}>
                      Open SarvvidBox on your phone
                    </li>
                    <li style={{ textAlign: "center" }}>
                      Tap Menu or Settings and select SarvvidBox Web
                    </li>
                    <li style={{ textAlign: "center" }}>
                      Point your phone to this screen to capture the code
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              className={`form-container ${
                !(currentScreen === "forgotpass") && "hidden"
              } forgotpass-container`}
            >
              <div className="form">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <h1>Forgot Password</h1>
                </div>
                <p className={"forgotpassheader"}>
                  Enter your email to recieve a reset link
                </p>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                <div
                  className={"center loginbuttons"}
                  style={{ textAlign: "center" }}
                >
                  <button
                    type="Submit"
                    onClick={(e) => {
                      forgotPassHandler(e);
                    }}
                  >
                    Submit
                  </button>
                  <button
                    className="btn-md"
                    onClick={(e) => {
                      setCurrentScreen("signin");
                      e.preventDefault();
                    }}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`form-container ${
                !(currentScreen === "loginerror") && "hidden"
              } loginerror-container`}
            >
              <div className="form">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <h1>Oops</h1>
                </div>

                <p className={"forgotpassheader"}>{errorMsg}</p>

                <div
                  className={"center loginbuttons"}
                  style={{ textAlign: "center" }}
                >
                  <button
                    type="Submit"
                    onClick={(e) => {
                      setCurrentScreen("signin");
                      e.preventDefault();
                    }}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
            <div
              className={`form-container ${
                !(currentScreen === "forgotpasssuccess") && "hidden"
              } loginerror-container`}
            >
              <div className="form">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <h1>Verify</h1>
                </div>

                <p className={"forgotpassheader"}>{forgotMessage}</p>

                <div
                  className={"center loginbuttons"}
                  style={{ textAlign: "center" }}
                >
                  <button
                    type="Submit"
                    onClick={(e) => {
                      setCurrentScreen("signin");
                      e.preventDefault();
                    }}
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </div>
            <div
              className={`form-container ${
                !(currentScreen === "regsuccess") && "hidden"
              } loginerror-container`}
            >
              <div className="form">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <h1>Registered successfully</h1>
                </div>

                <p className={"forgotpassheader"}>
                  Please verify your email with the link recieved on your email.
                </p>

                <div
                  className={"center loginbuttons"}
                  style={{ textAlign: "center" }}
                >
                  <button
                    type="Submit"
                    onClick={(e) => {
                      setCurrentScreen("signin");
                      e.preventDefault();
                    }}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <img className={`${!splashOpened && "hidden"}`} src={sarvvidLogo} />
        </div>
      </div>
    </div>
  );
}

export default withRouter(LoginForm);
