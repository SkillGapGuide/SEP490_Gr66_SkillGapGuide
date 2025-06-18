import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export function showSuccess(msg, title = "Thành công") {
  return MySwal.fire({
    icon: "success",
    title,
    text: msg,
    confirmButtonText: "OK",
  });
}

export function showError(msg, title = "Lỗi") {
  return MySwal.fire({
    icon: "error",
    title,
    text: msg,
    confirmButtonText: "OK",
  });
}

export function showConfirm(msg, title = "Xác nhận") {
  return MySwal.fire({
    icon: "question",
    title,
    text: msg,
    showCancelButton: true,
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Huỷ",
  });
}
export function showInfo(msg, title = "Thông tin") {
  return MySwal.fire({
    icon: "info",
    title,
    text: msg,
    confirmButtonText: "OK",
  });
}

export const alertError = (message, title = "Error") => {
  alert(`${title}\n${message}`);
};

export const alertSuccess = (message, title = "Success") => {
  alert(`${title}\n${message}`);
};

export const alert = {
  success: (message) => {
    Swal.fire({
      icon: "success",
      title: "Thành công",
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  },

  error: (message) => {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: message,
    });
  },

  info: (message) => {
    Swal.fire({
      icon: "info",
      title: "Thông báo",
      text: message,
    });
  },
};