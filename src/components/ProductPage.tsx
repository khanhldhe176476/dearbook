import { Heart, Sparkles, BookOpen, ChevronRight } from 'lucide-react';

interface ProductPageProps {
  onStartDesign: () => void;
}

export function ProductPage({ onStartDesign }: ProductPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Product Images */}
          <div className="space-y-6">
            {/* Main Product Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-pink-200 to-purple-200 p-8">
              <img
                src="figma:asset/75f25ac90081e751c1ea46d382338eda718c305b.png"
                alt="Sách Ngoc Anh Yêu Em"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <p className="text-sm font-semibold text-purple-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Bestseller
                </p>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-5 gap-3">
              <div className="aspect-square rounded-xl overflow-hidden border-2 border-purple-300 shadow-md">
                <img
                  src="figma:asset/e3dc89887407aae40ed4987d3011cdc80ce07e59.png"
                  alt="Preview 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-md hover:border-purple-300 transition cursor-pointer">
                <img
                  src="figma:asset/75f25ac90081e751c1ea46d382338eda718c305b.png"
                  alt="Preview 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-md hover:border-purple-300 transition cursor-pointer">
                <img
                  src="figma:asset/e3aac7f894c0f163e73430cd24e482c359d5353f.png"
                  alt="Preview 3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-md hover:border-purple-300 transition cursor-pointer">
                <img
                  src="figma:asset/6251f78ccca4af275f512353d2f3b01052f7f0e0.png"
                  alt="Preview 4"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden bg-purple-100 shadow-md flex items-center justify-center hover:bg-purple-200 transition cursor-pointer">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8">
            {/* Title */}
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-pink-100 rounded-full">
                <p className="text-pink-600 font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-current" />
                  Quà Tặng Độc Đáo
                </p>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif text-gray-900">
                Em Yêu Anh
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Tự hình ảnh nhân vật, cho tới các dòng chữ, tất cả đều là do chính khách hàng thiết kế. 
                Người ấy sẽ thấy mình trong từng trang giấy - có chút ngạc nhiên...
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur shadow-md">
                <p className="text-sm text-gray-600 mb-1">Số trang</p>
                <p className="text-2xl font-bold text-gray-900">40 trang</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur shadow-md">
                <p className="text-sm text-gray-600 mb-1">Kích thước</p>
                <p className="text-2xl font-bold text-gray-900">15×21 cm</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur shadow-md">
                <p className="text-sm text-gray-600 mb-1">Chất liệu</p>
                <p className="text-2xl font-bold text-gray-900">Giấy cao cấp</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur shadow-md">
                <p className="text-sm text-gray-600 mb-1">Thời gian</p>
                <p className="text-2xl font-bold text-gray-900">3-5 ngày</p>
              </div>
            </div>

            {/* Price */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200">
              <p className="text-sm text-gray-600 mb-2">Giá sản phẩm</p>
              <p className="text-5xl font-bold text-gray-900">570,000₫</p>
            </div>

            {/* CTA Button */}
            <button
              onClick={onStartDesign}
              className="w-full py-5 px-8 bg-black text-white rounded-full text-xl font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-3 group"
            >
              BẮT ĐẦU THIẾT KẾ
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Note */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                💡 Quý khách hoàn toàn được trải nghiệm thiết kế trước mà không cần đặt hàng ngay, 
                mỗi quý khách cứ thử trải nghiệm trước, khi nào ưng mới đặt hàng nhé 😊
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">1000+</p>
                <p className="text-sm text-gray-600">Khách hàng</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">4.9/5</p>
                <p className="text-sm text-gray-600">Đánh giá</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-600">Handmade</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white shadow-lg text-center">
            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Thiết kế độc đáo</h3>
            <p className="text-gray-600">
              Tự tay tạo nhân vật và câu chuyện của riêng bạn
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-white shadow-lg text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Chất lượng cao</h3>
            <p className="text-gray-600">
              In ấn chuyên nghiệp, giấy cao cấp, màu sắc sống động
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-white shadow-lg text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quà tặng ý nghĩa</h3>
            <p className="text-gray-600">
              Món quà độc nhất, chứa đựng tình cảm và kỷ niệm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
