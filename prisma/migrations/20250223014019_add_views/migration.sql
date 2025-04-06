-- CreateTable
CREATE TABLE "View" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "objectId" TEXT,
    "listId" TEXT,
    "workspaceId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "View_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViewConfiguration" (
    "id" TEXT NOT NULL,
    "viewId" TEXT NOT NULL,
    "filters" JSONB,
    "sorts" JSONB,
    "columnOrder" JSONB,
    "hiddenColumns" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ViewConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViewFavorite" (
    "id" TEXT NOT NULL,
    "viewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ViewFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "View_objectId_idx" ON "View"("objectId");

-- CreateIndex
CREATE INDEX "View_listId_idx" ON "View"("listId");

-- CreateIndex
CREATE INDEX "View_workspaceId_idx" ON "View"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "View_workspaceId_objectId_name_key" ON "View"("workspaceId", "objectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "View_workspaceId_listId_name_key" ON "View"("workspaceId", "listId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ViewConfiguration_viewId_key" ON "ViewConfiguration"("viewId");

-- CreateIndex
CREATE INDEX "ViewFavorite_viewId_idx" ON "ViewFavorite"("viewId");

-- CreateIndex
CREATE INDEX "ViewFavorite_userId_idx" ON "ViewFavorite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ViewFavorite_viewId_userId_key" ON "ViewFavorite"("viewId", "userId");

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "Object"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewConfiguration" ADD CONSTRAINT "ViewConfiguration_viewId_fkey" FOREIGN KEY ("viewId") REFERENCES "View"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewFavorite" ADD CONSTRAINT "ViewFavorite_viewId_fkey" FOREIGN KEY ("viewId") REFERENCES "View"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewFavorite" ADD CONSTRAINT "ViewFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
