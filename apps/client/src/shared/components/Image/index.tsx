import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import api from "@/shared/lib/api";

type ProtectedImage = {
  id: string;
  originalName: string;
  mineType: string;
  variants: {
    key: string;
    resolution: ImageSize;
    }[];
  createdAt: string;
  updatedAt: string;
};

type ImageSize = "thumb" | "medium" | "large";

const getSize = (width: number): ImageSize => {
  if (!width) return "thumb";
  if (width <= 150) return "thumb";
  if (width <= 600) return "medium";
  return "large";
};

const useBlobUrl = (blob: Blob | undefined): string | null => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!blob) {
      setUrl(null);
      return;
    }

    const newUrl = URL.createObjectURL(blob);
    setUrl(newUrl);

    return () => {
      URL.revokeObjectURL(newUrl);
    };
  }, [blob]);

  return url;
};

const useContainerWidth = <T extends HTMLElement>(
  ref: React.RefObject<T | null>,
) => {
  const [width, setWidth] = useState<number>(0);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) setWidth(entries[0].contentRect.width);
    });

    observer.observe(ref.current)

    return () => observer.disconnect();
  });

  return width
};

const fetchImageBlob = async (key: string) => {
  const response = await api.apiClient.get<Blob>(`api/media/image/${key}`, {
    responseType: "blob"
  })

  return response.data
}

type ProtectedImageProps = {
  image: ProtectedImage
}
export const ProtectedImage: React.FC<ProtectedImageProps> = (props) => {
  const { image } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const width = useContainerWidth(containerRef)

  const size: ImageSize = getSize(width)

  const variant = image.variants.find(variant => variant.resolution === size)

  const { data } = useQuery({
    queryFn: async () => {
      return fetchImageBlob()
    },
    queryKey: [
      "iamge"
    ]

  })

  return <div ref={containerRef}></div>
}
