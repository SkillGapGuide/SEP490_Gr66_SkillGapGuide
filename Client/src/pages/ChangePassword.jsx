import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import { alert, showError, showSuccess } from '../utils/alert';
import image from "../assets/changepass.png";
import { userService } from "../services/userService";
const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);

  const passwordRequirements = [
    { label: 'Ít nhất 8 ký tự', met: formData.newPassword.length >= 8 },
    { label: 'Chữ hoa & thường', met: /(?=.*[a-z])(?=.*[A-Z])/.test(formData.newPassword) },
    { label: 'Số', met: /\d/.test(formData.newPassword) },
    { label: 'Ký tự đặc biệt', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) },
  ];

  const isPasswordValid = passwordRequirements.every(req => req.met);
  const doPasswordsMatch = formData.newPassword === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      showError('Mật khẩu không đáp ứng các yêu cầu!');
      return;
    }
    if (!doPasswordsMatch) {
      showError('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      setLoading(true);
      // TODO: Add API call to change password
      await userService.changePassword(formData.currentPassword
, formData.newPassword
      );
      showSuccess('Thay đổi mật khẩu thành công!');
    } catch (error) {
      showError(error.message || 'Có lỗi xảy ra khi thay đổi mật khẩu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="bg-white/60 backdrop-blur-xl shadow-xl rounded-2xl border border-gray-100 p-8 flex flex-col md:flex-row items-center md:items-start md:space-x-12">
          {/* Left Side */}
          <div className="mb-8 md:mb-0 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <img
              src={image}
              alt="Change Password"
              className="w-32 h-32 md:w-48 md:h-48 object-cover mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-900">Thay đổi mật khẩu</h2>
            <p className="mt-2 text-sm text-gray-600 text-center max-w-sm">
              Cập nhật mật khẩu mới để bảo mật tài khoản của bạn
            </p>
          </div>

          {/* Right Side - Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            {/* Current Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 border-gray-200 bg-white/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPasswords.current ? 
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" /> : 
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  }
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 border-gray-200 bg-white/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPasswords.new ? 
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" /> : 
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  }
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
              </p>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Yêu cầu mật khẩu:
              </h3>
              <div className="space-y-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {req.met ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300" />
                    )}
                    <span className={req.met ? 'text-green-700' : 'text-gray-500'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Xác nhận mật khẩu</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 border-gray-200 bg-white/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPasswords.confirm ? 
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" /> : 
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  }
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isPasswordValid || !doPasswordsMatch}
              className="w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg 
                text-white bg-blue-600 hover:bg-blue-700 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>Xác nhận thay đổi</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
