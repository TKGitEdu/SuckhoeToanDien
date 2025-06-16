import { Stethoscope, Clipboard, BarChart, Users } from "lucide-react";
import type { Feature } from "./types/type";

const features: Feature[] = [
  {
    icon: Stethoscope,
     title: "Khám và xét nghiệm đồng bộ",
    description:
      "Theo dõi tất cả lịch sử khám, xét nghiệm và hình ảnh siêu âm theo từng chu kỳ điều trị.",
  },
  {
    icon: Clipboard,
    title: "Lập kế hoạch điều trị thông minh ",
    description: "Tạo và quản lý phác đồ IUI, IVF,... theo kết quả xét nghiệm, hỗ trợ nhắc lịch điều trị.",
  },
  {
    icon: BarChart,
    title: "Báo cáo hiệu quả điều trị theo thời gian thực",
    description: "Thống kê tỷ lệ thành công, hiệu quả từng bác sĩ, từng kỹ thuật điều trị.",
  },
  {
    icon: Users,
    title: "Hỗ trợ chuyên gia",
    description: "Đội ngũ tư vấn 24/7, giải đáp mọi thắc mắc về quá trình điều trị.",
  },
];

const FeaturesSection: React.FC = () => (
  <section id="features" className="py-16 md:py-20 bg-white">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl md:text-4xl font-bold text-center text-gray-800">
        Lợi ích khi sử dụng hệ thống.
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 text-center transition-shadow border border-blue-200 rounded-lg shadow-md bg-blue-50 hover:shadow-lg"
          >
            <feature.icon size={40} className="mx-auto mb-4 text-blue-600" />
            <h3 className="mb-2 text-lg md:text-xl font-semibold text-gray-800">
              {feature.title}
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
