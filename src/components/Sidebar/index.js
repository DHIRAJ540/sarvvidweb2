import React, { useState } from "react";
import { Link } from "react-router-dom";
import SideMenu from "./SideMenu";
import { connect } from "react-redux";
import homeGif from "../../assets/gif/home.gif";
import myFilesGif from "../../assets/gif/myfiles.gif";
import recentFilesGif from "../../assets/gif/recentfiles.gif";
import sharedFileGif from "../../assets/gif/sharedfile.gif";
import fileRequestGif from "../../assets/gif/filerequest.gif";
import recycleBinGif from "../../assets/gif/recyclebin.gif";
import { generateTreeFromList } from "../../utils/fileSystem";
// import { Route } from "react-router-dom";
import { SideBarContainer, Root, ShowMenu } from "./styles";
import { addEntry, deleteEntry, setEntry } from "../../actions/fileSystem";
import { FOLDER } from "../../utils/constants";
import md5 from "md5";
import CustomizedMenus from "./AddBtn/CustomizedMenus";
import sarvvid from "../../assets/img/sarvvidLogo.svg";
import sarvvidDark from "../../assets/img/sarvvidLogodark.svg";
import "./LeftPane.css";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

// New
import homeIcon from "../../assets/img/home.svg";
import shareIcon from "../../assets/img/share.svg";
import fileIcon from "../../assets/img/filerequest.svg";
import binIcon from "../../assets/img/bin.svg";
import settingsIcon from "../../assets/img/settings.svg";
import uploadIcon from "../../assets/img/upload.svg";
import CloseIcon from "@material-ui/icons/CloseRounded";
import logoutIcon from "../../assets/img/logoutIcon.svg";
import homeDarkIcon from "../../assets/img/homedark.svg";
import shareDarkIcon from "../../assets/img/sharedark.svg";
import fileDarkIcon from "../../assets/img/filerequestdark.svg";
import binDarkIcon from "../../assets/img/bindark.svg";
import settingsDarkIcon from "../../assets/img/settingsdark.svg";
import logoutDarkIcon from "../../assets/img/logoutdark.svg";
import {
  useTheme,
  useMenuToggle,
  useMenuUpdateToggle,
} from "../../contexts/themeContext";

const useFileRequestStyles = makeStyles((theme) => ({
  paper: {
    position: "relative",
    top: "30%",
    left: "19.5%",
    width: "50%",
    height: "40%",
    // backgroundColor: "#05e395",
    backgroundColor: "white",
    // backgroundImage: "linear-gradient(to bottom right,#00b3ff, #ecfaff )",
    border: "0.5px solid #000",
    // boxShadow: "0 0 20px rgb(0, 195, 255)",
    borderRadius: "0.85%",
    padding: theme.spacing(2, 4, 3),
    color: "black",
    textAlign: "center",
  },
}));

const Sidebar = ({ fileStructure, ...props }) => {
  // console.log("AAAAAAAAAAAAAAAAAAAA-->", props);
  let children = fileStructure[0].children;
  const [toggle, handleToggle] = useState(true);
  const [sideDrawerToggle, setSideDrawerToggle] = useState(true);
  const [home, setHome] = useState(true);
  const [myFiles, setMyFiles] = useState(true);
  const [recentFiles, setRecentFiles] = useState(true);
  const [sharedFiles, setSharedFiles] = useState(true);
  const [fileRequest, setFileRequest] = useState(true);
  const [recycleBin, setRecycleBin] = useState(true);
  const [handleFileRequest, setHandleFileRequest] = useState(false);
  const classesFileRequest = useFileRequestStyles();
  const [fileHash, setFileHash] = useState("");
  const darkTheme = useTheme();
  const toggleMenu = useMenuToggle();
  const toggleMenuHandler = useMenuUpdateToggle();

  function handleLogout() {
    localStorage.clear();

    props.history.push("/login");
  }

  function handleClick(event) {
    props.handleViewChange(event);
  }

  return (
    <div
      className={`leftContainer ${toggleMenu ? "" : "opened"} ${
        darkTheme ? "dark-theme" : ""
      } `}
      onMouseEnter={() => setSideDrawerToggle(true)}
      onMouseLeave={() => setSideDrawerToggle(true)}
    >
      <div className="banner">
        <p>This is a demo account</p>
      </div>
      <div className="left-header">
        {darkTheme ? (
          <img
            className="sarvvid_logo"
            src={sarvvidDark}
            alt="Sarvvid AI"
          ></img>
        ) : (
          <img className="sarvvid_logo" src={sarvvid} alt="Sarvvid AI"></img>
        )}
        <div className="close-toggle-btn">
          <CloseIcon
            onClick={() => toggleMenuHandler()}
            style={{
              color: `${darkTheme ? "#fff" : "#333"}`,
              fontSize: "2rem",
            }}
          />
        </div>
      </div>
      <div className="leftPane">
        <div className="leftPane_buttons">
          <div className="leftPane_new">
            <CustomizedMenus
              btnSize="long"
              addEntry={(value) => {
                console.log(value);
                props.addEntry({
                  ...value,
                });
              }}
              setEntry={(val) => props.setEntry(val)}
              currentpath={props.match.url}
              onEnterProgress={() => setSideDrawerToggle(false)}
            />
          </div>
          <div className="nav-items">
            <div
              className="leftPane_buttons_button"
              onMouseEnter={() => setHome(false)}
              onMouseLeave={() => setHome(true)}
              onClick={() => handleClick("home")}
            >
              <Link to="/" className="home_link">
                {!darkTheme ? (
                  <img src={homeIcon} alt="" />
                ) : (
                  <img src={homeDarkIcon} alt="" />
                )}
                <h6>Home</h6>
              </Link>
            </div>
            {/* <div className="leftPane_folders">
              <SideMenu fileStructure={children} />
            </div> */}

            <div
              className="leftPane_buttons_button"
              onMouseEnter={() => setSharedFiles(false)}
              onMouseLeave={() => setSharedFiles(true)}
              onClick={() => handleClick("sharedFiles")}
            >
              {!darkTheme ? (
                <img src={shareIcon} alt="" />
              ) : (
                <img src={shareDarkIcon} alt="" />
              )}
              <h6>Shared</h6>
            </div>

            <div
              className="leftPane_buttons_button"
              onMouseEnter={() => setFileRequest(false)}
              onMouseLeave={() => setFileRequest(true)}
              onClick={() => handleClick("fileRequest")}
            >
              {!darkTheme ? (
                <img src={fileIcon} alt="" />
              ) : (
                <img src={fileDarkIcon} alt="" />
              )}
              <h6>IPFS</h6>
            </div>

            <div
              className="leftPane_buttons_button"
              onMouseEnter={() => setRecycleBin(false)}
              onMouseLeave={() => setRecycleBin(true)}
              onClick={() => handleClick("recycleBin")}
            >
              {!darkTheme ? (
                <img src={binIcon} alt="" />
              ) : (
                <img src={binDarkIcon} alt="" />
              )}
              <h6>Recycle bin</h6>
            </div>
            <div
              className="leftPane_buttons_button"
              onMouseEnter={() => setRecycleBin(false)}
              onMouseLeave={() => setRecycleBin(true)}
              onClick={() => handleClick("settings")}
            >
              {!darkTheme ? (
                <img src={settingsIcon} alt="" />
              ) : (
                <img src={settingsDarkIcon} alt="" />
              )}
              <h6>Preferences</h6>
            </div>
          </div>
        </div>
        <div className="logout-section">
          <div className="logout-btn" onClick={() => handleLogout()}>
            {!darkTheme ? (
              <img src={logoutIcon} alt="logout" />
            ) : (
              <img src={logoutDarkIcon} alt="logout" />
            )}
            <h3>Logout</h3>
          </div>
        </div>
      </div>

      <div className="FileRequestModal">
        <Modal
          open={handleFileRequest}
          onClose={() => {
            setHandleFileRequest(!handleFileRequest);
            setSideDrawerToggle(false);
          }}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className={classesFileRequest.paper}>
            <div className="div_FileRequest_heading">
              <h2 id="simple-modal-title" className="FileRequestHeading">
                Download Shared File
              </h2>
              <hr style={{ borderTop: "1px solid rgba(0,179,255,0.3)" }} />
            </div>
            <div className="FileRequestBody">
              <p className="FileRequestInstruction">
                Enter File Hash to Download Shared File:
              </p>
              <form className="FileHash_Bar" noValidate autoComplete="off">
                <TextField
                  id="outlined-search"
                  className="FileHash_text"
                  label="File Hash"
                  type="search"
                  variant="outlined"
                  onChange={(event) => setFileHash(event.target.value)}
                />
              </form>
              <button
                className="FileRequest_button"
                onClick={() => {
                  setHandleFileRequest(!handleFileRequest);
                  setSideDrawerToggle(false);
                }}
              >
                Download File
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const fileStructure = generateTreeFromList(state.fileSystem);

  const path = ownProps.match.url;
  return {
    fileStructure,
  };
};

export default connect(mapStateToProps, { addEntry, deleteEntry, setEntry })(
  Sidebar
);
