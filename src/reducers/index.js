import { combineReducers } from "redux";
import fileSystem from "./fileSystemReducer.js";
import recycleBin from "./recycleBinReducer";
import storage from "./storageReducer";
import allData from "./allDataReducer";
import loader from "./loaderReducer";

export default combineReducers({
  fileSystem,
  recycleBin,
  storage,
  allData,
  loader,
});
