CREATE TYPE "public"."role" AS ENUM('su', 'owner', 'admin', 'member');--> statement-breakpoint
CREATE TABLE "credential_table" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" varchar(50) NOT NULL,
	"provider_id" varchar(255) NOT NULL,
	"password" varchar(255),
	"hash_salt" varchar(255),
	"_created_at" timestamp DEFAULT now() NOT NULL,
	"_updated_at" timestamp NOT NULL,
	CONSTRAINT "credential_table_provider_provider_id_unique" UNIQUE("provider","provider_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp,
	"_created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_table" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(128) NOT NULL,
	"last_name" varchar(128),
	"email" varchar(255) NOT NULL,
	"_created_at" timestamp DEFAULT now() NOT NULL,
	"_updated_at" timestamp NOT NULL,
	CONSTRAINT "user_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "member_table" (
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "role" DEFAULT 'member' NOT NULL,
	"_created_at" timestamp DEFAULT now() NOT NULL,
	"_updated_at" timestamp NOT NULL,
	CONSTRAINT "member_table_organization_id_user_id_pk" PRIMARY KEY("organization_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "organization_table" (
	"_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"slug" varchar(28) NOT NULL,
	"_created_at" timestamp DEFAULT now() NOT NULL,
	"_updated_at" timestamp NOT NULL,
	CONSTRAINT "organization_table_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "credential_table" ADD CONSTRAINT "credential_table_user_id_user_table__id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_table" ADD CONSTRAINT "member_table_organization_id_organization_table__id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization_table"("_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_table" ADD CONSTRAINT "member_table_user_id_user_table__id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("_id") ON DELETE cascade ON UPDATE no action;