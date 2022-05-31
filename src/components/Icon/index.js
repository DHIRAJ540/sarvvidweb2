import React, {
  Component,
  createRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { withRouter } from "react-router-dom";
import { FILE, FOLDER } from "../../utils/constants";

import FileIcon from "../../assets/img/file.svg";
// import FolderIcon from "../../assets/img/folder.png";
import FolderIcon from "../../assets/img/folder-icon.svg";
import FolderIconBig from "../../assets/img/folder-big.svg";
import FileIconBig from "../../assets/img/file-big.svg";
import axios from "axios";
import { Container, Logo, Img, Name } from "./styles";
import Menu from "../Menu";
import FileInfo from "../FileInfo";
import Axios from "axios";
import fileDownload from "js-file-download";
import LoadingContainer from "../LoadingContainer/LoadingContainer";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

// New
import md5 from "md5";
import Lottie from "react-lottie";
import deleteLottieData from "../../assets/Lotties/delete.json";
import getEnc from "../../utils/enc";
import { useTheme, useMenuToggle } from "../../contexts/themeContext";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import {
  setDeleteLoading,
  setDownloadLoading,
} from "../../actions/loaderAction";
import DeleteLottie from "../Lotties/delete";
import { Modal } from "@material-ui/core";

// class Icon extends Component {
//   nodeRef = createRef();

//   state = {
//     visible: false,
//     showInfo: false,
//     style: {
//       right: 0,
//       left: 0,
//     },
//     loading: false,
//   };

//   componentDidMount() {
//     document.addEventListener("contextmenu", this._handleContextMenu);

//     document.addEventListener("click", this._handleMouseLeave);
//   }

//   componentWillUnmount() {
//     document.removeEventListener("contextmenu", this._handleContextMenu);

//     document.removeEventListener("click", this._handleMouseLeave);
//   }

//   _handleContextMenu = (event) => {
//     event.preventDefault();

//     const path = event.composedPath();

//     const wasOutside = !path.includes(this.nodeRef.current) || false;

//     if (wasOutside) {
//       this.setState({
//         visible: false,
//         style: {
//           right: 0,
//           left: 0,
//         },
//         previousValue: {
//           right: 0,
//           left: 0,
//         },
//       });
//       return;
//     }

//     const clickX = event.clientX;
//     const clickY = event.clientY;
//     // const screenW = window.innerWidth;
//     // const screenH = window.innerHeight;
//     // const rootW = this.nodeRef.current.offsetWidth;
//     // const rootH = this.nodeRef.current.offsetHeight;

//     // const right = screenW - clickX > rootW;
//     const right = clickX;
//     const left = !right;
//     // const top = screenH - clickY > rootH;
//     const top = clickY;
//     const bottom = !top;

//     const style = {
//       left: 0,
//       top: 0,
//     };

//     if (right) {
//       style.left = `${clickX}`;
//     }

//     if (left) {
//       style.left = `${clickX}`;
//     }

//     if (top) {
//       style.top = `${clickY}`;
//     }

//     if (bottom) {
//       style.top = `${clickY}`;
//     }

//     const prevStyle = {
//       top: style.top,
//       left: style.left,
//     };

//     this.setState({
//       style,
//       visible: true,
//       prevStyle,
//     });
//   };

//   _handleMouseLeave = (event) => {
//     const { visible } = this.state;
//     const wasOutside = !(event.target.contains === this.nodeRef.current);

//     if (wasOutside && visible)
//       this.setState({
//         visible: false,
//         style: {
//           right: 0,
//           left: 0,
//         },
//       });
//   };

//   _handleClick = (event) => {
//     const { visible } = this.state;
//     const wasOutside = !(event.target.contains === this.nodeRef);

//     if (wasOutside && visible)
//       this.setState({
//         visible: false,
//         style: {
//           right: 0,
//           left: 0,
//         },
//       });
//   };

//   _handleScroll = () => {
//     const { visible } = this.state;

//     if (visible)
//       this.setState({
//         visible: false,
//         style: {
//           right: 0,
//           left: 0,
//         },
//       });
//   };

//   handleDelete = async () => {
//     console.log("fileEntry...", this.props.entry)

//     try {
//       console.log("hi.....", this.props.entry)
//       this.props.deleteFn();

//       // await axios({
//       //   method: "post",
//       //   url: `https://api.sarvvid-ai.com/deletefile?IMEI=${localStorage.getItem("IMEI")}&filename=${this.props.entry.name}&filesize=${this.props.entry.size}`,
//       //   headers: {
//       //     "Content-type": "application/json",
//       //     authtoken: localStorage.getItem("authtoken"),
//       //   },
//       //   data: {
//       //     IMEI: localStorage.getItem("IMEI"),
//       //     filename:this.props.entry.name,

//       //   },
//       // }).then((response) => {
//       //   console.log("deletefile response....", response)

//       //   localStorage.setItem("filled_per", response.data.storageFilled)
//       //   localStorage.setItem("remaining_per", response.data.storageRemain)

//       //   if (response.success) {
//       //     console.log("Deleted ", response.success);

//       //   }
//       // });

//       const obj = {
//         IMEI: localStorage.getItem("IMEI"),
//         filestructure: this.props.entry,

//       }

//       console.log("delete file obj...", obj)

//       const deleteResp = await axios({
//         method: 'post',
//         url: `https://api.sarvvid-ai.com/deletefile?IMEI=${localStorage.getItem("IMEI")}&filename=${this.props.entry.name}&filesize=${this.props.entry.size}`,
//         headers: {Accept: "application/json, text/plain, */*",
//                   authtoken: localStorage.getItem("authtoken")},
//         data: JSON.stringify(obj)

//       });

//       console.log("deleteResp...", deleteResp)

//       localStorage.setItem("filled_per", deleteResp.data.storageFilled)
//       localStorage.setItem("remaining_per", deleteResp.data.storageRemain)

//       const resp =  await axios({
//             method: "post",
//             url: "https://api.sarvvid-ai.com/updatefileSystem",
//             headers: {
//               "Content-type": "application/json",
//               authtoken: localStorage.getItem("authtoken"),
//             },
//             data: {
//               IMEI: localStorage.getItem("IMEI"),
//               fileSystem: localStorage.getItem("fileSystem"),
//             },
//           })
//           this.props.setEntry(JSON.parse(localStorage.getItem("fileSystem")));
//       if(resp.success){
//         console.log("file system updated after deletion")
//       }

//       console.log("updatefilesystem response....", resp)

//     } catch (error) {
//       console.log("Delete file...",error)
//     }

//   };

//   enterFolder = () => {
//     if (this.props.entry.type === FOLDER)
//       this.props.history.push(this.props.entry.path);
//   };

//   render() {
//     const { entry } = this.props;
//     let ext = entry.name.split(".").filter((el) => el);

//     ext = ext.length >= 2 ? ext[ext.length - 1] : "";

//     return (
//       <Container ref={this.nodeRef} onClick={() => this.enterFolder()} style = {{background: `${this.darkTheme ? "#121212" : "#fff"}` }} >
//         <Logo onClick={() => this.enterFolder()}>
//           <Img src={entry.type == FILE ? FileIcon : FolderIcon} />
//           {/* {entry.type == FILE ? <span>{`.${ext}`}</span> : ""} */}
//         </Logo>
//         <Name >{entry.name}</Name>
//         {this.state.visible && (
//           <Menu
//             style={this.state.style}
//             content={[
//               {
//                 info: "Download",
//                 onClick: () => {
//                   this.setState({ loading: true });
//                   axios
//                     .request({
//                       method: "get",
//                       url: `https://api.sarvvid-ai.com/cat?filehash=${
//                         entry.name
//                       }&IMEI=${localStorage.getItem(
//                         "IMEI"
//                       )}&ping=${localStorage.getItem("ping")}`,
//                       headers: {
//                         Accept: "application/json, text/plain, */*",
//                         Authtoken: localStorage.getItem("authtoken"),
//                         "Content-Type": "application/json",
//                       },
//                       responseType: "blob",
//                     })
//                     .then((response) => {
//                       this.setState({ loading: false });
//                       fileDownload(response.data, entry.name);

//                       console.log(response);
//                     });
//                 },
//               },
//               {
//                 info: "Share",
//                 onClick: () =>
//                   this.setState({
//                     showInfo: true,
//                   }),
//               },
//               {
//                 info: "Delete",
//                 style: { color: "red" },
//                 onClick: () => {
//                   this.handleDelete();
//                 },
//               },
//             ]}
//           />
//         )}
//         {this.state.showInfo ? (
//           <FileInfo
//             title="File Info"
//             style={this.state.prevStyle}
//             closeFn={() =>
//               this.setState({
//                 showInfo: false,
//               })
//             }
//             entry={{
//               type: entry.type,
//               name: entry.name,
//               path: "/",
//               ext: ext,
//               size: entry.size,
//               date: entry.date,
//               creatorName: entry.creatorName,
//             }}
//           />
//         ) : (
//           ""
//         )}
//         {this.state.loading ? <LoadingContainer /> : ""}
//       </Container>
//     );
//   }
// }

const Icon = (props) => {
  const nodeRef = useRef();
  const darkTheme = useTheme();
  const toggleMenuValue = useMenuToggle();
  const enc = getEnc();
  const dispatch = useDispatch();
  const { deleteLoading } = useSelector((state) => state.loader);

  const [visible, setVisible] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [style, setStyle] = useState({ right: 0, left: 0 });
  const [loading, setLoading] = useState(false);
  const [prevStyle, setPrevStyle] = useState({});
  const [animationOpen, setAnimationOpen] = useState(false);

  // console.log("Entry in Icon...", props.entry);

  const _handleContextMenu = (e) => {
    e.preventDefault();

    const path = e.composedPath();

    const wasOutside = !path.includes(nodeRef.current) || false;

    if (wasOutside) {
      setVisible(false);

      setStyle({ right: 0, left: 0 });
      setPrevStyle({ right: 0, left: 0 });

      return;
    }

    const clickX = e.clientX;
    const clickY = e.clientY;

    const right = clickX;
    const left = !right;

    const top = clickY;
    const bottom = !top;

    const style = {
      left: 0,
      top: 0,
    };

    if (right) {
      style.left = `${clickX}`;
    }

    if (left) {
      style.left = `${clickX}`;
    }

    if (top) {
      style.top = `${clickY + 54}`;
    }

    if (bottom) {
      style.top = `${clickY + 54}`;
    }

    const prevStyle = {
      top: style.top,
      left: style.left,
    };

    setStyle(style);
    setVisible(true);
    setPrevStyle(prevStyle);
  };

  const _handleMouseLeave = (e) => {
    const wasOutside = !e.target.contains(nodeRef.current);

    if (!visible) {
      setVisible(false);
      return;
    }

    if (wasOutside === visible) {
      setVisible(false);
      setStyle({ right: 0, left: 0 });
    }
  };

  const showAnim = () => {
    setAnimationOpen(true);
    console.log("show anim...", animationOpen);
    hideAnim();
  };

  const hideAnim = () => {
    dispatch(setDeleteLoading(true));
    setTimeout(() => {
      dispatch(setDeleteLoading(false));
    }, 2000);
  };

  const handleDelete = async () => {
    console.log("fileEntry...", props.entry);

    try {
      console.log("hi.....", props.entry);
      props.deleteFn();

      const data = JSON.parse(localStorage.getItem("recycleBin"));

      console.log("recycleData before...", data);

      const pid = "1382b6993e9f270cb1c29833be3f5750";

      var newEntry = {};
      newEntry.parentPath = "/";
      newEntry.name = props.entry.name;

      newEntry.type = FILE;
      newEntry.mimetype = props.entry.mimetype;
      newEntry.path =
        newEntry.parentPath === "/"
          ? `${newEntry.parentPath}${newEntry.name}`
          : `${newEntry.parentPath}/${newEntry.name}`;
      let id = md5(newEntry.path + newEntry.type);

      if (id in data) {
        let arr = props.entry.name.split(".");
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
      newEntry.size = props.entry.size;
      newEntry.parentID = pid;
      data[id] = newEntry;
      data["1382b6993e9f270cb1c29833be3f5750"].children.push(id);

      console.log("recycle data after...", data);

      localStorage.setItem("recycleBin", JSON.stringify(data));

      const obj = {
        IMEI: localStorage.getItem("IMEI"),
        filestructure: props.entry,
      };

      console.log("delete file obj...", JSON.stringify(obj));

      const deleteResp = await axios({
        method: "post",
        url: `https://api.sarvvid-ai.com/deletefile?IMEI=${localStorage.getItem(
          "IMEI"
        )}&filename=${props.entry.name}&filesize=${props.entry.size}`,
        headers: {
          authtoken: localStorage.getItem("authtoken"),
          verificationToken: enc,
        },
        data: {
          IMEI: localStorage.getItem("IMEI"),
          fileSystem: localStorage.getItem("fileSystem"),
          recycleBin: localStorage.getItem("recycleBin"),
          fileEntry: props.entry,
        },
      });

      console.log("deleteResp...", deleteResp);

      props.setEntry(JSON.parse(localStorage.getItem("fileSystem")));
      hideAnim();
    } catch (error) {
      console.log("Delete file...", error);
    }
  };

  const enterFolder = () => {
    if (props.entry.type === FOLDER) props.history.push(props.entry.path);
  };

  const { entry } = props;
  let ext = entry.name.split(".").filter((el) => el);

  ext = ext.length >= 2 ? ext[ext.length - 1] : "";

  useEffect(() => {
    document.addEventListener("contextmenu", _handleContextMenu);
    document.addEventListener("click", _handleMouseLeave);

    return () => {
      document.addEventListener("click", _handleMouseLeave);
      document.addEventListener("contextmenu", _handleContextMenu);
    };
  }, []);

  const getExt = (fileName) => {
    return fileName.split(".").pop();
  };

  const getSize = (fileSize) => {
    if (fileSize < 1000000) return `${(fileSize / 1000).toFixed(2)} kb`;
    else if (fileSize < 1000000000)
      return `${(fileSize / 1000000).toFixed(2)} mb`;
    else return `${(fileSize / 1000000000).toFixed(2)} gb`;
  };

  return props.entry.name === "Restored" &&
    props.entry.children.length === 0 ? (
    ""
  ) : (
    <div>
      <Container
        ref={nodeRef}
        onClick={() => enterFolder()}
        className={`card-container ${darkTheme ? "dark-theme" : ""}`}
      >
        {/* <div className="lottie">
      <Lottie 
        options={defaultLottieOptions}
          height={40}
          width={40}
        />
      </div> */}
        <div className="file-card">
          <div className="file-name">
            <Logo onClick={() => enterFolder()}>
              <Img src={entry.type == FILE ? FileIcon : FolderIcon} />
              {/* {entry.type == FILE ? <span>{`.${ext}`}</span> : ""} */}
            </Logo>
            <Name className="name">{entry.name}</Name>
          </div>
          <div className="file-size">
            <p>{props.entry.type != "__folder__" ? getSize(entry.size) : ""}</p>
          </div>
          <div className="file-type">
            <p>{entry.type === FILE ? getExt(entry.name) : ""}</p>
          </div>
        </div>
        {visible ? (
          <Menu
            style={style}
            content={[
              {
                info: "Download",
                onClick: () => {
                  // setLoading(true);
                  dispatch(setDownloadLoading(true));
                  axios
                    .request({
                      method: "get",
                      url: `https://api.sarvvid-ai.com/cat?filehash=${
                        entry.name
                      }&IMEI=${localStorage.getItem(
                        "IMEI"
                      )}&ping=${localStorage.getItem("ping")}`,
                      headers: {
                        Accept: "application/json, text/plain, */*",
                        Authtoken: localStorage.getItem("authtoken"),
                        "Content-Type": "application/json",
                        verificationToken: enc,
                      },
                      responseType: "blob",
                    })
                    .then((response) => {
                      setLoading(false);
                      fileDownload(response.data, entry.name);

                      console.log("Download resp...", response);
                      dispatch(setDownloadLoading(false));
                    });
                },
              },
              {
                info: "Details",
                onClick: () => setShowInfo(true),
              },
              {
                info: "Delete",
                style: { color: "red" },
                onClick: () => {
                  handleDelete();
                  showAnim();
                },
              },
            ]}
          />
        ) : (
          ""
        )}
        <Modal
          open={showInfo}
          onClose={() => setShowInfo(false)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FileInfo
            title="File Info"
            style={prevStyle}
            closeFn={() => setShowInfo(false)}
            entry={{
              type: entry.type,
              name: entry.name,
              path: "/",
              ext: ext,
              size: entry.size,
              date: entry.date,
              creatorName: entry.creatorName,
            }}
            fileEntry={props.entry}
            deleteFn={props.deleteFn}
            hideAnim={hideAnim}
            setEntry={props.setEntry}
          />
        </Modal>
        {/* {loading ? <LoadingContainer /> : ""} */}
      </Container>
      {deleteLoading ? <DeleteLottie /> : ""}
    </div>
  );
};

export default withRouter(Icon);
