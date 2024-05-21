/*
  Warnings:

  - Added the required column `doctorCrm` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uf` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "doctorCrm" INTEGER NOT NULL,
ADD COLUMN     "doctorName" TEXT NOT NULL,
ADD COLUMN     "uf" TEXT NOT NULL;
