import type { Metadata, Viewport } from "next";
import { GuestHandoff } from "@/features/desktop/GuestHandoff";
import { Preferences } from "@/features/desktop/Preferences";
import { profile } from "@/content/profile";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import "./desktop.css";
import "./sys-workspace.css";

export const metadata: Metadata = {
  title: {
    default: `SYS Workspace · ${profile.name}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.headline,
  openGraph: {
    title: `SYS Workspace · ${profile.name}`,
    description: profile.headline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#101011",
  interactiveWidget: "resizes-content",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body className="min-h-screen antialiased">
        <Preferences />
        <a href="#main" className="skip-link">
          본문으로 건너뛰기
        </a>
        <main id="main">
          <GuestHandoff>{children}</GuestHandoff>
        </main>
      </body>
    </html>
  );
}
