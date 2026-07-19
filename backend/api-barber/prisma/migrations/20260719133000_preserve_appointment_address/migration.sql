ALTER TABLE "appointments"
DROP CONSTRAINT "appointments_addressId_fkey";

ALTER TABLE "appointments"
ADD CONSTRAINT "appointments_addressId_fkey"
FOREIGN KEY ("addressId") REFERENCES "addresses"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
