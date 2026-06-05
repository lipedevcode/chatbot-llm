import { useParams } from "react-router-dom";

import type { Usuario } from "../interfaces/database";
import HistoryList from "./HistoryList";
import UserFooter from "./UserFooter";
import SidebarHeader from "./SidebarHeader";
import FuncionalitiesLIst from "./FuncionalitiesLIst";
import { getHistoryByUser } from "../services/chat.service";

interface SideBarProps {
  // Será substituído pelo retorno real do endpoint quando integrado
  usuario?: Usuario;
}

const SideBar = ({ usuario }: SideBarProps) => {
  const { chatId } = useParams<{ chatId: string }>();

  const histories = getHistoryByUser(usuario);

  return (
    <aside className="flex flex-col h-screen w-64 bg-sidebar border-r border-border px-4 py-5 select-none">
      <SidebarHeader></SidebarHeader>

      <FuncionalitiesLIst></FuncionalitiesLIst>

      <HistoryList histories={histories} activeChatId={chatId} />

      <UserFooter usuario={usuario} />
    </aside>
  );
};

export default SideBar;
