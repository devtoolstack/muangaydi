import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, Truck, RefreshCcw, CreditCard, Shield } from 'lucide-react';

export default function PolicyPage() {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Helmet>
        <title>Chính sách mua sắm | Mua ngay đi</title>
        <meta name="description" content="Hướng dẫn và chính sách mua sắm thông qua các liên kết giới thiệu tại Mua ngay đi." />
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-white/10 rounded-[40px] p-8 md:p-12"
      >
        <div className="flex items-center gap-4 mb-8 text-brand-primary">
          <ShoppingCart size={40} />
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-white">Chính sách mua sắm</h1>
        </div>

        <p className="text-lg text-slate-400 mb-12">
          Mua ngay đi hoạt động như một kênh tiếp thị liên kết (Affiliate Marketing). Dưới đây là cách thức hoạt động và quyền lợi của bạn.
        </p>

        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <CreditCard className="text-brand-primary mb-4" size={32} />
            <h3 className="text-white font-bold mb-2">Giá cả minh bạch</h3>
            <p className="text-sm text-slate-400">Bạn không phải trả thêm bất kỳ chi phí nào khi mua qua link của chúng tôi. Thậm chí bạn còn nhận được giá rẻ hơn nhờ các mã giảm giá độc quyền.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <Truck className="text-brand-primary mb-4" size={32} />
            <h3 className="text-white font-bold mb-2">Vận chuyển & Giao hàng</h3>
            <p className="text-sm text-slate-400">Các sàn (Shopee, Lazada, Tiki) sẽ trực tiếp xử lý đơn hàng và vận chuyển đến tay bạn theo đúng chính sách của họ.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <RefreshCcw className="text-brand-primary mb-4" size={32} />
            <h3 className="text-white font-bold mb-2">Đổi trả & Hoàn tiền</h3>
            <p className="text-sm text-slate-400">Bạn được hưởng đầy đủ quyền lợi đổi trả 7-15 ngày tùy theo quy định của shop và sàn thương mại điện tử.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <Shield size={32} className="text-brand-primary mb-4" />
            <h3 className="text-white font-bold mb-2">Bảo mật giao dịch</h3>
            <p className="text-sm text-slate-400">Mọi thông tin thanh toán (thẻ tín dụng, ví điện tử) đều được thực hiện trực tiếp trên nền tảng an toàn của Shopee/Lazada/Tiki.</p>
          </div>
        </div>

        <section className="space-y-6 text-slate-300">
          <h2 className="text-2xl font-bold text-white">Tại sao chọn Mua ngay đi?</h2>
          <p>
            Chúng tôi lọc bỏ những sản phẩm kém chất lượng, chỉ giữ lại những deal từ Shop Mall, Shop Yêu Thích hoặc các nhà bán hàng có đánh giá tích cực trên 4.5 sao. Mục tiêu của chúng tôi là giúp người tiêu dùng Việt Nam mua sắm thông thái hơn.
          </p>
        </section>

        <div className="pt-8 border-t border-white/5 mt-12 text-sm text-slate-500 italic">
          Cập nhật lần cuối: 09/05/2026
        </div>
      </motion.div>
    </div>
  );
}
