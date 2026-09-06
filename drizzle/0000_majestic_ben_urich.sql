CREATE TABLE "whiteboards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text DEFAULT 'Untitled board' NOT NULL,
	"elements" jsonb DEFAULT '{"elements":[],"appState":{}}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX "whiteboards_user_id_updated_at_idx" ON "whiteboards" USING btree ("user_id","updated_at" DESC NULLS LAST);