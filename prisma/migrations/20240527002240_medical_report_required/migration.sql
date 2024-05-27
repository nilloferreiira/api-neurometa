-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "diagnostico" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "doctorCrm" INTEGER NOT NULL,
    "doctorName" TEXT NOT NULL,
    "medicalReport" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "crm" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("crm")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");
