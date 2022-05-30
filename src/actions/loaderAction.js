import {
  SET_DELETE_LOADING,
  SET_UPLOAD_LOADING,
  SET_DOWNLOAD_LOADING,
} from "../utils/constants";

export const setUploadLoading = (value) => {
  return {
    type: SET_UPLOAD_LOADING,
    payload: value,
  };
};

export const setDeleteLoading = (value) => {
  return {
    type: SET_DELETE_LOADING,
    payload: value,
  };
};

export const setDownloadLoading = (value) => {
  return {
    type: SET_DOWNLOAD_LOADING,
    payload: value,
  };
};
