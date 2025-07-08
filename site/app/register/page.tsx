'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { siteConfig } from '../lib/config/site';
import { LegalModals } from '../components/LegalModals';
import { 
  validatePassword, 
  validateEmail, 
  validatePhone, 
  validateUsername,
  formatPhoneNumber,
  getPasswordStrengthColor,
  getPasswordStrengthText 
} from '../lib/utils/validation';

interface RegisterFormData {
  displayName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  provider: 'email' | 'phone';
}

export default function RegisterPage() {
  const { register, loading, user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [registerMethod, setRegisterMethod] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState<RegisterFormData>({
    displayName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    provider: 'email',
  });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(''));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Nếu user đã đăng nhập, chuyển hướng về dashboard
    if (user?.isAuthenticated) {
      router.push(siteConfig.auth.redirectAfterLogin);
    }
  }, [user, router]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    setFormData(prev => ({ ...prev, provider: registerMethod }));
  }, [registerMethod]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  const calculatePasswordStrength = (password: string) => {
    const validation = validatePassword(password);
    setPasswordValidation(validation);
    return validation.score;
  };

  const validateField = (name: string, value: string) => {
    const errors: {[key: string]: string} = {};

    switch (name) {
      case 'email':
        if (value && !validateEmail(value)) {
          errors.email = 'Email không hợp lệ';
        }
        break;
      case 'phone':
        if (value && !validatePhone(value)) {
          errors.phone = 'Số điện thoại không hợp lệ';
        }
        break;
      case 'username':
        if (value && !validateUsername(value)) {
          errors.username = 'Tên đăng nhập phải có 3-20 ký tự, chỉ chứa chữ, số, _ hoặc -';
        }
        break;
      case 'displayName':
        if (value && value.length < 2) {
          errors.displayName = 'Tên hiển thị phải có ít nhất 2 ký tự';
        }
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      [name]: errors[name] || ''
    }));
  };

  const getPasswordStrengthText = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return { text: 'Rất yếu', color: 'text-red-500' };
      case 2:
        return { text: 'Yếu', color: 'text-orange-500' };
      case 3:
        return { text: 'Trung bình', color: 'text-yellow-500' };
      case 4:
        return { text: 'Mạnh', color: 'text-blue-500' };
      case 5:
        return { text: 'Rất mạnh', color: 'text-green-500' };
      default:
        return { text: '', color: '' };
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'password') {
      calculatePasswordStrength(value);
    }

    if (name === 'phone' && value) {
      setFormData(prev => ({
        ...prev,
        [name]: formatPhoneNumber(value),
      }));
    }

    validateField(name, value);

    if (error) setError('');
  };

  const validateStep1 = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.displayName.trim()) {
      errors.displayName = 'Vui lòng nhập tên hiển thị';
    } else if (formData.displayName.length < 2) {
      errors.displayName = 'Tên hiển thị phải có ít nhất 2 ký tự';
    }
    
    if (!formData.username.trim()) {
      errors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (!validateUsername(formData.username)) {
      errors.username = 'Tên đăng nhập phải có 3-20 ký tự, chỉ chứa chữ, số, _ hoặc -';
    }
    
    if (registerMethod === 'email') {
      if (!formData.email.trim()) {
        errors.email = 'Vui lòng nhập email';
      } else if (!validateEmail(formData.email)) {
        errors.email = 'Email không hợp lệ';
      }
    }
    
    if (registerMethod === 'phone') {
      if (!formData.phone.trim()) {
        errors.phone = 'Vui lòng nhập số điện thoại';
      } else if (!validatePhone(formData.phone)) {
        errors.phone = 'Số điện thoại không hợp lệ';
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError(Object.values(errors)[0]);
      return false;
    }

    setValidationErrors({});
    return true;
  };

  const validateStep2 = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (!passwordValidation.isValid) {
      errors.password = 'Mật khẩu không đáp ứng yêu cầu bảo mật';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'Vui lòng đồng ý với điều khoản và điều kiện';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError(Object.values(errors)[0]);
      return false;
    }

    setValidationErrors({});
    return true;
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep2()) return;

    try {
      const registerData = {
        displayName: formData.displayName,
        username: formData.username,
        password: formData.password,
        provider: formData.provider,
        ...(registerMethod === 'email' ? { email: formData.email } : { phone: formData.phone }),
      };

      const success = await register(registerData);
      
      if (success) {
        router.push(siteConfig.auth.redirectAfterLogin);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng ký');
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
          currentStep >= 1 
            ? 'bg-blue-600 border-blue-600 text-white' 
            : isDarkMode ? 'border-slate-600 text-slate-400' : 'border-gray-300 text-gray-400'
        }`}>
          {currentStep > 1 ? '✓' : '1'}
        </div>
        <div className={`w-16 h-0.5 mx-2 ${
          currentStep > 1 
            ? 'bg-blue-600' 
            : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
        }`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
          currentStep >= 2 
            ? 'bg-blue-600 border-blue-600 text-white' 
            : isDarkMode ? 'border-slate-600 text-slate-400' : 'border-gray-300 text-gray-400'
        }`}>
          2
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Thông tin cơ bản
        </h2>
        <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
          Vui lòng nhập thông tin cá nhân của bạn
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setRegisterMethod('email')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
            registerMethod === 'email'
              ? 'bg-blue-600 text-white'
              : isDarkMode 
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setRegisterMethod('phone')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
            registerMethod === 'phone'
              ? 'bg-blue-600 text-white'
              : isDarkMode 
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Số điện thoại
        </button>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
          Tên hiển thị *
        </label>
        <input
          type="text"
          name="displayName"
          value={formData.displayName}
          onChange={handleInputChange}
          required
          className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            validationErrors.displayName 
              ? 'border-red-500 focus:ring-red-500' 
              : isDarkMode
                ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
          placeholder="Nguyễn Văn A"
        />
        {validationErrors.displayName && (
          <p className="text-red-400 text-xs mt-1">{validationErrors.displayName}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
          Tên đăng nhập *
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
          className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            validationErrors.username 
              ? 'border-red-500 focus:ring-red-500' 
              : isDarkMode
                ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
          placeholder="username"
        />
        {validationErrors.username && (
          <p className="text-red-400 text-xs mt-1">{validationErrors.username}</p>
        )}
      </div>

      {registerMethod === 'email' ? (
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.email 
                ? 'border-red-500 focus:ring-red-500' 
                : isDarkMode
                  ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            placeholder="your@email.com"
          />
          {validationErrors.email && (
            <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
          )}
        </div>
      ) : (
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            Số điện thoại *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.phone 
                ? 'border-red-500 focus:ring-red-500' 
                : isDarkMode
                  ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            placeholder="+84 123 456 789"
          />
          {validationErrors.phone && (
            <p className="text-red-400 text-xs mt-1">{validationErrors.phone}</p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleNext}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Tiếp tục
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Bảo mật tài khoản
        </h2>
        <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
          Tạo mật khẩu mạnh để bảo vệ tài khoản
        </p>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
          Mật khẩu *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.password 
                ? 'border-red-500 focus:ring-red-500' 
                : isDarkMode
                  ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordValidation.score <= 1 ? 'bg-red-500' :
                    passwordValidation.score === 2 ? 'bg-orange-500' :
                    passwordValidation.score === 3 ? 'bg-yellow-500' :
                    passwordValidation.score === 4 ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(passwordValidation.score / 5) * 100}%` }}
                />
              </div>
              <span className={`text-xs ${getPasswordStrengthText(passwordValidation.score).color}`}>
                {getPasswordStrengthText(passwordValidation.score).text}
              </span>
            </div>
            {passwordValidation.feedback.length > 0 && (
              <div className="mt-1 text-xs text-gray-500">
                <ul className="list-disc list-inside">
                  {passwordValidation.feedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {validationErrors.password && (
          <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
          Xác nhận mật khẩu *
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.confirmPassword 
                ? 'border-red-500 focus:ring-red-500' 
                : isDarkMode
                  ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {showConfirmPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-red-400 text-xs mt-1">Mật khẩu xác nhận không khớp</p>
        )}
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleInputChange}
          className={`mt-1 mr-3 rounded ${
            isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-gray-300 bg-white'
          }`}
          required
        />
        <label className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
          <LegalModals isDarkMode={isDarkMode} />
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleBack}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            isDarkMode
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Quay lại
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </div>
    </div>
  );

  return (
    <main
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-gray-100 via-white to-gray-100'
      }`}
    >
      <div className="w-full max-w-md">
        {/* Dark Mode Toggle */}
        <div className="!fixed top-10 right-10 flex justify-end mb-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-all duration-200 ${
              isDarkMode
                ? 'bg-white/10 hover:bg-white/20 text-yellow-400'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" />
              </svg>
            )}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Tạo tài khoản mới
          </h1>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            Tham gia cùng chúng tôi ngay hôm nay
          </p>
        </div>

        {/* Main Form Container */}
        <div
          className={`backdrop-blur-sm border rounded-2xl p-8 shadow-2xl transition-all duration-300 ${
            isDarkMode ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'
          }`}
        >
          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {currentStep === 1 ? renderStep1() : renderStep2()}
          </form>

          {/* Social Login (only on step 1) */}
          {currentStep === 1 && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className={`w-full border ${isDarkMode ? 'border-slate-600' : 'border-gray-300'}`}
                  />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span
                    className={`px-4 ${
                      isDarkMode ? 'bg-slate-800/50 text-slate-400' : 'bg-white text-gray-500'
                    }`}
                  >
                    Hoặc đăng ký với
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  className={`w-full flex items-center justify-center px-4 py-3 border rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                    isDarkMode
                      ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                      : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Đăng ký với Google
                </button>
                
                <button 
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-3 bg-[#1877F2] hover:bg-[#166FE5] border border-[#1877F2] rounded-lg transition-all duration-200 text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.856c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Đăng ký với Facebook
                </button>
              </div>
            </>
          )}

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
              Đã có tài khoản?{' '}
              <a
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
