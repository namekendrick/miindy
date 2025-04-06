/*
  Warnings:

  - You are about to drop the column `hiddenColumns` on the `ViewConfiguration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ViewConfiguration" DROP COLUMN "hiddenColumns",
ADD COLUMN     "visibleColumns" JSONB;
