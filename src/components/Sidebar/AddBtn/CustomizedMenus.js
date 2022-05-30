import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import { FileCopy, NavigateBeforeSharp } from "@material-ui/icons";
import CreateModal from "../CreateModal/CreateModal";
import AddIcon from "@material-ui/icons/Add";
import { FILE, FOLDER } from "../../../utils/constants";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import md5 from "md5";

// New
import KeyboardArrowDownRoundedIcon from "@material-ui/icons/KeyboardArrowDownRounded";
import uploadIcon from "../../../assets/img/upload.svg";
import uploadDarkIcon from "../../../assets/img/uploaddark.svg";
import "./styles.css";
import { useTheme } from "../../../contexts/themeContext";
import getEnc from "../../../utils/enc";
import { getStorage, setStorage } from "../../../utils/storageHandler";
import { useDispatch } from "react-redux";
import { updateStorageInfo } from "../../../actions/storage";
import { virgilCrypto } from "react-native-virgil-crypto";
import { useAlert } from "react-alert";
import { Modal } from "@material-ui/core";
import copyIcon from "../../../assets/img/copy.svg";
import UploadLottie from "../../Lotties/upload";
import folderIcon from "../../../assets/img/folder-icon.svg";
import fileIcon from "../../../assets/img/file.svg";
import { setUploadLoading } from "../../../actions/loaderAction";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:hover": {
      backgroundColor: "rgba(92, 197, 188, 0.4)",
      transition: "all 0.3s ease-in-out",
      // "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      //   color: theme.palette.common.white,
      // },
    },
  },
}))(MenuItem);

function CustomizedMenus(props) {
  const darkTheme = useTheme();
  const enc = getEnc();
  const dispatch = useDispatch();
  const storageData = getStorage();
  const newAlert = useAlert();

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    getFilesFromEvent: (event) => myCustomFileGetter(event),
    // noDragEventsBubbling: true,
  });
  const [files, selectedfiles] = useState([]);
  const [document, selectedDocument] = useState([]);
  const [ipfsDocument, setIpfsDocument] = useState([]);
  const [disableUploadButton, setDisableUploadButton] = useState(false);
  const [openHashModal, setOpenHashModal] = useState(false);
  const [fileHash, setFileHash] = useState("");
  const [animationOpen, setAnimationOpen] = useState(false);

  const onFileChange = (event) => {
    console.log("hiii");

    // Update the state
    console.log("Selected FILE>>>>>>>>>>>>>>>", event.target.files);
    console.log("target========>", event.target.files);
    console.log(event.target.files[0].webkitRelativePath);
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
    selectedDocument(event.target.files);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openCreateModal, setOpenCreateModal] = useState({
    open: false,
    type: "None",
  });
  const handleClick = (event) => {
    if (!Boolean(anchorEl)) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    // props.chooseClick("none");
  };

  const [fileUploading, setFileUploading] = useState({
    // fileName: {name:fileName, progress: 0, totalprogress: 0 },
  });

  const [ipfsFileUploading, setIpfsFileUploading] = useState({
    // fileName: {name:fileName, progress: 0, totalprogress: 0 },
  });

  const getMimeType = (mimetype) => {
    if (mimetype.includes("image")) {
      return "image";
    } else if (mimetype.includes("video")) {
      return "video";
    } else if (mimetype.includes("audio")) {
      return "audio";
    } else if (mimetype.includes("text")) {
      return "text";
    } else if (mimetype.includes("application")) {
      return "application";
    } else {
      return mimetype;
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

  const onFileUpload = () => {
    // setAnimationOpen(true);
    dispatch(setUploadLoading(true));
    console.log("Uploading File===============>>>>>>");
    const formData = new FormData();
    formData.append("IMEI", localStorage.getItem("IMEI"));
    formData.append("name", "avatar");

    // const encryptedPath = virgilCrypto.encryptFile(
    //   document[0],
    //   "secret"
    // )
    console.log("upload file data...", document[0]);

    if (document[0].size > storageData.rem_bytes) {
      newAlert.error("Not enough space");
      return;
    } else {
      console.log("Continue downloading");
    }

    setDisableUploadButton(true);
    formData.append("filedata", document[0]);

    let string;
    string = {};
    string[document[0].name] = {
      name: document[0].name,
      progress: 0,
      totalprogress: 0,
    };
    setFileUploading({ ...fileUploading, ...string });

    // Details of the uploaded file
    var sys_data = localStorage.getItem("fileSystem");

    // Request made to the backend api
    if (localStorage.getItem("authtoken")) {
      console.log(localStorage.getItem("authtoken"));
    } else {
      localStorage.setItem("authtoken", "65aa9ad20c8a2e900c8a65aa51f66c140c8a");
    }
    const at = localStorage.getItem("authtoken");
    console.log("fsdfsdddddddddddddddDDDDDDDD", at);
    axios({
      method: "post",
      url: `https://api.sarvvid-ai.com/upload?ping=${localStorage.getItem(
        "ping"
      )}`,
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
        if (response.data.newtoken) {
          console.log("upload resp...", response);
          console.log("New auth token...", response.data.newtoken);
          localStorage.setItem("authtoken", response.data.newtoken);
          setStorage(response.data.used_bytes, response.data.current_storage);
          const respData = response.data;
          const storageInfo = {
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

          dispatch(updateStorageInfo(storageInfo));

          setDisableUploadButton(false);
          const values = {
            type: FILE,
            name: "",
          };
          const data = JSON.parse(localStorage.getItem("fileSystem"));

          console.log("file system from local storage...", data);

          const pid = md5(props.currentpath + FOLDER);

          console.log("pid...", pid, "   current path...", props);
          console.log(data[pid]);

          var newEntry = {};
          newEntry.parentPath = props.currentpath;
          newEntry.name = document[0].name;
          newEntry.mimetype = getMimeType(document[0].type);
          console.log("mime type...", newEntry.mimetype);
          newEntry.date = new Date().toLocaleString();
          newEntry.type = FILE;
          newEntry.path =
            newEntry.parentPath === "/"
              ? `${newEntry.parentPath}${newEntry.name}`
              : `${newEntry.parentPath}/${newEntry.name}`;
          let id = md5(newEntry.path + newEntry.type);

          if (id in data) {
            let arr = document[0].name.split(".");
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
          newEntry.creatorName = localStorage.getItem("IMEI");
          newEntry.size = document[0].size;
          newEntry.parentID = pid;
          data[id] = newEntry;
          data[newEntry.parentID].children.push(id);

          localStorage.setItem("fileSystem", JSON.stringify(data));
          axios({
            method: "post",
            url: "https://api.sarvvid-ai.com/updatefileSystem",
            headers: {
              "Content-type": "application/json",
              authtoken: localStorage.getItem("authtoken"),
              verificationToken: enc,
            },
            data: {
              IMEI: localStorage.getItem("IMEI"),
              fileSystem: JSON.stringify(data),
            },
          }).then((response) => {
            if (response.success) {
              console.log("Update file system is completed", response.success);
            }
          });
          props.setEntry(data);
          let file = formData.getAll("filedata");
          let newsize = 0;

          for (let i = 0; i < file.length; i++) {
            newsize = newsize + file[i].size;
          }
          let val =
            ((Number(localStorage.getItem("used")) + newsize) /
              Number(localStorage.getItem("total"))) *
            100;
          console.log("updated used value=======>>", val);
          // axios({
          //   method: "post",
          //   url: `https://api.sarvvid-ai.com/updatedata?ping=${localStorage.getItem(
          //     "ping"
          //   )}`,
          //   headers: {
          //     "Content-type": "application/json",
          //     authtoken: localStorage.getItem("authtoken"),
          //   },
          //   data: JSON.stringify({
          //     IMEI: localStorage.getItem("IMEI"),
          //     filled_per: val,
          //     remaining_per: 100 - val,
          //     images_count: 0,
          //     documents_count: file.length,
          //     videos_count: 0,
          //   }),
          // }).then((response) => {
          //   if ("code" in response.data && response.data.code === 200) {
          //     console.log("Success======>>", response.data.success);
          //     console.log("upload response...", response.data)
          //     localStorage.setItem("filled_per", response.data.storageFilled)
          //     localStorage.setItem("remaining_per", response.data.storageRemain)
          //   } else {
          //     console.log(response.data.notsecure);
          //   }
          // });
          selectedDocument([]);
          newAlert.success("File uploaded successfully");
        } else {
          console.log(response.data.notsecure);
          newAlert.error("Please Try Again");
          setDisableUploadButton(false);
          selectedDocument([]);
        }
        dispatch(setUploadLoading(false));
      })
      .catch((err) => {
        console.log(err);
        console.log("Server is up for maintenance");
        newAlert.error(
          "Server is up for maintenance. Please Try After Some Time"
        );
        setDisableUploadButton(false);

        let s1 = formData.get("filedata");
        let s2 = s1.webkitRelativePath.split("/")[0] + "/" + s1.name;
        let obj = { ...fileUploading };
        delete obj[s2];
        setFileUploading({ ...obj });
        selectedDocument([]);
        dispatch(setUploadLoading(false));
      });
  };

  const onFolderUpload = () => {
    const formData = new FormData();
    setDisableUploadButton(true);
    let i = 0;
    formData.append("IMEI", localStorage.getItem("IMEI"));
    formData.append("name", "avatar");
    for (i = 0; i < files.length; i++) {
      formData.append("filedata", files[i]);
    }
    let string;
    string = {};
    string[files[0].webkitRelativePath.split("/")[0] + "/" + files[0].name] = {
      name: files[0].webkitRelativePath.split("/")[0] + "/" + files[0].name,
      progress: 0,
      totalprogress: 0,
    };
    setFileUploading({ ...fileUploading, ...string });

    // Details of the uploaded file
    var sys_data = localStorage.getItem("fileSystem");

    // Request made to the backend api
    if (localStorage.getItem("authtoken")) {
      console.log(localStorage.getItem("authtoken"));
    } else {
      localStorage.setItem("authtoken", "65aa9ad20c8a2e900c8a65aa51f66c140c8a");
    }
    const at = localStorage.getItem("authtoken");
    console.log("fsdfsdddddddddddddddDDDDDDDD", at);
    axios({
      method: "post",
      url: `https://api.sarvvid-ai.com/upload?ping=${localStorage.getItem(
        "ping"
      )}`,
      headers: {
        "Content-type": "multipart/form-data",
        Authtoken: at,
        verificationToken: enc,
      },
      data: formData,
      onUploadProgress: function (progressEvent) {
        let s1 = formData.get("filedata");
        let s2 = s1.webkitRelativePath.split("/")[0] + "/" + s1.name;
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
        if (response.data.newtoken) {
          console.log(response.data.newtoken);

          localStorage.setItem("authtoken", response.data.newtoken);
          setDisableUploadButton(false);
          const values = {
            type: FOLDER,
            name: "",
          };
          const data = JSON.parse(localStorage.getItem("fileSystem"));
          const pid = md5(props.currentpath + FOLDER);

          var newEntry = {};
          newEntry.parentPath = props.currentpath;
          newEntry.name = files[0].webkitRelativePath.split("/")[0];
          newEntry.type = FOLDER;
          newEntry.path =
            newEntry.parentPath === "/"
              ? `${newEntry.parentPath}${newEntry.name}`
              : `${newEntry.parentPath}/${newEntry.name}`;
          let id = md5(newEntry.path + newEntry.type);

          if (id in data) {
            newEntry.name =
              files[0].webkitRelativePath.split("/")[0] + "_" + Date.now();
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
          newEntry.creatorName = "";
          newEntry.size = 0;
          newEntry.parentID = pid;
          data[id] = newEntry;
          data[newEntry.parentID].children.push(id);

          var dic = {};
          var folder = {};
          if (props.currentpath.length > 1) {
            var currentpath = props.currentpath + "/" + newEntry.name;
          } else {
            var currentpath = props.currentpath + newEntry.name;
          }

          var currentid = id;
          console.log(currentpath);
          let k = 0;
          var files_new = [];
          for (k = 0; k < files.length; k++) {
            temp = files[k].webkitRelativePath.split("/").slice(1).join("/");
            files_new.push(temp);
          }
          let i = 0;
          for (i = 0; i < files_new.length; i++) {
            let j = 0;
            var temp = files_new[i].split("/");
            console.log(temp);
            for (j = 0; j < temp.length; j++) {
              if (!currentpath.includes(temp.slice(0, j).join("/"))) {
                currentpath = currentpath + temp.slice(0, j).join("/");
              }

              console.log(currentpath);
              if (temp[j].includes(".") && j == temp.length - 1) {
                console.log(dic);
                if (!(currentpath in dic)) {
                  currentid = md5(currentpath + FOLDER);
                  dic[currentpath] = currentid;
                } else {
                  console.log("FOUND............");
                  currentid = dic[currentpath];
                }
                var newEntry = {};
                newEntry.parentPath = currentpath;
                newEntry.name = temp[temp.length - 1];
                newEntry.path =
                  newEntry.parentPath === "/"
                    ? `${newEntry.parentPath}${newEntry.name}`
                    : `${newEntry.parentPath}/${newEntry.name}`;
                newEntry.type = FILE;
                newEntry.creatorName = "User";
                newEntry.size = 0;
                newEntry.parentID = currentid;
                const id = md5(newEntry.path + newEntry.type);
                data[id] = newEntry;
                console.log("data", data);
                console.log("NewEntry", newEntry);
                data[newEntry.parentID].children.push(id);
              } else {
                console.log(
                  "CREATING FOLDER>>>>>>>>>>>>>>>>>>>>>>>>>> of currentpath ",
                  currentpath
                );
                if (!(currentpath in dic)) {
                  currentid = md5(currentpath + FOLDER);
                  dic[currentpath] = currentid;
                } else {
                  console.log("FOUND............");
                  currentid = dic[currentpath];
                }
                if (!(temp[j] in folder)) {
                  folder[temp[j]] = 1;
                  var newEntry = {};
                  newEntry.parentPath = currentpath;
                  newEntry.name = temp[j];
                  newEntry.path =
                    newEntry.parentPath === "/"
                      ? `${newEntry.parentPath}${newEntry.name}`
                      : `${newEntry.parentPath}/${newEntry.name}`;
                  newEntry.type = FOLDER;
                  newEntry.creatorName = "";
                  newEntry.size = 0;
                  newEntry.children = [];
                  newEntry.parentID = currentid;
                  const id = md5(newEntry.path + newEntry.type);
                  data[id] = newEntry;
                  console.log("data", data);
                  console.log("NewEntry", newEntry);
                  data[newEntry.parentID].children.push(id);
                  console.log("created");
                  // currentpath = currentpath + "/";
                } else {
                }
              }
            }
          }
          localStorage.setItem("fileSystem", JSON.stringify(data));
          axios({
            method: "post",
            url: "https://api.sarvvid-ai.com/updatefileSystem",
            headers: {
              "Content-type": "application/json",
              authtoken: localStorage.getItem("authtoken"),
              verificationToken: enc,
            },
            data: {
              IMEI: localStorage.getItem("IMEI"),
              fileSystem: JSON.stringify(data),
            },
          }).then((response) => {
            if (response.success) {
              console.log(response.success);
            }
          });
          props.setEntry(data);
          let file = formData.getAll("filedata");
          let newsize = 0;
          for (let i = 0; i < file.length; i++) {
            newsize = newsize + file[i].size;
          }
          let val =
            ((Number(localStorage.getItem("used")) + newsize) /
              Number(localStorage.getItem("total"))) *
            100;
          console.log("updated used value=======>>", val);
          axios({
            method: "post",
            url: `https://api.sarvvid-ai.com/updatedata?ping=${localStorage.getItem(
              "ping"
            )}`,
            headers: {
              "Content-type": "application/json",
              authtoken: localStorage.getItem("authtoken"),
              verificationToken: enc,
            },
            data: JSON.stringify({
              IMEI: localStorage.getItem("IMEI"),
              filled_per: val,
              remaining_per: 100 - val,
              images_count: 0,
              documents_count: file.length,
              videos_count: 0,
            }),
          }).then((response) => {
            if ("code" in response.data && response.data.code === 200) {
              console.log("Success======>>", response.data.success);
              console.log("upload response...", response.data);
              // localStorage.setItem("filled_per", response.data.storageFilled)
              // localStorage.setItem("remaining_per", response.data.storageRemain)
            } else {
              console.log(response.data.notsecure);
            }
          });
          selectedfiles([]);
        } else {
          console.log(response.data.notsecure);
          setDisableUploadButton(false);
          newAlert.error("Please Try Again");
          selectedfiles([]);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("Server is up for maintenance");
        newAlert.error(
          "Server is up for maintenance. Please Try After Some Time"
        );
        setDisableUploadButton(false);
        let s1 = formData.get("filedata");
        let s2 = s1.webkitRelativePath.split("/")[0] + "/" + s1.name;
        let obj = { ...fileUploading };
        delete obj[s2];
        setFileUploading({ ...obj });
        selectedfiles([]);
      });
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
      console.log("Continue downloading");
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
        setFileHash(response.data.hash);
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
  };

  useEffect(() => {
    if (document.length > 0) {
      onFileUpload();
    }
  }, [document]);
  useEffect(() => {
    if (ipfsDocument.length > 0) {
      onIpfsUpload();
    }
  }, [ipfsDocument]);
  useEffect(() => {
    if (files.length > 0) {
      onFolderUpload();
    }
  }, [files]);

  return (
    <div>
      {disableUploadButton ? (
        <Button
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          color="default"
          onClick={null}
          style={{
            height: "60px",
            borderRadius: "60px",
            outline: "none",
            cursor: "not-allowed",
          }}
        >
          {props.btnSize === "short" ? "" : <span>Create New&nbsp;</span>}
          <KeyboardArrowDownRoundedIcon
            style={{ color: "#00b3ff", fontSize: "30px" }}
          />
        </Button>
      ) : (
        <div className="button-container">
          <Button
            aria-controls="customized-menu"
            aria-haspopup="true"
            onClick={handleClick}
            style={{
              height: "60px",
              borderRadius: "60px",
              outline: "none",
              display: "flex",
              alignItems: "center",
              jusifyContent: "space-between",
              width: "200px",
              background: `${darkTheme ? "#0d0d0d" : "#fff"}`,
            }}
          >
            {props.btnSize === "short" ? (
              ""
            ) : (
              <span
                style={{
                  color: `${darkTheme ? "#fff" : "#333"}`,
                  fontSize: "16px",
                  marginRight: "1rem",
                }}
              >
                Upload
              </span>
            )}
            {darkTheme ? (
              <img src={uploadDarkIcon} alt="upload" />
            ) : (
              <img src={uploadIcon} alt="upload" />
            )}
          </Button>
        </div>
      )}

      <div
        className={`menu_container ${darkTheme ? "dark" : ""} ${
          Boolean(anchorEl) ? "open" : ""
        }`}
      >
        <div className="menu_item_container">
          <label htmlFor="filePicker">
            <div className="menu_item">
              <img src={fileIcon} alt="file" />
              <p>File</p>
            </div>
          </label>
          <input
            id="filePicker"
            style={{ visibility: "hidden", width: "0%" }}
            type="file"
            onChange={(e) => {
              onFileChange(e);
            }}
          />
        </div>
        <div className="menu_item_container">
          <label htmlFor="folderPicker">
            <div className="menu_item">
              <img src={folderIcon} alt="file" />
              <p>Folder</p>
            </div>
          </label>
          <input
            directory=""
            webkitdirectory=""
            id="folderPicker"
            type="file"
            style={{ visibility: "hidden", width: "0%" }}
            onChange={(event) => {
              console.log("ALLL FILES>>>>>>>>>>>>>>>", event.target.files);
              console.log("target========>", event.target.files);
              console.log(event.target.files[0].webkitRelativePath);
              let str =
                event.target.files[0].webkitRelativePath.split("/")[0] +
                "/" +
                event.target.files[0].name;

              if (str in fileUploading) {
                console.log("=======TRUE=======");
                for (let key in event.target.files) {
                  let arr =
                    event.target.files[key].webkitRelativePath.split("/");
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

              selectedfiles(event.target.files);
            }}
          />
        </div>
      </div>
      {/* <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={(e) => {
          handleClose();
        }}
      >
        <StyledMenuItem
          style={{ width: "min-content", margin: "0%", cusor: "pointer" }}
        >
          <label
            htmlFor="filePicker"
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "0",
              backgorund: "green",
            }}
          >
            <ListItemIcon>
              <InsertDriveFileIcon style={{ cusor: "pointer" }} />
            </ListItemIcon>
            <ListItemText
              primary="Upload File&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
              style={{ cusor: "pointer" }}
            />
          </label>
          <input
            id="filePicker"
            style={{ visibility: "hidden", width: "0%" }}
            type="file"
            onChange={(e) => {
              onFileChange(e);
            }}
          />
        </StyledMenuItem>

        <StyledMenuItem style={{ width: "min-content", margin: "0%" }}>
          <label
            htmlFor="folderPicker"
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "0",
            }}
          >
            <ListItemIcon>
              <CloudUploadIcon />
            </ListItemIcon>
            <ListItemText primary="Upload Folder" />
          </label>
          <input
            directory=""
            webkitdirectory=""
            id="folderPicker"
            type="file"
            style={{ visibility: "hidden", width: "0%" }}
            onChange={(event) => {
              console.log("ALLL FILES>>>>>>>>>>>>>>>", event.target.files);
              console.log("target========>", event.target.files);
              console.log(event.target.files[0].webkitRelativePath);
              let str =
                event.target.files[0].webkitRelativePath.split("/")[0] +
                "/" +
                event.target.files[0].name;

              if (str in fileUploading) {
                console.log("=======TRUE=======");
                for (let key in event.target.files) {
                  let arr =
                    event.target.files[key].webkitRelativePath.split("/");
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

              selectedfiles(event.target.files);
            }}
          />
        </StyledMenuItem>
        <StyledMenuItem style={{ width: "min-content", margin: "0%" }}>
          <label
            htmlFor="filePickerIpfs"
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "0",
            }}
          >
            <ListItemIcon>
              <InsertDriveFileIcon style={{ cusor: "pointer" }} />
            </ListItemIcon>
            <ListItemText primary="Upload to IPFS" />
          </label>
          <input
            id="filePickerIpfs"
            style={{ visibility: "hidden", width: "0%" }}
            type="file"
            onChange={(e) => {
              onIpfsFileChange(e);
            }}
          />
        </StyledMenuItem>
      </StyledMenu> */}
      <CreateModal
        hover={() => props.onEnterProgress()}
        files={fileUploading}
      />
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
              navigator.clipboard.writeText(fileHash);
              newAlert.success("hash copied to clipboard");
            }}
          >
            <p>{fileHash}</p>
            <img src={copyIcon} alt="copy" />
          </div>
        </div>
      </Modal>
      {animationOpen ? <UploadLottie /> : ""}
    </div>
  );
}
async function myCustomFileGetter(event) {
  const files = [];
  const fileList = event.dataTransfer
    ? event.dataTransfer.files
    : event.target.files;

  for (var i = 0; i < fileList.length; i++) {
    const file = fileList.item(i);
    files.push(file);
  }
  return files;
}

export default CustomizedMenus;
