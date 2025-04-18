ALTER TABLE "agent_knowledge_bases" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "agent_models" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "agents" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_credits" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "knowledge_base" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "knowledge_base_chunks" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "knowledge_base_shares" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "models" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "plans" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "roles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_roles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tools" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "credit_transactions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "usage_history" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "agent_knowledge_bases" CASCADE;--> statement-breakpoint
DROP TABLE "agent_models" CASCADE;--> statement-breakpoint
DROP TABLE "agents" CASCADE;--> statement-breakpoint
DROP TABLE "user_credits" CASCADE;--> statement-breakpoint
DROP TABLE "knowledge_base" CASCADE;--> statement-breakpoint
DROP TABLE "knowledge_base_chunks" CASCADE;--> statement-breakpoint
DROP TABLE "knowledge_base_shares" CASCADE;--> statement-breakpoint
DROP TABLE "models" CASCADE;--> statement-breakpoint
DROP TABLE "plans" CASCADE;--> statement-breakpoint
DROP TABLE "roles" CASCADE;--> statement-breakpoint
DROP TABLE "user_roles" CASCADE;--> statement-breakpoint
DROP TABLE "tools" CASCADE;--> statement-breakpoint
DROP TABLE "credit_transactions" CASCADE;--> statement-breakpoint
DROP TABLE "usage_history" CASCADE;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "user_id" SET DATA TYPE uuid;