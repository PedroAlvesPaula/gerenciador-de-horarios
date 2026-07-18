-- CreateTable
CREATE TABLE "appointment_catalog_items" (
    "appointmentId" TEXT NOT NULL,
    "catalogItemId" TEXT NOT NULL,

    CONSTRAINT "appointment_catalog_items_pkey" PRIMARY KEY ("appointmentId", "catalogItemId")
);

-- Add the duration snapshot before removing the previous single-service relation.
ALTER TABLE "appointments" ADD COLUMN "durationMinutes" INTEGER;

UPDATE "appointments" AS appointment
SET "durationMinutes" = catalog_item."durationMinutes"
FROM "catalog_items" AS catalog_item
WHERE appointment."catalogItemId" = catalog_item."id";

ALTER TABLE "appointments" ALTER COLUMN "durationMinutes" SET NOT NULL;

-- Preserve every existing appointment in the new association table.
INSERT INTO "appointment_catalog_items" ("appointmentId", "catalogItemId")
SELECT "id", "catalogItemId"
FROM "appointments";

-- CreateIndex
CREATE INDEX "appointment_catalog_items_catalogItemId_idx" ON "appointment_catalog_items"("catalogItemId");

-- AddForeignKey
ALTER TABLE "appointment_catalog_items" ADD CONSTRAINT "appointment_catalog_items_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_catalog_items" ADD CONSTRAINT "appointment_catalog_items_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "catalog_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_catalogItemId_fkey";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "catalogItemId";
