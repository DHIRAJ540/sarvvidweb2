import React, { useState, useEffect } from "react";
import "./MiddlePaneRequest.css";
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

import moonImg from "../assets/img/moon.svg";
import sunImg from "../assets/img/sun.svg";
import MenuIcon from "@material-ui/icons/MenuRounded";
import sarvvidLogoDark from "../assets/img/sarvvidLogodark.svg";
import gridIcon from "../assets/img/grid.svg";
import gridDarkIcon from "../assets/img/griddark.svg";
import mascotReq1 from "../assets/img/mascot_req1.png";
import mascotReq2 from "../assets/img/mascot_req2.png";
import axios from "axios";
import fileDownload from "js-file-download";
import { useAlert } from "react-alert";
import DeleteLottie from "../components/Lotties/delete";
import { dark } from "@material-ui/core/styles/createPalette";
import uploadBigIcon from "../assets/img/uploadBig.svg";
import "semantic-ui-css/semantic.min.css";
import { Header, Table } from "semantic-ui-react";
import copyIcon from "../assets/img/copy.svg";
import { Modal } from "@material-ui/core";
import { getStorage } from "../utils/storageHandler";
import getEnc from "../utils/enc";
import UploadLottie from "../components/Lotties/upload";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));
const RequestViewFiles = () => {
  const darkTheme = useTheme();
  const toggleTheme = useThemeUpdate();
  const toggleMenu = useMenuToggle();
  const toggleBtn = useMenuUpdateToggle();
  const classes = useStyles();
  const storageData = getStorage();
  const enc = getEnc();

  const [fileHash, setFileHash] = useState("");
  const [animationOpen, setAnimationOpen] = useState(false);
  const [openHashModal, setOpenHashModal] = useState(false);
  const [fileHash1, setFileHash1] = useState("");
  const [ipfsDocument, setIpfsDocument] = useState([]);
  const [fileUploading, setFileUploading] = useState({
    // fileName: {name:fileName, progress: 0, totalprogress: 0 },
  });
  const [disableUploadButton, setDisableUploadButton] = useState(false);
  const [ipfsFileUploading, setIpfsFileUploading] = useState({
    // fileName: {name:fileName, progress: 0, totalprogress: 0 },
  });

  const newAlert = useAlert();

  const downloadIpfsFile = async () => {
    try {
      const response = await axios.get(
        `https://api.sarvvid-ai.com/ipfs/get/file/${fileHash}`
      );

      fileDownload(response.data, fileHash);
      newAlert.success("file downloaded successfully");

      console.log("ipfs download resonse", response);
    } catch (err) {
      console.log(err);
      newAlert.error(err.response.message || "Failed to download file");
    }
  };

  const showAnim = () => {
    setAnimationOpen(true);
    hideAnim();
  };

  const hideAnim = () => {
    setTimeout(() => {
      setAnimationOpen(false);
    }, 2000);
  };

  const onIpfsFileChange = (event) => {
    // Update the state
    console.log("Selected FILE for IPFS...", event.target.files);

    console.log("First ipfs file", event.target.files[0].webkitRelativePath);
    let str =
      event.target.files[0].webkitRelativePath.split("/")[0] +
      "/" +
      event.target.files[0].name;

    if (str in fileUploading) {
      console.log("=======TRUE=======");
      for (let key in event.target.files) {
        let arr = event.target.files[key].webkitRelativePath.split("/");
        arr[0] = arr[0] + "_" + new Date();
        let webkit = "";
        for (let string of arr) {
          webkit = webkit + string + "/";
        }
        webkit.slice(0, -1);
        console.log("webkit===============>>>", webkit);
        event.target.files[key].webkitRelativePath = webkit;
      }
    }

    setIpfsDocument(event.target.files);
  };

  const onIpfsUpload = async () => {
    console.log("uploading file to IPFS...");
    const formData = new FormData();
    formData.append("IMEI", localStorage.getItem("IMEI"));
    formData.append("name", "avatar");

    console.log("upload ipfs file data...", ipfsDocument[0]);

    if (ipfsDocument[0].size > storageData.rem_bytes) {
      newAlert.error("Not enough space");
      return;
    } else {
      console.log("Continue uploading");
    }

    setDisableUploadButton(true);
    formData.append("filedata", ipfsDocument[0]);

    let string;
    string = {};
    string[ipfsDocument[0].name] = {
      name: ipfsDocument[0].name,
      progress: 0,
      totalprogress: 0,
    };

    setIpfsFileUploading({ ...fileUploading, ...string });

    if (localStorage.getItem("authtoken")) {
      console.log(localStorage.getItem("authtoken"));
    } else {
      localStorage.setItem("authtoken", "65aa9ad20c8a2e900c8a65aa51f66c140c8a");
    }

    const at = localStorage.getItem("authtoken");
    console.log("auth token...", at);

    // console.log("formdata for ipfs", formData);

    axios({
      method: "post",
      url: `https://api.sarvvid-ai.com/ipfs/upload`,
      headers: {
        "Content-type": "multipart/form-data",
        Authtoken: at,
        verificationToken: enc,
      },
      data: formData,
      onUploadProgress: function (progressEvent) {
        let s1 = formData.get("filedata");
        let s2 = s1.name;
        let totalP = 0;
        totalP = progressEvent.total;
        let prog = progressEvent.loaded;
        let obj = {};

        if (progressEvent.loaded === progressEvent.total) {
          obj = { ...fileUploading };
          delete obj[s2];
          setFileUploading({ ...obj });
        } else {
          obj[s2] = { name: s2, progress: prog, totalprogress: totalP };
          setFileUploading({ ...fileUploading, ...obj });
        }
      },
    })
      .then((response) => {
        console.log("ipfs upload resp...", response);
        setFileHash1(response.data.hash);
        setOpenHashModal(true);
        setIpfsDocument([]);
        newAlert.success("File uploaded successfully to IPFS");
        setDisableUploadButton(false);
      })
      .catch((err) => {
        console.log("upload ipfs error...", err);
        newAlert.error(
          "Server is up for maintenance. Please Try After Some Time"
        );
        setDisableUploadButton(false);

        let s1 = formData.get("filedata");
        let s2 = s1.webkitRelativePath.split("/")[0] + "/" + s1.name;
        let obj = { ...fileUploading };
        delete obj[s2];
        setFileUploading({ ...obj });
        setIpfsDocument([]);
      });

    setAnimationOpen(false);
  };

  const copyFileHash = () => {
    newAlert.success("Hash copied to clipboard");
    navigator.clipboard.writeText("demo hash");
  };

  useEffect(() => {
    if (ipfsDocument.length > 0) {
      onIpfsUpload();
    }
  }, [ipfsDocument]);

  return (
    <div
      className={`middlePane ${toggleMenu ? "" : "opened"} ${
        darkTheme ? "dark-theme" : ""
      }`}
    >
      {/* <div className="middlePane_upper">
        <SearchBar />
        <div
          className={`theme-toggle ${darkTheme ? "dark" : ""}`}
          onClick={() => toggleTheme()}
        >
          <div className="theme-btn">
            <img src={moonIcon} alt="dark" />
            <img src={sunIcon} alt="light" />
          </div>
        </div>
      </div> */}
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
          <img src={sarvvidLogoDark} alt="logo" />
        </div>
        <div
          className={`min-theme-toggle ${darkTheme ? "dark" : ""}`}
          onClick={() => toggleTheme()}
        >
          <div className="min_theme_toggle">
            <img src={moonImg} alt="mooon" />
            <img src={sunImg} alt="sun" />
          </div>
        </div>
      </div>
      <div
        className={`middlePane_cards_request ${darkTheme ? "dark" : ""}`}
        style={{ background: `${darkTheme ? "#121212" : "#fff"}` }}
      >
        <div className="requestFiles">
          <h3>Download file from hash</h3>
          <div className="requestFiles_content">
            <input
              type="search"
              label="Search"
              placeholder="Enter hash"
              id="outlined-search"
              className={`searchBar_text  ${
                darkTheme ? "dark" : ""
              } hash_search`}
              value={fileHash}
              onChange={(e) => setFileHash(e.target.value)}
            />

            <button
              type="button"
              className="requestFiles_btn"
              onClick={() => {
                downloadIpfsFile();
              }}
            >
              Download
            </button>
          </div>
          <p>Easily access files from a single hash 🚀</p>
        </div>
        {/* <div className="midPane-header">
          <div className="navigation-container">
            <div className="navigation-subcontainer">
              <h2 style={{ marginRight: "auto" }}>
               Request files
              </h2>
              <div style={{ display: "flex" }} className="button_depth">
                {darkTheme ? (
                  <img src={gridDarkIcon} alt="grid" />
                ) : (
                  <img style={{ opacity: "0.5" }} src={gridIcon} alt="grid" />
                )}
              </div>
            </div>

            <Navigation />
          </div>
        </div>
        <div className="table-header">
          <p>Name</p>
          <p>Size</p>
          <p>Type</p>
        </div>
        <Route path="*" component={Card} />
        <div
          className="footer_msg"
          style={{ marginTop: "2rem", color: "#acacac" }}
        >
          <p>Made for Web3. Made with love from bharat</p>
        </div> */}
      </div>
      <div className="req_container">
        <div className={`left_req_container ${darkTheme ? "dark" : ""}`}>
          <label
            htmlFor="filePickerIpfs"
            className="left_req_container1"
            style={{ background: `${darkTheme ? "#121212" : "#fff"}` }}
          >
            <img src={uploadBigIcon} alt="upload" />
            <h2 style={{ color: `${darkTheme ? "#fafafa" : "#000"}` }}>
              Upload to IPFS
            </h2>
          </label>
          <input
            id="filePickerIpfs"
            style={{ visibility: "hidden", width: "0%" }}
            type="file"
            onChange={(e) => {
              onIpfsFileChange(e);
            }}
          />
        </div>
        <div className={`right_req_container ${darkTheme ? "dark" : ""}`}>
          <div className="req_table-header">
            <p>Serial no.</p>
            <p>File hash</p>
            <p>Copy</p>
          </div>
          <div className={`card-container ${darkTheme ? "dark-theme" : ""}`}>
            <div className="file-card">
              <div className="file-no">1</div>
              <div className="file-hash">
                c89a47275538010b67501279fcbff8c794f4eb56630633ee36f013992f002dfa
              </div>
              <div className="file-copy">
                <img src={copyIcon} alt="copy" onClick={() => copyFileHash()} />
              </div>
            </div>
          </div>
          <div className={`card-container ${darkTheme ? "dark-theme" : ""}`}>
            <div className="file-card">
              <div className="file-no">2</div>
              <div className="file-hash">
                07478829e1cbb7ab7963318b3a52b372b07af814dc094ad37aba837dc5473bfa
              </div>
              <div className="file-copy">
                <img src={copyIcon} alt="copy" onClick={() => copyFileHash()} />
              </div>
            </div>
          </div>
          <div className={`card-container ${darkTheme ? "dark-theme" : ""}`}>
            <div className="file-card">
              <div className="file-no">3</div>
              <div className="file-hash">
                d259e5771a10fd3cae0f318fd4fda3dedf9559e2e01a2f84e8dc17bdfdf5c270
              </div>
              <div className="file-copy">
                <img src={copyIcon} alt="copy" onClick={() => copyFileHash()} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={openHashModal}
        onClose={() => setOpenHashModal(false)}
        className="hash_modal"
      >
        <div className="hash_modal_inner">
          <h1>Your file has been uploaded successfully to IPFS</h1>
          <h4>
            Click on the hash below to copy the hash for downloding the file in
            future.
          </h4>
          <div
            className="file_hash"
            onClick={() => {
              navigator.clipboard.writeText(fileHash1);
              newAlert.success("hash copied to clipboard");
            }}
          >
            <p>{fileHash1}</p>
            <img src={copyIcon} alt="copy" />
          </div>
        </div>
      </Modal>
      {animationOpen ? <UploadLottie /> : ""}
    </div>
  );
};

export default RequestViewFiles;
