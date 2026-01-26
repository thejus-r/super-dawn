import api from "@/shared/lib/api";

interface ImageUploadResponse {
  id: string
}

export async function uploadImage(formData: FormData) {
  const response = await api.apiClient.post<ImageUploadResponse>("/media/image", formData, {
    headers:  {
      "Content-Type": undefined,
    },
  })
  return response.data
}
