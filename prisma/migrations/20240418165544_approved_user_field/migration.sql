-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "birth_date" DATETIME NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_users" ("birth_date", "cpf", "email", "gender", "id", "name", "password", "phone_number", "rg") SELECT "birth_date", "cpf", "email", "gender", "id", "name", "password", "phone_number", "rg" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_password_key" ON "users"("password");
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
