import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AiChat } from "@/components/chat/AiChat";

const Chat = () => {
  return (
    <MainLayout>
      <div className="h-full w-full">
        <AiChat />
      </div>
    </MainLayout>
  );
};

export default Chat;
