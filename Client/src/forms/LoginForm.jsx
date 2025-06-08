import { useForm } from "react-hook-form";

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-200 via-blue-300 to-blue-500">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-3xl">
        {/* Form Box */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Đăng nhập</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                {...register("email", { required: "Email không được bỏ trống" })}
                placeholder="nguyena@gmail.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Mật khẩu</label>
              <input
                type="password"
                {...register("password", { required: "Mật khẩu không được bỏ trống" })}
                placeholder="Nhập mật khẩu của bạn"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                autoComplete="current-password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 rounded shadow transition focus:ring-2 focus:ring-blue-400"
            >
              Đăng nhập
            </button>
          </form>
          <div className="text-center mt-4 text-sm">
            Bạn đã có tài khoản chưa?{" "}
            <a href="/login" className="text-blue-800 font-semibold hover:underline">
              Đăng nhập
            </a>
          </div>
        </div>
        {/* Text Right */}
        <div className="md:ml-10 mt-8 md:mt-0 text-white flex-1 text-center md:text-left flex items-center justify-center">
          <div className="text-2xl md:text-3xl font-bold drop-shadow">
            Đăng nhập<br />với tài khoản của bạn
          </div>
        </div>
      </div>
    </div>
  );
}
