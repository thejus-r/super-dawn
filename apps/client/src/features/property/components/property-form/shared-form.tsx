import { formOptions } from "@tanstack/react-form";

type Image = {
  id: string;
};

type PropertyFormValue = {
  propertyName: string;
  ownerName: string;
  ownerContact: string;
  imagesToUpload: File[] | null;
  images: Image[];
};

const defaultValues: PropertyFormValue = {
  propertyName: "",
  ownerName: "",
  ownerContact: "",
  imagesToUpload: null,
  images: [],
};

export const propertyFormOpts = formOptions({
  defaultValues,
});
