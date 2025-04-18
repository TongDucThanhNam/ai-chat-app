## Introduce Project
Chat AI is an AI LLM Services like ChatGPT. It focuses on improving both AI model's response and helping users improve their knowledge:


## Project Overview
See in `architecture.md` for more details.

## Frontend
- Built with Next.js 15 App routes and React 19.
- Styled with Tailwind CSS and Shadcn for a modern and responsive design.
- Motion for animations and transitions to enhance user experience.
- The frontend is designed to be user-friendly and responsive, ensuring a seamless experience across devices.
- The main components are organized in the `/components` directory, with reusable components in the `/components/ui` folder.
- The main pages are located in the `/app` directory, following Next.js's app directory structure.

### Database
- Drizzle ORM with PostgreSQL using Neon as the database provider.
- Database Schema: `*Schema.ts` in the `/lib/db/schema` folder.

## Core features
### Chat
Using `@ai-sdk` of Vercel to provide chat functionality. The chat interface is designed to be user-friendly and responsive, allowing users to interact with the AI seamlessly.

### Authentication
Using `better-auth` for authentication, which supports Google login. The authentication process is streamlined and user-friendly, allowing users to sign in quickly.

### Artifacts
Artifacts in Mycelium AI are a special user interface mode designed to help users with writing, editing, and content creation tasks. When an artifact is open, it appears on the right side of the screen, while the chat conversation remains on the left. Artifacts are used for content that users may want to save or reuse, such as images or documents.

Key points about artifacts:

- Artifacts are managed using toolSchema like createDocument and updateDocument.
- When you create or update a document, changes are reflected in real-time in the artifact panel.
- Artifacts are not used for simple informational or conversational responses—only for content that should be saved or edited.
- The artifact UI allows users to view, edit, and manage versions of their documents or images.
- The artifact system is integrated with the chat, so you can interact with both simultaneously.
  In summary, artifacts provide a focused workspace for content creation and management, separate from the main chat flow, enhancing productivity and organization. ders by using React.memo and useMemo (see `MemoGuide.md`).