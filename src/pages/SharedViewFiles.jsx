import React, { useState, useEffect } from "react";
import "./MiddlePaneShared.css";
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
} from "../contexts/themeContext";

// New
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { updateSharedHistoryInfo } from "../actions/sharedFiles";
import { useAlert } from "react-alert";
import moonIcon from "../assets/img/moon.svg";
import sunIcon from "../assets/img/sun.svg";
import gridIcon from "../assets/img/grid.svg";
import gridDarkIcon from "../assets/img/griddark.svg";
import emptyIllustration from "../assets/img/mascot_sharedempty.png";
import copyIcon from "../assets/img/copy.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));
const SharedViewFiles = () => {
  const darkTheme = useTheme();
  const toggleTheme = useThemeUpdate();
  const toggleMenu = useMenuToggle();
  const classes = useStyles();
  const [emptyFiles, setEmptyFiles] = useState(true);
  const { sharedHistory } = useSelector((state) => state.shared);
  const [sharedFiles, setSharedFiles] = useState([]);
  const newAlert = useAlert();
  const dispatch = useDispatch();

  console.log("shared history...", sharedHistory);

  const getSharedFiles = async () => {
    try {
      const sharedResp = await axios({
        method: "get",
        url: `https://api.sarvvid-ai.com/get/ipfs/shared/files?email=${localStorage.getItem(
          "user_name"
        )}`,
        headers: {},

        data: {
          email: "user",
        },
      });
      console.log("Shared files response...", sharedResp);
      setSharedFiles(sharedResp.data);
    } catch (error) {
      console.log("Shared files error...", error);
    }

    // axios({
    //   method: 'post',
    //   url: baseUrl + 'applications/' + appName + '/dataexport/plantypes' + plan,
    //   headers: {},
    //   data: {
    //     foo: 'bar', // This is the body part
    //   }
    // });
  };

  const getSharedHistory = async () => {
    const formData = new FormData();

    formData.append("uniqueID", localStorage.getItem("IMEI"));
    try {
      const sharedResp = await axios({
        method: "get",
        url: `https://api.sarvvid-ai.com/shared/ipfs/files?uniqueID=${localStorage.getItem(
          "IMEI"
        )}`,
        headers: {},

        data: formData,
      });
      console.log("Shared history files response...", sharedResp);
      dispatch(updateSharedHistoryInfo({ sharedHistory: sharedResp.data }));
    } catch (error) {
      console.log("Shared history files error...", error);
    }

    // axios({
    //   method: 'post',
    //   url: baseUrl + 'applications/' + appName + '/dataexport/plantypes' + plan,
    //   headers: {},
    //   data: {
    //     foo: 'bar', // This is the body part
    //   }
    // });
  };

  const copyFileHash = (hash) => {
    newAlert.success("Hash copied to clipboard");
    navigator.clipboard.writeText(hash);
  };

  useEffect(() => {
    getSharedFiles();
    getSharedHistory();
  }, []);

  return (
    <div
      className={`middlePane  ${toggleMenu ? "" : "opened"} ${
        darkTheme ? "dark-theme" : ""
      }`}
    >
      <div className="middlePane_upper">
        {/* <SearchBar /> */}
        <div
          className={`theme-toggle ${darkTheme ? "dark" : ""}`}
          onClick={() => toggleTheme()}
        >
          <div className="theme-btn">
            <img src={moonIcon} alt="dark" />
            <img src={sunIcon} alt="light" />
          </div>
        </div>
      </div>
      <div
        className={`middlePane_cards_shared ${darkTheme ? "dark" : ""}`}
        style={{ background: `${darkTheme ? "#121212" : "#fff"}` }}
      >
        {false ? (
          <div className="empty_files_shared">
            <img src={emptyIllustration} alt="empty" />
            <p>Sharing is caring. Share some files 😀</p>
            <button type="button" className="empty_files_shared_btn">
              Share some files
            </button>
          </div>
        ) : (
          <div>
            <div className={`shared_container ${darkTheme ? "dark" : ""}`}>
              <h3
                className="share_title"
                style={{ color: `${darkTheme ? "#ccc" : "#000"}` }}
              >
                Shared Files
              </h3>
              <div className="req_table-header">
                <p>Serial no.</p>
                <p>File name</p>
                <p>Copy</p>
              </div>
              <div className="shared_files">
                {sharedFiles.map((item, index) => (
                  <div
                    className={`shared-card-container ${
                      darkTheme ? "dark-theme" : ""
                    }`}
                    key={index}
                  >
                    <div className="file-card">
                      <div className="file-no">{index + 1}</div>
                      <div className="file-hash">{item.filename}</div>
                      <div className="file-copy">
                        <img
                          src={copyIcon}
                          alt="copy"
                          onClick={() => copyFileHash(item.hash)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {false ? (
          <div className="empty_files_shared">
            <img src={emptyIllustration} alt="empty" />
            <p>Sharing is caring. Share some files 😀</p>
            <button type="button" className="empty_files_shared_btn">
              Share some files
            </button>
          </div>
        ) : (
          <div>
            <div
              className={`shared_container ${darkTheme ? "dark" : ""}`}
              style={{ marginTop: "2rem" }}
            >
              <h3
                className="share_title"
                style={{ color: `${darkTheme ? "#ccc" : "#000"}` }}
              >
                Shared History
              </h3>
              <div className="shared_table-header">
                <p>Serial no.</p>
                <p>File name</p>
                <p>To</p>
              </div>
              {sharedHistory.map((item, index) => (
                <div
                  className={`shared-card-container ${
                    darkTheme ? "dark-theme" : ""
                  }`}
                  key={index}
                >
                  <div className="file-card">
                    <div className="file-no">{index + 1}</div>
                    <div className="file-hash">{item.filename}</div>
                    <div className="file-to"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className="footer_msg"
          style={{ marginTop: "2rem", color: "#acacac" }}
        >
          {/* <p>Made for Web3. Made with love from bharat</p> */}
        </div>
      </div>
    </div>
  );
};

export default SharedViewFiles;
