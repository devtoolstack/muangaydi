import { BlogPost, BLOG_POSTS } from '../data/blogData';
import { Product } from '../types';
import { slugify } from '../lib/utils';

// Helper to determine stable reading time and publish dates based on product details
function getStaggeredDate(name: string): string {
  // Use character code sum of the name to generate a stable, consistent date
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  const dayNum = 10 + (sum % 16); // day between 10 and 25
  return `2026-05-${dayNum.toString().padStart(2, '0')}`;
}

function getReadingTime(text: string): string {
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 180) + 2;
  return `${minutes} phút đọc`;
}

// Generate compiled blog post content based on product categories & details
function buildRichSEOContent(product: Product): { title: string; description: string; content: string } {
  const name = product.name || 'Sản phẩm cao cấp';
  const category = product.category || 'Chưa phân loại';
  const desc = product.description || 'Sản phẩm mua sắm tiết kiệm chất lượng cao, bền bỉ và tiện dụng.';
  const price = product.price || 'Liên hệ';

  let title = `Đánh Giá Chi Tiết ${name}: Có Đáng Để Bạn Đầu Tư Sở Hữu?`;
  let description = `Review chi tiết sản phẩm ${name}. Chia sẻ kinh nghiệm thực tế khi sử dụng và hướng dẫn mẹo săn voucher giảm giá khủng giúp bạn mua sắm siêu rẻ.`;

  // Dynamic Content parts
  let intro = '';
  let detailSection = '';
  let specsTable = '';
  let savingsGuide = '';
  let prosCons = '';
  let conclusion = '';

  if (category === 'Thời trang') {
    title = `Đánh Giá Thực Tế Sức Hút Của ${name}: Form Dáng Có Chuẩn, Chất Vải Có Mát Như Quảng Cáo?`;
    description = `Review khách quan chi tiết từ A-Z dòng sản phẩm thời trang ${name}. Chia sẻ trải nghiệm mặc thực tế, phân tích chất liệu vải và bí quyết săn deal tiết kiệm nhất.`;
    
    intro = `<h3>Thời trang nam nữ hiện đại và bài toán cân đối ngân sách mua sắm</h3>
<p>Trong cuộc sống bận rộn ngày nay, việc sở hữu một diện mạo chỉn chu, thanh lịch đóng vai trò vô cùng to lớn giúp chúng ta tự tin hơn trong giao tế lẫn công việc hàng ngày. Tuy nhiên, việc đầu tư quá nhiều vào trang phục cao cấp thiết kế đôi khi gây gánh nặng lên ví tiền của bạn. Hiểu được nhu cầu đó, sản phẩm <strong>${name}</strong> xuất hiện như một giải pháp thời trang lý tưởng, kết hợp hài hòa giữa yếu tố thẩm mỹ hợp mốt, tính tiện dụng cao và quan trọng là mức giá vô cùng hợp lý với túi tiền của đại đa số người tiêu dùng Việt Nam.</p>`;

    detailSection = `<h3>Đánh giá chi tiết về sản phẩm ${name}: Thiết kế, Chất liệu và Trải nghiệm thực tế</h3>
<p>Sản phẩm nổi bật với thiết kế mang đậm tinh thần tối giản nhưng cực kì cuốn hút. Được may từ dòng sợi tuyển chọn kĩ càng, đặc trưng của chất liệu này là khả năng <strong>co giãn tốt, bề mặt mềm mịn, an toàn tuyệt hảo với làn da nhạy cảm</strong> và hỗ trợ thoát ẩm vô cùng nhanh chóng. Form dáng được tinh chỉnh kỹ lưỡng giúp đem lại cảm giác tự tin cho người mặc trong mọi hoạt động di chuyển.</p>
<p>Qua trải nghiệm sử dụng thực tế dài ngày, sản phẩm giữ màu vô cùng tốt qua các chu kỳ giặt máy, không gặp hiện tượng nhăn nheo hay xuống dáng. Từng đường kim mũi chỉ được gia công sắc sảo từ các xưởng may Việt Nam uy tín phản ánh tay nghề thủ công cao cấp.</p>`;

    specsTable = `<h3>Bảng thông số kỹ thuật và hướng dẫn chọn size thực tế</h3>
<p>Tìm hiểu các thông số chi tiết của sản phẩm để đưa ra lựa chọn mua sắm kinh tế, bền đẹp nhất hằng ngày:</p>
<table>
  <tr>
    <th>Đặc tính sản phẩm</th>
    <th>Thông số chi tiết của ${name}</th>
    <th>Các dòng thời trang thông thường khác</th>
  </tr>
  <tr>
    <td><strong>Chất liệu vải</strong></td>
    <td>Chất thun/sợi cao cấp, thoáng khí và co giãn cực tốt</td>
    <td>Vải pha nhiều nylon, dễ xù lông, bám mồ hôi nóng bức</td>
  </tr>
  <tr>
    <td><strong>Độ bền giặt sấy</strong></td>
    <td>Không bai nhão, không xơ xước, giữ form nguyên bản tốt</td>
    <td>Dễ giãn ống co rút, phai màu nhanh chóng sau vài lần giặt</td>
  </tr>
  <tr>
    <td><strong>Giá trị kinh tế</strong></td>
    <td>Giá tiết kiệm, tuổi thọ sử dụng trên 1-2 năm cực tốt</td>
    <td>Giá rẻ nhưng nhanh hỏng, tốn chi phí đổi mới liên tục</td>
  </tr>
</table>`;

    savingsGuide = `<h3>Bí quyết săn voucher và deal sốc tại Mua ngay đi hằng ngày</h3>
<p>Để sở hữu <strong>${name}</strong> với giá thành tốt nhất trên thị trường, bạn hãy ghi nhớ mẹo săn sale độc quyền sau: Truy cập ngay chuyên mục "Khuyến mãi" trên <strong>Mua ngay đi</strong> để lấy link mua sắm phân phối chính hãng kèm mã cung cấp voucher độc quyền của shop. Tiếp đến, hãy săn sản phẩm vào các khung giờ vàng Flash Sale trên Shopee, Lazada hoặc Tiki như 0h, 9h, 12h và 21h. Bạn nên kết hợp dồn đồng thời 3 tầng mã gồm: mã giảm của shop, mã giảm toàn sàn và mã miễn phí vận chuyển để tiết kiệm tối đa lên đến 40% chi phí thực tế.</p>`;

    prosCons = `<h3>Ưu điểm và Nhược điểm thực tế</h3>
<ul>
  <li><strong>Ưu điểm:</strong> Thiết kế thời trang hợp phong cách và cực kỳ phù hợp cho nhiều nhu cầu đi học, đi chơi, đi làm công sở; Vải mềm mát dễ chịu; Mức giá vô cùng cạnh tranh.</li>
  <li><strong>Nhược điểm:</strong> Form dáng có thể hơi ôm nhẹ nên với các bạn ưa thích dáng mặc suông rộng rác vui lòng tăng thêm 1 size khi đặt hàng.</li>
</ul>`;

    conclusion = `<h3>Kết luận đầu tư tài chính: Ai nên mua?</h3>
<p>Sản phẩm thời trang <strong>${name}</strong> đích thị là sự bổ sung lý tưởng dành cho những ai muốn chi tiêu thông minh mà vẫn giữ được sự chỉn chu, thanh lịch tinh tế. Click liên kết mua sắm tại Mua ngay đi để nhận link trợ giá trực tiếp tốt nhất hôm nay!</p>`;

  } else if (category === 'Phụ kiện' || category === 'Thiết bị' || category === 'Điện tử') {
    title = `Đánh Giá Chi Tiết Phụ Kiện Phân Khúc Hot ${name}: Bất Ngờ Về Hiệu Năng & Hướng Dẫn Săn Deal`;
    description = `Review chi tiết dòng phụ kiện công nghệ ${name}. Khám phá độ bền, độ an toàn và hướng dẫn lấy mã giảm giá tốt nhất để tối ưu chi phí mua sắm hằng ngày.`;

    intro = `<h3>Tối ưu năng suất công việc và giải pháp phụ kiện công nghệ chất lượng cao</h3>
<p>Trong thời đại số hóa làm việc trực tuyến như hiện nay, việc trang bị các phụ kiện tin cậy hỗ trợ đắc lực cho các thiết bị điện tử của bạn là vô cùng quan trọng. Tuy nhiên, việc bỏ ra một số tiền quá lớn cho các thương hiệu nước ngoài đắt đỏ chưa hẳn đã là lựa chọn kinh tế tốt nhất. Dòng sản phẩm <strong>${name}</strong> nổi bật như một ứng cử viên thay thế hoàn hảo có thể cung cấp hiệu suất vượt trội, vô cùng an toàn mà mức giá lại rất vừa túi tiền.</p>`;

    detailSection = `<h3>Đặc điểm thiết kế thông minh và hiệu suất thực tế của ${name}</h3>
<p>Sản phẩm ghi điểm với kết cấu thiết kế tinh xảo, sử dụng các vật liệu thông minh chống mài mòn, chịu nhiệt hiệu quả. Qua các chỉ số kiểm nghiệm kỹ lưỡng, sản phẩm đem tới khả năng vận hành ổn định lâu dài giúp tối ưu hiệu suất công việc và hạn chế tối đa chi phí sửa chữa hằng ngày cho bạn.</p>`;

    specsTable = `<h3>Bảng phân tích thông số hiệu năng và tối ưu chi tiêu hằng năm</h3>
<p>Tìm hiểu các thông số chi tiết giúp đánh giá trực quan nhất hiệu năng vượt trội của thiết bị:</p>
<table>
  <tr>
    <th>Tiêu chí so sánh</th>
    <th>Sản phẩm cao cấp ${name}</th>
    <th>Loại phụ kiện giá rẻ trôi nổi khác</th>
  </tr>
  <tr>
    <td><strong>Độ bền vật liệu</strong></td>
    <td>Chất liệu chuẩn siêu bền, khả năng chịu lực va đập cực tốt</td>
    <td>Nhựa mỏng dễ giòn rách, hư hỏng sau vài tuần sử dụng dồn dập</td>
  </tr>
  <tr>
    <td><strong>Chứng nhận an toàn</strong></td>
    <td>Tích hợp chip thông minh chống quá dòng, quá tải an toàn</td>
    <td>Không có mạch ngăn ngừa sự cố, tiềm ẩn nguy cơ phát hỏa</td>
  </tr>
  <tr>
    <td><strong>Thời gian sử dụng dài hạn</strong></td>
    <td>Trọn vẹn 2-3 năm ổn định lâu dài</td>
    <td>Dễ hỏng hóc bất ngờ gây phiền toái, bực tức khi cần gấp</td>
  </tr>
</table>`;

    savingsGuide = `<h3>Săn Deal sốc và nhận ưu đãi độc quyền cho ${name} tại Mua ngay đi</h3>
<p>Để tối thiểu hóa tiền túi thanh toán cho chiếc <strong>${name}</strong> chất lượng cao này, bạn hãy ghé trang web <strong>Mua ngay đi</strong> đầu tiên để lấy liên kết mua chính hãng trợ giá tốt nhất. Tận dụng dồn các tầng mã giảm giá của sàn và miễn phí vận chuyển trong các đợt sale giữa tháng hoặc sale ngày đôi sẽ giúp bạn tiết kiệm đến 50% chi phí.</p>`;

    prosCons = `<h3>Ưu điểm và Nhược điểm thực tế</h3>
<ul>
  <li><strong>Ưu điểm:</strong> Giá thành cực kì dễ chịu, tương thích thiết bị hoàn hảo; Hiệu suất truyền tải ổn định; Nhỏ gọn mang theo mọi nơi dễ dàng.</li>
  <li><strong>Nhược điểm:</strong> Màu sắc đơn giản thanh lịch, không có nhiều tùy chọn màu sặc sỡ để lựa chọn.</li>
</ul>`;

    conclusion = `<h3>Lời khuyên đầu tư tài chính thông minh</h3>
<p>Nếu bạn đang tìm kiếm một phụ kiện đáp ứng hoàn hảo yêu cầu kỹ thuật bền bỉ mà mức giá siêu rẻ, thì <strong>${name}</strong> chính là nhà vô địch thực sự trong phân khúc. Hãy click "Mua Ngay" và áp dụng mẹo săn sale của chúng tôi để bảo vệ tài chính cá nhân tối đa.</p>`;

  } else if (category === 'Gia dụng') {
    title = `Review Thiết Bị Gia Dụng Thông Minh ${name}: Tiện Nghi Vượt Trội, Tiết Kiệm Năng Lượng`;
    description = `Review chi tiết thiết bị gia dụng ${name}. Phân tích độ an toàn, thiết kế thông minh giúp nới rộng không gian sống và cách săn voucher tốt nhất hôm nay.`;

    intro = `<h3>Nâng tầm chất lượng cuộc sống bằng giải pháp gia dụng thông thái</h3>
<p>Ngôi nhà là nơi chúng ta tìm về tổ ấm để thư giãn sau một ngày dài mệt mỏi. Sử dụng các thiết bị tiện ích thông minh đóng vai trò vô cùng tủ tấc giúp tiết kiệm công sức dọn dẹp và mang lại không gian thoải mái nhất cho cả gia đình. Thiết bị gia dụng thông minh <strong>${name}</strong> ra đời mang theo triết lý định hình trải nghiệm sống hiện đại, an toàn cùng mức chi phí cực tiết kiệm.</p>`;

    detailSection = `<h3>Chất lượng an toàn hàng đầu của thiết bị gia dụng ${name}</h3>
<p>Sản phẩm gia dụng này được cấu tạo từ các vật liệu trứ danh như nhựa PP nguyên sinh chịu lực, inox chống rỉ sét hoặc linh kiện chịu nhiệt độ cao. Độ bền sử dụng lâu dài giúp hạn chế lãng phí việc thay thế đồ liên tục, đồng thời nâng cao mỹ quan rực sáng của gian phòng nhà bạn hằng ngày.</p>`;

    specsTable = `<h3>Bảng phân tích tiện ích thực tế và chi phí vận hành hằng tháng</h3>
<p>Kiểm nghiệm thực tế giữa sản phẩm và các dòng thiết bị đại trà ngày nay:</p>
<table>
  <tr>
    <th>Tiêu chí đánh giá</th>
    <th>Thiết bị thông minh ${name}</th>
    <th>Gia dụng truyền thống thông thường</th>
  </tr>
  <tr>
    <td><strong>Tiết kiệm tài chính hằng năm</strong></td>
    <td>Cao (Giảm thiểu hao tổn điện năng lên đến hơn 30%)</td>
    <td>Kém (Hao tốn nhiều điện năng, nhanh hỏng thiết bị nội bộ)</td>
  </tr>
  <tr>
    <td><strong>Chất liệu hoàn thiện</strong></td>
    <td>Inox, nhựa nguyên sinh cao cấp, an toàn tuyệt đối</td>
    <td>Sử dụng nhựa tái chế, có mùi hôi, rỉ sét độc hại</td>
  </tr>
  <tr>
    <td><strong>Hạn mức bảo hành</strong></td>
    <td>Cam kết chính hãng đồng hành của đại lý phân phối</td>
    <td>Chỉ bao test tại chỗ, không được trả hàng rủi ro cực lớn</td>
  </tr>
</table>`;

    savingsGuide = `<h3>Kinh nghiệm gom sale, săn mã giảm giá hời nhất hôm nay</h3>
<p>Để mua được chiếc <strong>${name}</strong> chính hãng với chi phí hời nhất, hãy ghé thăm trang khuyến mãi của <strong>Mua ngay đi</strong> hằng ngày để không bỏ lỡ voucher của nhà phân phối cấp 1. Bạn cũng đừng quên kích hoạt ví điện tử liên kết để nhận hoàn tiền trực tiếp trên hóa đơn mua sắm.</p>`;

    prosCons = `<h3>Ưu điểm và Nhược điểm thực tế</h3>
<ul>
  <li><strong>Ưu điểm:</strong> Độ bền lý tưởng trọn đời sử dụng; Tích hợp công nghệ bảo vệ và tiết kiệm năng lượng; Ngoại hình sang trọng, tô điểm không gian hiện đại.</li>
  <li><strong>Nhược điểm:</strong> Sách hướng dẫn đi kèm có thể chỉ dùng tiếng Anh hoặc tiếng nước ngoài, khách hàng vui lòng đọc hướng dẫn tiếng Việt chi tiết tại Mua ngay đi khi cần thiết.</li>
</ul>`;

    conclusion = `<h3>Nhận định tài chính cho cả gia đình</h3>
<p>Mua sắm <strong>${name}</strong> chính là bước nâng cấp thiết yếu bảo bọc sức khỏe và đem lại sự tiện nghi ngọt ngào cho tổ ấm của bạn với mức chi phí tiết kiệm thông thái nhất hằng ngày.</p>`;

  } else {
    // Sức khỏe, Làm đẹp, & Khác
    title = `Đánh Giá Sức Khỏe & Review Chi Tiết ${name}: Giải Pháp Vàng Hỗ Trợ Đời Sống`;
    description = `Review chi tiết sản phẩm dinh dưỡng sức khỏe ${name}. Tìm hiểu công dụng thực tế và cách mua sắm sỉ ưu đãi lớn nhất trên các sàn thương mại điện tử.`;

    intro = `<h3>Chăm sóc thể trạng cá nhân - Khoản đầu tư mang lại lợi ích lâu dài nhất</h3>
<p>Trong bối cảnh áp lực cuộc sống công nghiệp hóa, việc quan tâm bồi bổ cho cơ thể bằng các thực phẩm chất lượng hay giải pháp chăm sóc cơ thể hiện đại là vô cùng thiết thực. Dòng sản phẩm <strong>${name}</strong> là điểm tựa an toàn đáng tin cậy hỗ trợ thể trạng tràn đầy năng lực và kéo dài thanh xuân tươi mới cho bạn.</p>`;

    detailSection = `<h3>Đặc tính thành phần khoa học hữu dụng nổi bật nhất của ${name}</h3>
<p>Sản phẩm chứa đựng nguồn dưỡng chất được chọn lọc kĩ càng, hấp thụ nhanh qua cơ thể mà không gây bất kỳ phản ứng có hại hay mệt mỏi nào. Được sản xuất trên quy trình khép kín, sản phẩm cam kết chất lượng tuyệt đối cho sức khỏe của người tiêu dùng lâu dài.</p>`;

    specsTable = `<h3>Bảng tóm tắt thành phần hữu cơ và hiệu quả tài chính sức khỏe hằng ngày</h3>
<p>Sự đầu tư thông thái mang lại thể trạng hoàn hảo:</p>
<table>
  <tr>
    <th>Tiêu chí so sánh</th>
    <th>Sản phẩm bảo vệ ${name}</th>
    <th>Các dòng trôi nổi thiếu nguồn gốc rõ ràng</th>
  </tr>
  <tr>
    <td><strong>Nguồn gốc chất lượng</strong></td>
    <td>Đầy đủ chứng nhận lâm sàng, giấy cấp phép an toàn quốc gia</td>
    <td>Không rõ tem mác bảo hiểm, nguy hại nghiêm trọng sức khỏe</td>
  </tr>
  <tr>
    <td><strong>Khả năng dung nạp cơ thể</strong></td>
    <td>Cao, hoàn toàn tự nhiên không chứa hóa chất bảo quản</td>
    <td>Dễ gây phản ứng mẩn ngứa dị ứng, tổn hại chức năng gan thận</td>
  </tr>
  <tr>
    <td><strong>Chi phí sử dụng hằng ngày</strong></td>
    <td>Tiết kiệm lớn nếu mua theo dạng combo hộp tại Mua ngay đi</td>
    <td>Giá đắt vô lý hoặc siêu rẻ bất thường, tiềm ẩn nhiều rủi ro</td>
  </tr>
</table>`;

    savingsGuide = `<h3>Phương án săn mã sỉ, voucher tích lũy độc quyền tốt nhất hôm nay</h3>
<p>Hãy truy cập <strong>Mua ngay đi</strong> đầu tiên để cập nhật link chính hãng được trợ giá nhà cung cấp tốt nhất. Đồng thời hãy lựa chọn thanh toán bằng chuyển khoản hoặc ví điện tử liên kết để nhận thêm ưu đãi chiết khấu trực tiếp lên đến 35% trên hóa đơn mua sắm của mình.</p>`;

    prosCons = `<h3>Ưu điểm và Nhược điểm thực tế</h3>
<ul>
  <li><strong>Ưu điểm:</strong> Thành phần chuẩn khoa học an toàn tối đa; Tối ưu hiệu quả thể lực sau thời gian ngắn sử dụng; Đóng mác bảo hộ an tâm tuyệt đối.</li>
  <li><strong>Nhược điểm:</strong> Đòi hỏi thời gian sử dụng đều đặn tối thiểu 1 tháng để thấy hiệu quả rệt nhất, không phải là thuốc chữa bệnh tức thì.</li>
</ul>`;

    conclusion = `<h3>Nhận định tiêu dùng thông minh</h3>
<p>Đầu tư chăm lo cơ thể với <strong>${name}</strong> hôm nay chính là chiến lược thông thái bảo vệ nguồn lực quý giá nhất của đời bạn một cách tiết kiệm tốt nhất!</p>`;
  }

  const content = `${intro}${detailSection}${specsTable}${savingsGuide}${prosCons}${conclusion}`;
  return { title, description, content };
}

export function buildDynamicBlogPost(product: Product, index: number): BlogPost {
  const pSlug = slugify(product.name);
  const richObj = buildRichSEOContent(product);

  return {
    id: pSlug,
    slug: pSlug,
    title: richObj.title,
    description: richObj.description,
    content: richObj.content,
    image: product.image || 'https://picsum.photos/600/400',
    category: product.category || 'Chưa phân loại',
    author: 'Gia Cát Săn Deal',
    publishedAt: getStaggeredDate(product.name),
    readTime: getReadingTime(richObj.content),
    tags: ['Đánh giá', 'Kinh nghiệm', 'Tiết kiệm', product.category || 'Chưa phân loại']
  };
}

// Global cached mapping to optimize dynamic calls
let cachedMergedBlogs: BlogPost[] = [];
let lastProductsHash = '';

export function getMergedBlogPosts(products: Product[]): BlogPost[] {
  if (!products || products.length === 0) {
    return BLOG_POSTS;
  }

  // Create simple hash of product list to check cache freshness
  const currentHash = products.map(p => `${p.id}-${p.name}`).join('|');
  if (cachedMergedBlogs.length > 0 && currentHash === lastProductsHash) {
    return cachedMergedBlogs;
  }

  const blendedBlogs: BlogPost[] = [];
  const existingSlugs = new Set(BLOG_POSTS.map(post => post.slug));

  // 1. Add premium hand-coded reviews
  blendedBlogs.push(...BLOG_POSTS);

  // 2. Dynamically compile blog articles for any remaining products
  products.forEach((product, idx) => {
    const productSlug = slugify(product.name);
    if (!productSlug) return;

    if (!existingSlugs.has(productSlug)) {
      const dynamicPost = buildDynamicBlogPost(product, idx);
      blendedBlogs.push(dynamicPost);
      existingSlugs.add(productSlug); // Prevent duplicate slugs if any
    }
  });

  // Sort them dynamically by publication date (newest first)
  blendedBlogs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  cachedMergedBlogs = blendedBlogs;
  lastProductsHash = currentHash;

  return blendedBlogs;
}
