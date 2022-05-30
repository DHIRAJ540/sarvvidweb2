import React, { useEffect, useState } from "react";
import "./MiddlePane.css";
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
import { useDispatch } from "react-redux";
import axios from "axios";
import { updateAllDataInfo } from "../actions/allData";
import { updateStorageInfo } from "../actions/storage";
import Loader from "../components/Loader/Loader";
import moonIcon from "../assets/img/moon.svg";
import sunIcon from "../assets/img/sun.svg";
import gridIcon from "../assets/img/grid.svg";
import gridDarkIcon from "../assets/img/griddark.svg";
import listIcon from "../assets/img/listMenu.svg";
import listDarkIcon from "../assets/img/listMenuDark.svg";
import CustomizedMenus from "../components/Sidebar/AddBtn/CustomizedMenus";
import { addEntry, deleteEntry, setEntry } from "../actions/fileSystem";
import { useSelector } from "react-redux";
import { generateTreeFromList } from "../utils/fileSystem";
import { FOLDER } from "../utils/constants";
import UploadLottie from "../components/Lotties/upload";
import DownloadLottie from "../components/Lotties/download";
import md5 from "md5";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));
const ViewFiles = (props) => {
  const darkTheme = useTheme();
  const toggleTheme = useThemeUpdate();
  const toggleMenu = useMenuToggle();
  const classes = useStyles();
  const [sideDrawerToggle, setSideDrawerToggle] = useState(true);
  const dispatch = useDispatch();
  const [gridView, setGridView] = useState(false);
  const { uploadLoading, downloadLoading } = useSelector(
    (state) => state.loader
  );

  console.log("viewfiles props...", props);

  useEffect(() => {
    axios(
      `https://api.sarvvid-ai.com/getdata?ping=${localStorage.getItem("ping")}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*", // It can be used to overcome cors errors
          "Content-Type": "application/json",
          Authtoken: localStorage.getItem("authtoken"),
        },
        data: JSON.stringify({
          IMEI: localStorage.getItem("IMEI"),
        }),
      }
    ).then((resp) => {
      console.log("Get data resp...", resp);

      const respData = resp.data.storage_info;

      const storageData = {
        imageCount: respData.images_count,
        audioCount: respData.audios_count,
        videoCount: respData.videos_count,
        documentCount: respData.docs_count,
        othersCount: respData.others_count,
        imageSize: respData.images_size,
        audioSize: respData.audios_size,
        videoSize: respData.videos_size,
        documentSize: respData.docs_size,
        othersSize: respData.others_size,
      };

      dispatch(updateStorageInfo(storageData));
    });
  });

  return (
    <div
      className={`middlePane ${toggleMenu ? "" : "opened"} ${
        darkTheme ? "dark-theme" : ""
      }`}
    >
      <div className="middlePane_upper">
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
      </div>
      <div className="min_upload_section">
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
      <div
        className="middlePane_cards"
        style={{ background: `${darkTheme ? "#121212" : "#fff"}` }}
      >
        <div className="midPane-header">
          <div className="navigation-container">
            <h2>
              Your Files - Secure{" "}
              <span role="img" aria-label="sheep">
                🔑
              </span>
            </h2>
            <Navigation />
          </div>
          <div className="layout-toggle">
            {darkTheme ? (
              <img src={listDarkIcon} alt="grid" />
            ) : (
              <img src={listIcon} alt="grid" />
            )}

            {darkTheme ? (
              <img src={gridDarkIcon} alt="grid" />
            ) : (
              <img src={gridIcon} alt="grid" />
            )}
          </div>
        </div>
        <div className="table-header">
          <p>Name</p>
          <p>Size</p>
          <p>Type</p>
        </div>
        <Route path="*" component={Card} />
      </div>
      <div
        className="footer_msg"
        style={{ marginTop: "2rem", color: "#acacac" }}
      >
        <p>Made for Web3. Made with ❤️ from Bharat(India)</p>
      </div>
      {uploadLoading ? <UploadLottie /> : ""}
      {downloadLoading ? <DownloadLottie /> : ""}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const fileStructure = generateTreeFromList(state.fileSystem);

  console.log("map st...", fileStructure);

  // const path = ownProps.match.url;
  return {
    fileStructure,
  };
};

export default ViewFiles;
