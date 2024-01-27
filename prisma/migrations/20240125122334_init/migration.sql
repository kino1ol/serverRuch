-- CreateTable
CREATE TABLE "Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "domain" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isReview" BOOLEAN NOT NULL DEFAULT false,
    "isWorks" BOOLEAN NOT NULL DEFAULT false,
    "isMap" BOOLEAN NOT NULL DEFAULT false,
    "isEquipment" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT NOT NULL DEFAULT '/'
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "usersId" INTEGER,
    CONSTRAINT "Category_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_domain_key" ON "Users"("domain");
