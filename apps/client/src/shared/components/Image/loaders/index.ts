import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useState } from "react";
import api from "@/shared/lib/api";

type ProtectedImage = {
	id: string;
	originalName: string;
	mineType: string;
	variants: {
		key: string;
		resolution: ImageVariant;
	}[];
	createdAt: string;
	updatedAt: string;
};

type ImageVariant = "thumb" | "medium" | "large";

const getVariant = (width: number) => {
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
};

const fetchImageBlob = async (key: string) => {
  const response = await api.apiClient.get<Blob>(`api/media/image/${key}`, {
    responseType: "blob"
  })

  return response.data
}

// Loads image from API end point with Auth Headers
export function secureLoader(image: ProtectedImage) {
	const { data } = useQuery({
		queryKey: ["image", image.id],
	});
}
