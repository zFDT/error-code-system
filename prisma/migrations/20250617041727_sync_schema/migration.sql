/*
  Warnings:

  - You are about to drop the column `code` on the `Error` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Project` table. All the data in the column will be lost.
  - Added the required column `errorCode` to the `Error` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moduleCode` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectCode` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Error" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "errorCode" TEXT NOT NULL,
    "moduleId" INTEGER NOT NULL,
    CONSTRAINT "Error_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Error" ("description", "id", "moduleId", "name") SELECT "description", "id", "moduleId", "name" FROM "Error";
DROP TABLE "Error";
ALTER TABLE "new_Error" RENAME TO "Error";
CREATE UNIQUE INDEX "Error_moduleId_errorCode_key" ON "Error"("moduleId", "errorCode");
CREATE TABLE "new_Module" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "moduleCode" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "Module_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Module" ("id", "name", "projectId") SELECT "id", "name", "projectId" FROM "Module";
DROP TABLE "Module";
ALTER TABLE "new_Module" RENAME TO "Module";
CREATE UNIQUE INDEX "Module_projectId_moduleCode_key" ON "Module"("projectId", "moduleCode");
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "projectCode" TEXT NOT NULL
);
INSERT INTO "new_Project" ("id", "name") SELECT "id", "name" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_projectCode_key" ON "Project"("projectCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
