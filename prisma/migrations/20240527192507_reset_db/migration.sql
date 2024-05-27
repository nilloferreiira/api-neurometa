/*
  Warnings:

  - Made the column `medical_report` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "medical_report" SET NOT NULL;
