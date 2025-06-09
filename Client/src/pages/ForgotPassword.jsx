import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [sent, setSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef(null);

  const onSubmit = async data => {
    // Giả lập API kiểm tra email
    const isExist = await fakeCheckEmail(data.email);

    if (isExist) {
      setSent(true);
      setTimer(60); // Đếm ngược 60s

      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setSent(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      alert("Email không tồn tại trong hệ thống!");
    }
  };

  // Giả lập API check email (thay bằng API thật của bạn)
  async function fakeCheckEmail(email) {
    await new Promise(res => setTimeout(res, 1000));
    // Giả lập email hợp lệ
    return email === "nguyena@gmail.com" || email === "test@gmail.com";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-300 via-blue-400 to-blue-200">
      <div className="bg-white rounded-[2rem] shadow-2xl px-10 py-8 w-full max-w-lg flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 text-center">Quên mật khẩu</h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="font-bold text-lg text-black">Email</label>
          <input
            {...register("email", { required: "Vui lòng nhập email" })}
            type="email"
            placeholder="Nhập email của bạn"
            className="w-full px-4 py-3 bg-gray-50 text-gray-800 placeholder-gray-400 rounded-xl outline-none text-lg font-medium mb-2 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
            autoFocus
            disabled={sent}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

          {sent && (
            <div className="text-blue-600 text-base text-center mt-2 mb-2">
              Đã gửi email! Vui lòng kiểm tra hộp thư.
              <br />
              Bạn có thể gửi lại sau <span className="font-bold">{timer}s</span>
            </div>
          )}

          <button
            type="submit"
            className={`mx-auto mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-xl shadow text-lg transition ${
              sent ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={sent}
          >
            Gửi
          </button>
        </form>
        <div className="text-center mt-8 text-base">
          Bạn nhớ lại mật khẩu?{" "}
          <Link to="/login" className="font-bold text-black hover:underline">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
