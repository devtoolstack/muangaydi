import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Shield, Lock, Eye } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Helmet>
        <title>Chính sách bảo mật | Mua ngay đi</title>
        <meta name="description" content="Chính sách bảo mật thông tin người dùng tại Mua ngay đi. Chúng tôi cam kết bảo vệ dữ liệu cá nhân của bạn." />
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-white/10 rounded-[40px] p-8 md:p-12"
      >
        <div className="flex items-center gap-4 mb-8 text-brand-primary">
          <Shield size={40} />
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-white">Chính sách bảo mật</h1>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Eye size={20} className="text-brand-primary" /> 1. Thu thập thông tin
            </h2>
            <p>
              Mua ngay đi không yêu cầu người dùng đăng ký tài khoản để xem deal hoặc mã giảm giá. Chúng tôi chỉ thu thập các thông tin kỹ thuật nặc danh (như cookies, địa chỉ IP) thông qua Google Analytics để cải thiện trải nghiệm người dùng và hiệu suất website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Lock size={20} className="text-brand-primary" /> 2. Sử dụng thông tin
            </h2>
            <p>
              Thông tin thu thập được sử dụng để:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Cá nhân hóa trải nghiệm người dùng hiệu quả hơn.</li>
              <li>Cải thiện nội dung website dựa trên phản hồi và xu hướng tìm kiếm.</li>
              <li>Gửi thông báo về các deal cực hời (nếu bạn đăng ký nhận tin).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Liên kết bên thứ ba</h2>
            <p>
              Website của chúng tôi có chứa các liên kết đến các sàn thương mại điện tử (Shopee, Lazada, Tiki). Khi bạn click vào các liên kết này, bạn sẽ được chuyển đến website của họ. Vui lòng lưu ý rằng chúng tôi không chịu trách nhiệm về chính sách bảo mật của các trang web bên thứ ba đó.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Cam kết bảo mật</h2>
            <p>
              Chúng tôi thực hiện các biện pháp bảo mật tiêu chuẩn (SSL) để bảo vệ thông tin của bạn khỏi việc truy cập trái phép. Dữ liệu của bạn sẽ không bao giờ được mua bán hoặc chia sẻ cho bất kỳ mục đích thương mại nào khác.
            </p>
          </section>

          <div className="pt-8 border-t border-white/5 text-sm text-slate-500 italic">
            Cập nhật lần cuối: 09/05/2026
          </div>
        </div>
      </motion.div>
    </div>
  );
}
