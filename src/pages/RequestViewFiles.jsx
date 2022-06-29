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
import shareIcon from "../assets/img/share1.svg";
import { Modal } from "@material-ui/core";
import { getStorage } from "../utils/storageHandler";
import getEnc from "../utils/enc";
import UploadLottie from "../components/Lotties/upload";
import { useDispatch } from "react-redux";
import { setUploadLoading } from "../actions/loaderAction";
import { updateSharedHistoryInfo } from "../actions/sharedFiles";

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
  const dispatch = useDispatch();

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

  const [allHashes, setAllHashes] = useState([]);
  const [shareModal, setShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareHash, setShareHash] = useState("");

  const newAlert = useAlert();

  const downloadIpfsFile = async () => {
    window.location.href = `https://api.sarvvid-ai.com/ipfs/get/file/${fileHash}`;
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
    dispatch(setUploadLoading(true));
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
        getAllHashes();
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

    dispatch(setUploadLoading(false));
  };

  const copyFileHash = (hash) => {
    newAlert.success("Hash copied to clipboard");
    navigator.clipboard.writeText(hash);
  };

  const getAllHashes = async () => {
    try {
      await axios
        .get(
          `https://api.sarvvid-ai.com/ipfs/get/files?uniqueID=${localStorage.getItem(
            "IMEI"
          )}`
        )
        .then((resp) => {
          console.log("all hashes...", resp);
          setAllHashes(resp.data);
        });
    } catch (error) {
      console.log("all hashes error...", error);
    }
  };

  const handleShare = async () => {
    try {
      const resp = await axios.post(
        `https://api.sarvvid-ai.com/share/ipfs/file/${localStorage.getItem(
          "IMEI"
        )}/${shareHash}?shareto=${shareEmail}`
      );

      console.log("share response...", resp);
      dispatch(updateSharedHistoryInfo(resp.data));

      setShareModal(false);
      newAlert.success(`File shared to ${shareEmail} successfully`);
    } catch (error) {
      console.log("share error...", error);
      setShareModal(false);
      newAlert.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (ipfsDocument.length > 0) {
      onIpfsUpload();
    }
  }, [ipfsDocument]);

  useEffect(() => {
    getAllHashes();
  }, []);

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
            <p>File name</p>
            <p>Copy</p>
            <p>Share</p>
          </div>
          {allHashes.map((item, index) => (
            <div
              className={`card-container ${darkTheme ? "dark-theme" : ""}`}
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
                <div className="file-share">
                  <img
                    src={shareIcon}
                    alt="share"
                    onClick={() => {
                      setShareHash(item.hash);
                      setShareModal(true);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
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
      <Modal
        open={shareModal}
        onClose={() => setShareModal(false)}
        className="hash_modal"
      >
        <div className="hash_modal_inner">
          <h1>Share your file</h1>
          <h4>Enter the email-id to which you want to share the file</h4>
          <input
            type="search"
            label="Search"
            placeholder="Enter email"
            id="outlined-search"
            style={{ background: "#ededed" }}
            className={`searchBar_text  ${darkTheme ? "dark" : ""} hash_search`}
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
          />
          <button
            type="button"
            className="requestFiles_btn"
            style={{ marginInline: "auto", marginTop: "2rem" }}
            onClick={() => {
              handleShare();
            }}
          >
            Share
          </button>
        </div>
      </Modal>
      {animationOpen ? <UploadLottie /> : ""}
    </div>
  );
};

export default RequestViewFiles;
