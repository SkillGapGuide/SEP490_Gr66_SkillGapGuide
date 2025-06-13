import { useForm } from "react-hook-form";
import { useState, memo, useCallback, useEffect } from "react";
import { authService } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

export default memo(function RegisterForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: 'bg-gray-200'
  });

  const onSubmit = useCallback(async (data) => {
    try {
      setRegisterError('');
      setRegisterSuccess('');
      const response = await authService.registerWithEmail(
        data.email, 
        data.password,
        data.fullName,
        data.phone
      );
      
      setRegisterSuccess(response.message || 'Đăng ký thành công, vui lòng kiểm tra email để xác thực tài khoản');
      
      // Delay navigation to allow user to read the message
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      console.error("Registration failed:", error);
      setRegisterError(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }, [navigate]);

  const handleGoogleLogin = useCallback(async () => {
    try {
      await authService.loginWithGoogle();
      navigate('/'); // or wherever you want to redirect
    } catch (error) {
      console.error("Google login failed:", error);
      // Show error message to user
    }
  }, [navigate]);

  const checkPasswordStrength = (password) => {
    let score = 0;
    let message = '';
    let color = 'bg-gray-200';

    if (!password) {
      setPasswordStrength({ score: 0, message: '', color: 'bg-gray-200' });
      return;
    }

    // Optional strength indicators without enforcing them
    if (password.length >= 8) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[a-z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^A-Za-z0-9]/)) score += 1;

    switch (score) {
      case 0:
      case 1:
        message = 'Rất yếu';
        color = 'bg-red-500';
        break;
      case 2:
        message = 'Yếu';
        color = 'bg-orange-500';
        break;
      case 3:
        message = 'Trung bình';
        color = 'bg-yellow-500';
        break;
      case 4:
        message = 'Mạnh';
        color = 'bg-blue-500';
        break;
      case 5:
        message = 'Rất mạnh';
        color = 'bg-green-500';
        break;
    }

    setPasswordStrength({ score, message, color });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-200 via-blue-300 to-blue-500">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-3xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Đăng ký</h2>
          {registerError && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {registerError}
            </div>
          )}
          {registerSuccess && (
            <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
              {registerSuccess}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Họ và tên</label>
              <input
                {...register("fullName", { 
                  required: "Họ và tên không được bỏ trống",
                  minLength: {
                    value: 2,
                    message: "Họ tên phải có ít nhất 2 ký tự"
                  },
                  pattern: {
                    value: /^[a-zA-ZÀ-ỹ\s]{2,}$/,
                    message: "Họ tên chỉ được chứa chữ cái và khoảng trắng"
                  }
                })}
                placeholder="Nguyễn Văn A"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
              <input
                {...register("phone", {
                  required: "Số điện thoại không được bỏ trống",
                  pattern: {
                    value: /^(0|84)[0-9]{9}$/,
                    message: "Số điện thoại không hợp lệ (VD: 0912345678 hoặc 84912345678)"
                  }
                })}
                placeholder="0912345678"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                {...register("email", { 
                  required: "Email không được bỏ trống",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ"
                  }
                })}
                placeholder="nguyena@gmail.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Mật khẩu</label>
              <input
                type="password"
                {...register("password", { 
                  required: "Mật khẩu không được bỏ trống",
                  onChange: (e) => checkPasswordStrength(e.target.value)
                })}
                placeholder="Nhập mật khẩu của bạn"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              
              {/* Password Strength Indicator - now just informative */}
              <div className="mt-2">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
                {passwordStrength.message && (
                  <p className="text-sm mt-1 text-gray-600">
                    Độ mạnh mật khẩu: <span className="font-medium">{passwordStrength.message}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 rounded shadow transition focus:ring-2 focus:ring-blue-400"
            >
              Đăng ký
            </button>
          </form>

          <div className="mt-4 flex items-center justify-center">
            <span className="border-t w-full"></span>
            <span className="px-4 text-gray-500">hoặc</span>
            <span className="border-t w-full"></span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Đăng ký bằng Google
          </button>

          <div className="text-center mt-4 text-sm">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-blue-800 font-semibold hover:underline">
              Đăng nhập
            </Link>
          </div>
        </div>
        
        <div className="md:ml-10 mt-8 md:mt-0 text-white flex-1 text-center md:text-left flex items-center justify-center">
          <div className="text-2xl md:text-3xl font-bold drop-shadow">
            Đăng ký<br />tài khoản mới
          </div>
        </div>
      </div>
    </div>
  );
});
