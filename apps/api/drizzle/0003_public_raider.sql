CREATE TABLE "property_images_table" (
	"property_id" uuid NOT NULL,
	"media_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "property_images_table" ADD CONSTRAINT "property_images_table_property_id_property_table__id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property_table"("_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_images_table" ADD CONSTRAINT "property_images_table_media_id_media_table__id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_table"("_id") ON DELETE no action ON UPDATE no action;