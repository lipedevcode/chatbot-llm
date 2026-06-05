import type { ChatHistory } from "../interfaces/database";
import { HistoryLink } from "./HistoryLink";

interface HistoryListProps {
  histories: ChatHistory[];
  activeChatId?: string;
}

const HistoryList = ({ histories, activeChatId }: HistoryListProps) => {

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted px-3 mb-2">
        Conversas
      </p>

      <div className="flex flex-col gap-0.5">
        {histories.map((history, i) => (
          <HistoryLink
            activeChatId={activeChatId}
            history={history.prompts ?? []}
            id={history.id ?? i}
            key={i}
          />
        ))}
      </div>
    </div>
  );
};
export default HistoryList;
