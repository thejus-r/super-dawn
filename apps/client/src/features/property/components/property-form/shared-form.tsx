import { formOptions } from "@tanstack/react-form";

type AddedImage = {
  id: string;
  previewURL: string;
}

type ImageFromServer = {
  id: string;
  originalName: string;
  key: string;
  mimeType: string;
  variants: {
    key: string;
    resolution: "thumb" | "medium" | "large"
  }[];
  createdAt: string;
  updatedAt: string;

}

export type Image = AddedImage | ImageFromServer

export type PropertyFormValue = {
  name: string;
  ownerName: string;
  ownerContact: string;
  monthlyRent: string;
  securityDeposit: string;
  imagesToUpload: File[] | null;
  images: Image[];
};

const defaultValues: PropertyFormValue = {
  name: "",
  ownerName: "",
  ownerContact: "",
  monthlyRent: "0",
  securityDeposit: "0",
  imagesToUpload: null,
  images: [],
};

export const propertyFormOpts = formOptions({
  defaultValues,
});
