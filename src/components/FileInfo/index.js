import React, { Component, Fragment } from "react";
import "./styles.css";

// New
import closeIcon from "../../assets/img/close.svg";
import { useDispatch } from "react-redux";
import { setDownloadLoading } from "../../actions/loaderAction";
import axios from "axios";
import getEnc from "../../utils/enc";
import fileDownload from "js-file-download";
import { useAlert } from "react-alert";
import md5 from "md5";
import { FOLDER, FILE } from "../../utils/constants";

const FileInfo = ({
  entry,
  closeFn,
  fileEntry,
  deleteFn,
  hideAnim,
  setEntry,
}) => {
  const enc = getEnc();
  const dispatch = useDispatch();
  const newAlert = useAlert();

  let ext = entry.name.split(".").filter((el) => el);
  ext = ext[ext.length - 1];

  const getSize = (fileSize) => {
    if (fileSize < 1000000) return `${(fileSize / 1000).toFixed(2)} kb`;
    else if (fileSize < 1000000000)
      return `${(fileSize / 1000000).toFixed(2)} mb`;
    else return `${(fileSize / 1000000000).toFixed(2)} gb`;
  };

  const getExt = (fileName) => {
    return fileName.split(".").pop();
  };

  const handleDownload = async () => {
    closeFn();
    dispatch(setDownloadLoading(true));
    try {
      axios
        .request({
          method: "get",
          url: `https://api.sarvvid-ai.com/cat?filehash=${
            entry.name
          }&IMEI=${localStorage.getItem("IMEI")}&ping=${localStorage.getItem(
            "ping"
          )}`,
          headers: {
            Accept: "application/json, text/plain, */*",
            Authtoken: localStorage.getItem("authtoken"),
            "Content-Type": "application/json",
            verificationToken: enc,
          },
          responseType: "blob",
        })
        .then((response) => {
          fileDownload(response.data, entry.name);
          dispatch(setDownloadLoading(false));
          newAlert.success("File downloaded successfully");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    closeFn();
    console.log("fileEntry...", fileEntry);

    try {
      deleteFn();

      const data = JSON.parse(localStorage.getItem("recycleBin"));

      console.log("recycleData before...", data);

      const pid = "1382b6993e9f270cb1c29833be3f5750";

      var newEntry = {};
      newEntry.parentPath = "/";
      newEntry.name = fileEntry.name;

      newEntry.type = FILE;
      newEntry.mimetype = fileEntry.mimetype;
      newEntry.path =
        newEntry.parentPath === "/"
          ? `${newEntry.parentPath}${newEntry.name}`
          : `${newEntry.parentPath}/${newEntry.name}`;
      let id = md5(newEntry.path + newEntry.type);

      if (id in data) {
        let arr = fileEntry.name.split(".");
        if (arr.length > 1)
          newEntry.name =
            arr.slice(0, arr.length - 1).join(".") +
            "_" +
            Date.now() +
            "." +
            arr[arr.length - 1];
        else newEntry.name = arr[0] + "_" + Date.now();
        console.log("Changing Name==========>>>", newEntry.name);
        newEntry.path =
          newEntry.parentPath === "/"
            ? `${newEntry.parentPath}${newEntry.name}`
            : `${newEntry.parentPath}/${newEntry.name}`;
        id = md5(newEntry.path + newEntry.type);
      }

      if (newEntry.type === FOLDER) {
        newEntry.children = [];
      }
      newEntry.creatorName = "User";
      newEntry.size = fileEntry.size;
      newEntry.parentID = pid;
      data[id] = newEntry;
      data["1382b6993e9f270cb1c29833be3f5750"].children.push(id);

      console.log("recycle data after...", data);

      localStorage.setItem("recycleBin", JSON.stringify(data));

      const obj = {
        IMEI: localStorage.getItem("IMEI"),
        filestructure: fileEntry,
      };

      console.log("delete file obj...", JSON.stringify(obj));

      const deleteResp = await axios({
        method: "post",
        url: `https://api.sarvvid-ai.com/deletefile?IMEI=${localStorage.getItem(
          "IMEI"
        )}&filename=${fileEntry.name}&filesize=${fileEntry.size}`,
        headers: {
          authtoken: localStorage.getItem("authtoken"),
          verificationToken: enc,
        },
        data: {
          IMEI: localStorage.getItem("IMEI"),
          fileSystem: localStorage.getItem("fileSystem"),
          recycleBin: localStorage.getItem("recycleBin"),
          fileEntry: fileEntry,
        },
      });

      console.log("deleteResp...", deleteResp);

      setEntry(JSON.parse(localStorage.getItem("fileSystem")));
      hideAnim();
    } catch (error) {
      console.log("Delete file...", error);
    }
  };

  return (
    <div className="info_container">
      <div className="info_header">
        <div className="close" onClick={() => closeFn()}>
          <img src={closeIcon} alt="close" />
        </div>
      </div>
      <div className="info_main">
        <div className="info_box">
          <h4>.{getExt(entry.name).toUpperCase()}</h4>
        </div>
        <div className="info_details">
          <h3>{entry.name}</h3>
          <p>Size: {getSize(entry.size)}</p>
          <p>Type: {getExt(entry.name)}</p>
          <p>Created on: {entry.date}</p>
          <div className="info_buttons">
            <div className="button" onClick={() => handleDownload()}>
              Download
            </div>
            <div className="button" onClick={() => handleDelete()}>
              Delete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileInfo;
