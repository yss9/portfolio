import Link from "next/link";
import { RecordsList } from "@/features/desktop/LibraryApp";
import { Brand } from "@/features/desktop/Identity";
export default function Page() {
  return (
    <div className="standalone">
      <header className="os-bar">
        <Brand />
        <span className="bar-spacer" />
        <Link href="/desktop/?app=records">데스크톱에서 보기</Link>
      </header>
      <div className="reading-paper">
        <RecordsList />
      </div>
    </div>
  );
}
