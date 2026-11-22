import Admin from "@/features/wiki/Admin";
export const metadata = {
  title: "개인 작업 공간",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <Admin />;
}
