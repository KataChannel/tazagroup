export interface PasswordValidation {
  isValid: boolean;
  score: number;
  feedback: string[];
  requirements: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export const validatePassword = (password: string): PasswordValidation => {
  const requirements = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;
  const feedback: string[] = [];

  if (!requirements.length) feedback.push('Ít nhất 8 ký tự');
  if (!requirements.lowercase) feedback.push('Ít nhất 1 chữ thường');
  if (!requirements.uppercase) feedback.push('Ít nhất 1 chữ hoa');
  if (!requirements.number) feedback.push('Ít nhất 1 số');
  if (!requirements.special) feedback.push('Ít nhất 1 ký tự đặc biệt');

  return {
    isValid: score === 5,
    score,
    feedback,
    requirements,
  };
};

export const getPasswordStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-orange-500';
    case 3:
      return 'bg-yellow-500';
    case 4:
      return 'bg-blue-500';
    case 5:
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
};

export const getPasswordStrengthText = (score: number): { text: string; color: string } => {
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

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Vietnamese phone number validation
  const phoneRegex = /^(\+84|84|0)[3|5|7|8|9]([0-9]{8})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateUsername = (username: string): boolean => {
  // Username: 3-20 characters, letters, numbers, underscore, dash
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as +84 XXX XXX XXX
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `+84 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  } else if (cleaned.length === 9) {
    return `+84 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('84')) {
    return `+84 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  return phone;
};
