import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { FileText, Scale, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Helmet>
        <title>Điều khoản sử dụng | Mua ngay đi</title>
        <meta name="description" content="Các điều khoản và điều kiện khi sử dụng dịch vụ tại Mua ngay đi. Vui lòng đọc kỹ trước khi tham gia." />
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-white/10 rounded-[40px] p-8 md:p-12"
      >
        <div className="flex items-center gap-4 mb-8 text-brand-primary">
          <FileText size={40} />
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-white">Điều khoản sử dụng</h1>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Scale size={20} className="text-brand-primary" /> 1. Chấp nhận điều khoản
            </h2>
            <p>
              Bằng cách truy cập vào website Mua ngay đi, bạn đồng ý tuân thủ các điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng dịch vụ của chúng tôi.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-brand-primary" /> 2. Trách nhiệm nội dung
            </h2>
            <p>
              Mua ngay đi là một nền tảng tổng hợp tin tức khuyễn mãi. Chúng tôi không trực tiếp bán sản phẩm. Mọi giao dịch, thanh toán, vận chuyển và bảo hành sản phẩm đều do sàn thương mại điện tử (Shopee, Lazada, Tiki) hoặc nhà bán hàng trực tiếp chịu trách nhiệm.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Tính chính xác của thông tin</h2>
            <p>
              Mặc dù chúng tôi cố gắng cập nhật giá và mã giảm giá liên tục, nhưng do tính chất biến động nhanh của thị trường, các mức giá và mã giảm giá có thể thay đổi trên sàn mà chưa kịp cập nhật tại website. Chúng tôi khuyên bạn luôn kiểm tra giá cuối cùng tại giỏ hàng trước khi thanh toán.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Quyền sở hữu trí tuệ</h2>
            <p>
              Toàn bộ nội dung, hình ảnh thiết kế và logo trên website Mua ngay đi đều thuộc sở hữu của chúng tôi. Việc sao chép nội dung cho mục đích thương mại mà không có sự đồng ý bằng văn bản là vi phạm pháp luật.
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
