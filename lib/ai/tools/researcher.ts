// Import các kiểu dữ liệu và hàm cần thiết từ thư viện 'ai'
import { CoreMessage, smoothStream, streamText } from "ai";
// Import tool lấy nội dung từ URL
// Import tool tìm kiếm web
import { searchTool } from "../tools/search";
import { myProvider } from "../providers";
// Import tool tìm kiếm video
// Import hàm lấy thông tin model

// Prompt hệ thống hướng dẫn AI cách trả lời và trích dẫn nguồn
const SYSTEM_PROMPT = `
Instructions:

You are a helpful AI assistant with access to real-time web search.
When asked a question, you should:
1. Search for relevant information using the search tool when needed (Just need find General, dont deep too specific when this is not DeepReasearch mode)
4. Analyze all search results to provide accurate, up-to-date information
5. Always cite sources using the [^number](url) footnotes format (Mest have space next and prev if not it not regconized as footnotes), matching the order of search results. If multiple sources are relevant, include all of them, and comma separate them. Only use information that has a URL available for citation.
6. If results are not relevant or helpful, rely on your general knowledge
7. Provide comprehensive and detailed responses based on search results, ensuring thorough coverage of the user's question
8. Use markdown to structure your responses. Use headings to break up the content into sections. Using bullet points or numbered lists to organize information clearly. Use code blocks for any code snippets or technical details. Using **Bold**, *Italics*, to emphasize important points.
9. Using Callout to summarize key points or provide additional context.
>[!abstract] Title of question/answer
> content of question/answer (Must start with > each line)

>[!note] Note
>content of note (Must start with > each line)

>[!tip] Tip
>content of tip (Must start with > each line)

>[!info] Information
>content of information (Must start with > each line)

[!warning] Warning
>content of warning (Must start with > each line)

10. Use the following format for citations (Source):
Source:
[^1]: url // example: [^1]: https://example.com
`;

// Định nghĩa kiểu trả về cho researcher
type ResearcherReturn = Parameters<typeof streamText>[0];

// Hàm tạo cấu hình cho agent researcher
export function researcher({
  messages,
  searchMode,
}: {
  messages: CoreMessage[];
  searchMode: boolean;
}): ResearcherReturn {
  try {
    // Lấy thời gian hiện tại dạng chuỗi
    const currentDate = new Date().toLocaleString();

    return {
      // Lấy thông tin model dựa trên tên model
      model: myProvider.languageModel("search-model"),
      // Ghép system prompt với thời gian hiện tại
      system: `${SYSTEM_PROMPT}\nCurrent date and time,: ${currentDate} \n Default locator: Vietnam`,
      // Danh sách tin nhắn đầu vào
      messages,
      // Định nghĩa các tool mà agent có thể sử dụng
      tools: {
        search: searchTool,
      },
      // Kích hoạt các tool nếu searchMode bật
      // experimental_activeTools: searchMode ? ["search"] : [],
      // Số bước tối đa cho agent thực hiện
      maxSteps: searchMode ? 2 : 1,
      // Cấu hình transform cho stream kết quả
      experimental_transform: smoothStream({ chunking: "word" }),
      providerOptions: {
        openai: {
          reasoningEffort: "low",
        },
      },
      toolCallStreaming: true,
    };
  } catch (error) {
    // Log lỗi và ném lại lỗi nếu có
    console.error("Lỗi trong chatResearcher:", error);
    throw error;
  }
}
