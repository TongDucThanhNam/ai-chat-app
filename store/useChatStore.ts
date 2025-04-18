import { create } from "zustand";
import { persist } from "zustand/middleware";

// Định nghĩa kiểu dữ liệu cho store
interface ChatStore {
  input: string;
  setInput: (input: string) => void;
}

// Tạo store với middleware persist để lưu vào localStorage
export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      input: "",
      setInput: (input) => set({ input }),
    }),
    {
      name: "chat-storage", // tên của key trong localStorage
    },
  ),
);
