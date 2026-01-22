import { formOptions } from "@tanstack/react-form";

type Image = {
  id: string;
};

type PropertyFormValue = {
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
