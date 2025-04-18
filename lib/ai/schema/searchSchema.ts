// Import các thư viện cần thiết
import { DeepPartial } from "ai"; // Import kiểu DeepPartial từ thư viện ai
import { z } from "zod"; // Import thư viện Zod để định nghĩa schema

/**
 * Định nghĩa schema cho chức năng tìm kiếm
 * Schema này xác định cấu trúc và kiểu dữ liệu cho các tham số tìm kiếm
 */
export const searchSchema = z.object({
  // Từ khóa tìm kiếm
  query: z.string().describe("The query to search for"),

  // Số lượng kết quả tối đa trả về, mặc định là 5
  max_results: z
    .number()
    .describe("The maximum number of results to return. default is 5"),

  // Độ sâu của tìm kiếm, có thể là "basic" hoặc "advanced"
  search_depth: z
    .string()
    .describe(
      'The depth of the search. Allowed values are "basic" or "advanced"',
    ),

  // Danh sách các tên miền cụ thể để bao gồm trong kết quả tìm kiếm
  // Mặc định là None, nghĩa là bao gồm tất cả các tên miền
  include_domains: z
    .array(z.string())
    .describe(
      "A list of domains to specifically include in the search results. Default is None, which includes all domains.",
    ),

  // Danh sách các tên miền cụ thể để loại trừ khỏi kết quả tìm kiếm
  // Mặc định là None, nghĩa là không loại trừ tên miền nào
  exclude_domains: z
    .array(z.string())
    .describe(
      "A list of domains to specifically exclude from the search results. Default is None, which doesn't exclude any domains.",
    ),
});

/**
 * Định nghĩa kiểu PartialInquiry
 * Kiểu này cho phép sử dụng một phần của schema tìm kiếm
 * DeepPartial nghĩa là tất cả các trường và trường con đều là tùy chọn (optional)
 */
export type PartialInquiry = DeepPartial<typeof searchSchema>;
