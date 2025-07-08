'use client';

import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDarkMode: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className={`inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform rounded-2xl shadow-xl ${
          isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className={`max-h-96 overflow-y-auto ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            {children}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LegalModalsProps {
  isDarkMode: boolean;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ isDarkMode }) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const termsContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">1. Chấp nhận điều khoản</h4>
        <p className="text-sm">
          Bằng cách truy cập và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng này.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">2. Sử dụng dịch vụ</h4>
        <p className="text-sm">
          Bạn có thể sử dụng dịch vụ của chúng tôi cho các mục đích hợp pháp và theo cách thức không vi phạm quyền của bên thứ ba hoặc hạn chế, cản trở việc sử dụng và tận hưởng dịch vụ của người khác.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">3. Tài khoản người dùng</h4>
        <p className="text-sm">
          Khi tạo tài khoản, bạn phải cung cấp thông tin chính xác và cập nhật. Bạn có trách nhiệm bảo mật thông tin tài khoản và tất cả các hoạt động diễn ra dưới tài khoản của mình.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">4. Nội dung người dùng</h4>
        <p className="text-sm">
          Bạn chịu trách nhiệm về mọi nội dung mà bạn đăng tải hoặc truyền qua dịch vụ. Nội dung không được vi phạm pháp luật, xâm phạm quyền của người khác hoặc có tính chất spam.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">5. Quyền sở hữu trí tuệ</h4>
        <p className="text-sm">
          Dịch vụ và nội dung gốc, tính năng và chức năng của nó là và sẽ vẫn là tài sản độc quyền của chúng tôi và các bên cấp phép cho chúng tôi.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">6. Chấm dứt</h4>
        <p className="text-sm">
          Chúng tôi có thể chấm dứt hoặc tạm ngừng tài khoản của bạn ngay lập tức, không cần thông báo trước, vì bất kỳ lý do gì, bao gồm cả việc vi phạm Điều khoản.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">7. Liên hệ</h4>
        <p className="text-sm">
          Nếu bạn có bất kỳ câu hỏi nào về Điều khoản này, vui lòng liên hệ với chúng tôi qua email: support@tazagroup.com
        </p>
      </div>
    </div>
  );

  const privacyContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">1. Thông tin chúng tôi thu thập</h4>
        <p className="text-sm">
          Chúng tôi thu thập thông tin bạn cung cấp trực tiếp cho chúng tôi, chẳng hạn như khi bạn tạo tài khoản, cập nhật hồ sơ của mình, hoặc liên hệ với chúng tôi.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">2. Cách chúng tôi sử dụng thông tin</h4>
        <p className="text-sm">
          Chúng tôi sử dụng thông tin để cung cấp, duy trì và cải thiện dịch vụ, xử lý giao dịch, gửi thông tin kỹ thuật và hỗ trợ khách hàng.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">3. Chia sẻ thông tin</h4>
        <p className="text-sm">
          Chúng tôi không bán, trao đổi hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba mà không có sự đồng ý của bạn, trừ khi được mô tả trong chính sách này.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">4. Bảo mật dữ liệu</h4>
        <p className="text-sm">
          Chúng tôi thực hiện các biện pháp bảo mật phù hợp để bảo vệ thông tin cá nhân của bạn khỏi truy cập, thay đổi, tiết lộ hoặc phá hủy trái phép.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">5. Cookies và công nghệ theo dõi</h4>
        <p className="text-sm">
          Chúng tôi sử dụng cookies và các công nghệ tương tự để theo dõi hoạt động trên dịch vụ của mình và lưu giữ thông tin nhất định.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">6. Quyền của bạn</h4>
        <p className="text-sm">
          Bạn có quyền truy cập, cập nhật hoặc xóa thông tin cá nhân mà chúng tôi có về bạn. Bạn cũng có thể từ chối nhận thông tin tiếp thị từ chúng tôi.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">7. Thay đổi chính sách</h4>
        <p className="text-sm">
          Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng chính sách mới trên trang này.
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">8. Liên hệ</h4>
        <p className="text-sm">
          Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua email: privacy@tazagroup.com
        </p>
      </div>
    </div>
  );

  return (
    <>
      <span className="text-sm">
        Tôi đồng ý với{' '}
        <button
          type="button"
          onClick={() => setShowTerms(true)}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Điều khoản dịch vụ
        </button>
        {' '}và{' '}
        <button
          type="button"
          onClick={() => setShowPrivacy(true)}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Chính sách bảo mật
        </button>
      </span>

      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Điều khoản dịch vụ"
        isDarkMode={isDarkMode}
      >
        {termsContent}
      </Modal>

      <Modal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Chính sách bảo mật"
        isDarkMode={isDarkMode}
      >
        {privacyContent}
      </Modal>
    </>
  );
};

export default LegalModals;
