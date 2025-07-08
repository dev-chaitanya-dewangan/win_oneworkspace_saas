import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TextEditor } from "@/components/editor/TextEditor";

const Editor = () => {
  return (
    <MainLayout>
      <TextEditor />
    </MainLayout>
  );
};

export default Editor;
