-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('RETORNAVEIS', 'DESCARTAVEIS', 'COSMETICOS');

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ItemCategory" NOT NULL,
    "minRecommended" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "inventory_items_minRecommended_nonnegative" CHECK ("minRecommended" >= 0),
    CONSTRAINT "inventory_items_quantity_nonnegative" CHECK ("quantity" >= 0)
);

-- CreateIndex
CREATE INDEX "inventory_items_category_name_idx" ON "inventory_items"("category", "name");
