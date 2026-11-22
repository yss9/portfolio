"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { PublicImage, WorkspaceApi } from "@/lib/api/model";
export default function PreviewImage({
  api,
  draftId,
  image,
}: {
  api: WorkspaceApi;
  draftId: string;
  image: PublicImage;
}) {
  const [src, setSrc] = useState(""),
    [error, setError] = useState(false);
  useEffect(() => {
    let live = true,
      url = "";
    api
      .previewImage(draftId, image.name)
      .then((value) => {
        url = value;
        if (live) setSrc(value);
        else if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      })
      .catch(() => {
        if (live) setError(true);
      });
    return () => {
      live = false;
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    };
  }, [api, draftId, image.name]);
  return (
    <figure>
      {src && !error ? (
        <Image
          unoptimized
          width={720}
          height={450}
          src={src}
          alt={image.alt}
          onError={() => setError(true)}
        />
      ) : (
        <p>{error ? "이미지를 불러오지 못했습니다." : "이미지 확인 중"}</p>
      )}
      <figcaption>{image.alt}</figcaption>
    </figure>
  );
}
