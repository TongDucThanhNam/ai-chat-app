// Import các kiểu dữ liệu và schema cho kết quả tìm kiếm
import { searchSchema } from "@/lib/ai/schema/searchSchema";
import {
  SearchResultImage,
  SearchResultItem,
  SearchResults,
  SearXNGResponse,
  SearXNGResult,
} from "@/types";
import { sanitizeUrl } from "@/lib/utils";
import { tool } from "ai";
import Exa from "exa-js";

// Định nghĩa Search Tool sử dụng cho agent AI
export const searchTool = tool({
  description: "Search the web for information", // Mô tả chức năng tool
  parameters: searchSchema, // Schema cho đầu vào
  execute: async ({
    query,
    max_results,
    search_depth,
    include_domains,
    exclude_domains,
  }) => {
    // Tavily API yêu cầu query tối thiểu 5 ký tự
    const filledQuery =
      query.length < 5 ? query + " ".repeat(5 - query.length) : query;
    let searchResult: SearchResults;
    // Chọn engine tìm kiếm dựa vào biến môi trường
    const searchAPI =
      (process.env.SEARCH_API as "tavily" | "exa" | "searxng") || "tavily";

    // Quyết định mức độ tìm kiếm (basic/advanced)
    const effectiveSearchDepth =
      searchAPI === "searxng" &&
      process.env.SEARXNG_DEFAULT_DEPTH === "advanced"
        ? "advanced"
        : search_depth || "basic";

    console.log(
      `Using search API: ${searchAPI}, Search Depth: ${effectiveSearchDepth}`,
    );

    try {
      // Nếu không, gọi hàm tìm kiếm tương ứng với engine đã chọn
      searchResult = await (searchAPI === "tavily" ? tavilySearch : exaSearch)(
        filledQuery,
        max_results,
        effectiveSearchDepth === "advanced" ? "advanced" : "basic",
        include_domains,
        exclude_domains,
      );
    } catch (error) {
      // Nếu có lỗi, trả về kết quả rỗng
      console.error("Search API error:", error);
      searchResult = {
        results: [],
        query: filledQuery,
        images: [],
        number_of_results: 0,
      };
    }

    console.log("completed search");
    return searchResult;
  },
});

// Hàm tiện lợi để gọi searchTool bằng code
export async function search(
  query: string,
  maxResults: number = 10,
  searchDepth: "basic" | "advanced" = "basic",
  includeDomains: string[] = [],
  excludeDomains: string[] = [],
): Promise<SearchResults> {
  return searchTool.execute(
    {
      query,
      max_results: maxResults,
      search_depth: searchDepth,
      include_domains: includeDomains,
      exclude_domains: excludeDomains,
    },
    {
      messages: [],
      toolCallId: "searchTool",
      abortSignal: undefined,
    },
  );
}

// --- Các hàm tìm kiếm cụ thể ---
// tavilySearch: Gọi API Tavily để lấy kết quả tìm kiếm
// exaSearch: Gọi API Exa để lấy kết quả tìm kiếm
// searxngSearch: Gọi API SearXNG để lấy kết quả tìm kiếm
// Các hàm này đều chuẩn hóa kết quả trả về dạng SearchResults

async function tavilySearch(
  query: string,
  maxResults: number = 10,
  searchDepth: "basic" | "advanced" = "basic",
  includeDomains: string[] = [],
  excludeDomains: string[] = [],
): Promise<SearchResults> {
  // Gọi API Tavily để lấy kết quả tìm kiếm
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not set in the environment variables");
  }
  const includeImageDescriptions = true;
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: Math.max(maxResults, 5),
      search_depth: searchDepth,
      include_images: true,
      include_image_descriptions: includeImageDescriptions,
      include_answers: true,
      include_domains: includeDomains,
      exclude_domains: excludeDomains,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Tavily API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  const processedImages = includeImageDescriptions
    ? data.images
        .map(({ url, description }: { url: string; description: string }) => ({
          url: sanitizeUrl(url),
          description,
        }))
        .filter(
          (
            image: SearchResultImage,
          ): image is { url: string; description: string } =>
            typeof image === "object" &&
            image.description !== undefined &&
            image.description !== "",
        )
    : data.images.map((url: string) => sanitizeUrl(url));

  return {
    ...data,
    images: processedImages,
  };
}

async function exaSearch(
  query: string,
  maxResults: number = 10,
  _searchDepth: string,
  includeDomains: string[] = [],
  excludeDomains: string[] = [],
): Promise<SearchResults> {
  // Gọi API Exa để lấy kết quả tìm kiếm
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    throw new Error("EXA_API_KEY is not set in the environment variables");
  }

  const exa = new Exa(apiKey);
  const exaResults = await exa.searchAndContents(query, {
    highlights: true,
    numResults: maxResults,
    includeDomains,
    excludeDomains,
  });

  return {
    results: exaResults.results.map((result: any) => ({
      title: result.title,
      url: result.url,
      content: result.highlight || result.text,
    })),
    query,
    images: [],
    number_of_results: exaResults.results.length,
  };
}
