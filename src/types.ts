export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  productUrl: string;
  rating: number;
  reviews: number;
  isHot?: boolean;
  status?: string;
}

export const CATEGORIES = [
  "Tất cả",
  "Điện tử",
  "Gia dụng",
  "Thời trang",
  "Làm đẹp",
  "Sức khỏe"
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Tai nghe chống ồn Sony WH-1000XM5",
    description: "Trải nghiệm âm thanh đỉnh cao với công nghệ chống ồn hàng đầu thế giới.",
    price: "7.990.000đ",
    originalPrice: "9.500.000đ",
    image: "https://picsum.photos/seed/sony-xm5/600/400",
    category: "Điện tử",
    productUrl: "https://shopee.vn",
    rating: 4.9,
    reviews: 1240,
    isHot: true
  },
  {
    id: "2",
    name: "Nồi chiên không dầu Philips Premium",
    description: "Giải pháp nấu ăn lành mạnh cho gia đình bạn.",
    price: "3.200.000đ",
    originalPrice: "4.500.000đ",
    image: "https://picsum.photos/seed/philips-airfryer/600/400",
    category: "Gia dụng",
    productUrl: "https://shopee.vn",
    rating: 4.8,
    reviews: 850
  },
  {
    id: "3",
    name: "iPhone 15 Pro Max 256GB",
    description: "Siêu phẩm Apple với khung Titan cực bền bỉ.",
    price: "29.990.000đ",
    image: "https://picsum.photos/seed/iphone15/600/400",
    category: "Điện tử",
    productUrl: "https://shopee.vn",
    rating: 5.0,
    reviews: 3200,
    isHot: true
  },
  {
    id: "4",
    name: "Giày chạy bộ Nike Air Zoom Pegasus 40",
    description: "Sự kết hợp hoàn hảo giữa độ êm và lực đẩy.",
    price: "2.500.000đ",
    originalPrice: "3.500.000đ",
    image: "https://picsum.photos/seed/nike-pegasus/600/400",
    category: "Thời trang",
    productUrl: "https://shopee.vn",
    rating: 4.7,
    reviews: 640
  },
  {
    id: "5",
    name: "Kem dưỡng ẩm Neutrogena Hydro Boost",
    description: "Cấp nước tức thì cho làn da luôn căng mọng.",
    price: "350.000đ",
    originalPrice: "450.000đ",
    image: "https://picsum.photos/seed/neutrogena/600/400",
    category: "Làm đẹp",
    productUrl: "https://shopee.vn",
    rating: 4.6,
    reviews: 2100
  },
  {
    id: "6",
    name: "Bàn chải diện Philips Sonicare",
    description: "Công nghệ rung sóng âm giúp răng trắng sáng.",
    price: "1.800.000đ",
    image: "https://picsum.photos/seed/philips-sonicare/600/400",
    category: "Sức khỏe",
    productUrl: "https://shopee.vn",
    rating: 4.8,
    reviews: 1100
  }
];
