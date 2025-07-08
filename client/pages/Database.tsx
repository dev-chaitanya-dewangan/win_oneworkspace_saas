import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AiFileStorageBoard } from "@/components/storage/AiFileStorageBoard";

const Database = () => {
  return (
    <MainLayout>
      <div className="h-full w-full">
        <AiFileStorageBoard />
      </div>
    </MainLayout>
  );
};

export default Database;
