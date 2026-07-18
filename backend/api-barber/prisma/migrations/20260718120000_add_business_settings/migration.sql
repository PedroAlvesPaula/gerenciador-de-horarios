-- CreateTable
CREATE TABLE "business_hours" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "breakStart" TEXT,
    "breakEnd" TEXT,

    CONSTRAINT "business_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "days_off" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "reason" TEXT,

    CONSTRAINT "days_off_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_hours_dayOfWeek_key" ON "business_hours"("dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "days_off_date_key" ON "days_off"("date");

-- CreateIndex
CREATE INDEX "appointments_scheduledAt_status_idx" ON "appointments"("scheduledAt", "status");
