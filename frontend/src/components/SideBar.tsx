import { useParams } from "react-router-dom";

import HistoryList from "./HistoryList";
import UserFooter from "./UserFooter";
import SidebarHeader from "./SidebarHeader";
import { useHistories } from "../queries/HistoryQueries";

const SideBar = () => {
  const { chatId } = useParams<{ chatId: string }>();
  
  const {data: histories = []} = useHistories();


  return (
    <aside className="flex flex-col h-screen w-64 bg-sidebar border-r border-border px-4 py-5 select-none">
      <SidebarHeader></SidebarHeader>

      <HistoryList histories={histories} activeChatId={chatId} />

      <UserFooter />
    </aside>
  );
};

export default SideBar;
