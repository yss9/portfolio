"use client";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { ko } from "@blocknote/core/locales";
import type { Doc } from "@/lib/api/model";
import "@blocknote/mantine/style.css";
export default function Editor({
  initial,
  change,
  disabled,
}: {
  initial: Doc["blocks_json"];
  change: (blocks: Doc["blocks_json"]) => void;
  disabled: boolean;
}) {
  const editor = useCreateBlockNote({
    initialContent: initial.length ? initial : undefined,
    dictionary: ko,
  });
  return (
    <BlockNoteView
      editor={editor}
      theme="light"
      editable={!disabled}
      onChange={() => change(editor.document)}
    />
  );
}
