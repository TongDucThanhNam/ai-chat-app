import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic parameters with defaults
    const title = searchParams.get("title")?.slice(0, 100) || "Chat AI";
    const description =
      searchParams.get("description")?.slice(0, 200) ||
      "Advanced AI for knowledge enhancement";
    const website = searchParams.get("website") || "Chatai.com";
    const theme = searchParams.get("theme") || "light";

    // Define theme colors
    const themeColors = {
      light: {
        bg: "bg-white",
        border: "border-indigo-600",
        text: "text-gray-900",
        accent: "bg-indigo-600",
        secondary: "text-indigo-600",
      },
      dark: {
        bg: "bg-gray-900",
        border: "border-indigo-400",
        text: "text-white",
        accent: "bg-indigo-400",
        secondary: "text-indigo-400",
      },
      purple: {
        bg: "bg-purple-900",
        border: "border-purple-300",
        text: "text-white",
        accent: "bg-purple-300",
        secondary: "text-purple-300",
      },
    };

    const colors =
      themeColors[theme as keyof typeof themeColors] || themeColors.light;

    return new ImageResponse(
      (
        <div
          tw={`h-full w-full flex items-center justify-center ${colors.bg} border ${colors.border} border-[12px]`}
        >
          <div tw="flex flex-col w-full h-full p-12">
            {/* Header with logo and website */}
            <div tw="flex justify-between items-center w-full">
              <div tw="flex items-center">
                <div
                  tw={`w-12 h-12 rounded-full ${colors.accent} flex items-center justify-center mr-4`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 16V12M12 8H12.01"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span tw={`text-2xl font-bold ${colors.text}`}>
                  Chat AI
                </span>
              </div>
              <span tw={`text-xl ${colors.secondary}`}>{website}</span>
            </div>

            {/* Main content */}
            <div tw="flex flex-col justify-center flex-grow">
              <h1
                tw={`text-[70px] font-bold leading-tight ${colors.text} mb-6`}
              >
                {title}
              </h1>
              <p tw={`text-3xl ${colors.text} opacity-80 max-w-4xl`}>
                {description}
              </p>
            </div>

            {/* Footer with decorative elements */}
            <div tw="flex justify-between items-end w-full">
              <div tw={`${colors.secondary} text-xl font-medium`}>
                Generated with AI
              </div>
              <div tw="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} tw={`w-3 h-3 rounded-full ${colors.accent}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error: any) {
    console.error(`OG Image generation error: ${error.message}`);
    return new Response(`Failed to generate the image: ${error.message}`, {
      status: 500,
    });
  }
}
