import { Tabs } from "@base-ui/react/tabs";
import { useStore } from "@tanstack/react-form";
import { Book, Image as ImageIcon, Images, X } from "lucide-react";
import { useAppForm, withForm } from "@/shared/components/Form/hooks/form";
import { ProtectedImage } from "@/shared/components/Image";
import { Button } from "@/shared/ui/Button";
import { uploadImage } from "../../utils/apis";
import type { CreateProperty } from "../../utils/schema";
import type { Property } from "../../utils/types";
import type { Image } from "./shared-form"
import { propertyFormOpts } from "./shared-form";

type PropertyFormProps = {
  handleSubmit: (value: CreateProperty) => void;
  initialData?: Property;
  buttonLabel: string
};

export const PropertyForm: React.FC<PropertyFormProps> = ({
  handleSubmit,
  initialData,
  buttonLabel = "Save"
}) => {
  const formOpts = initialData ? {
    defaultValues: {
      ...propertyFormOpts.defaultValues,
      ...initialData
    }
  } : propertyFormOpts
  const form = useAppForm({
    ...formOpts,
    onSubmit: ({ value }) => {
      handleSubmit(value);
    },
  });
  return (
    <div className="h-128 grow flex">
      <form
        className="grow flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Tabs.Root className="flex grow" defaultValue="basic">
          <Tabs.List className="flex flex-col bg-stone-100 gap-1.5 p-4 h-full border-r border-stone-300">
            <Tabs.Tab
              className="w-28 flex items-center transition-shadow gap-2 text-sm font-medium hover:bg-stone-200 text-start py-2 px-2.5 min-w-40 data-active:shadow-md data-active:bg-white rounded-xl"
              value="basic"
            >
              <Book size={18} />
              Basic Details
            </Tabs.Tab>
            <Tabs.Tab
              className="w-28 flex items-center transition-shadow gap-2 text-sm font-medium hover:bg-stone-200 text-start py-2 px-2.5 min-w-40 data-active:shadow-md data-active:bg-white rounded-xl"
              value="gallery"
            >
              <Images size={18} />
              Gallery
            </Tabs.Tab>
          </Tabs.List>
          <div className="grow flex flex-col relative">
            <div className="flex flex-col grow p-4">
              <Tabs.Panel value="basic">
                <BasicFields form={form} />
              </Tabs.Panel>
              <Tabs.Panel value="gallery">
                <ImageFields form={form} />
              </Tabs.Panel>
            </div>
            <div className="absolute flex bg-white w-full justify-end bottom-0 p-4 border-t-2 border-stone-200">
              <Button> { buttonLabel }</Button>
            </div>
          </div>
        </Tabs.Root>
      </form>
    </div>
  );
};

export const BasicFields = withForm({
  ...propertyFormOpts,
  render: ({ form }) => {
    return (
      <div className="">
        <h3 className="font-semibold mb-2">Basic Details</h3>
        <form.AppField
        name="name"
        children={(field) => <field.TextField label="Property Name" />}
        />
        <form.AppField
        name="ownerName"
        children={(field) => <field.TextField label="Owner Name" />}
        />
        <form.AppField
        name="ownerContact"
        children={(field) => <field.TextField label="Owner Contact" />}
        />
        <form.AppField
        name="monthlyRent"
        children={(field) => (
          <field.TextField label="Monthly Rent" type="number" />
        )}
        />
        <form.AppField
        name="securityDeposit"
        children={(field) => (
          <field.TextField label="Security Deposit" type="number" />
        )}
        />
      </div>
    );
  },
});

export const ImageFields = withForm({
  ...propertyFormOpts,
  render: ({ form }) => {
    return (
      <div>
        <h3 className="font-semibold mb-1">Gallery</h3>
        <p className="text-sm text-stone-400 mb-4">
          Upload photos of the property.
        </p>
        <ImageUploader form={form} />
        <ImageGrid form={form} />
      </div>
    );
  },
});

export const ImageUploader = withForm({
  ...propertyFormOpts,
  render: ({ form }) => {
    const images = useStore(form.store, (state) => state.values.images);

    return (
      <div>
        <form.Field
        name="imagesToUpload"
        validators={{
          onChangeAsync: async ({ value }) => {
            if (value && value.length > 0) {
              const imageUploadPromises = value.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);

                const imageResponse = await uploadImage(formData);

                return {
                  id: imageResponse.id,
                  previewURL: URL.createObjectURL(file),
                };
              });

              const imageResponse = await Promise.all(imageUploadPromises);

              const newImages = imageResponse.map((image) => ({
                id: image.id,
                previewURL: image.previewURL,
              }));

              const currentImages = images;
              const updatedImageList = [...currentImages, ...newImages];
              form.setFieldValue("images", updatedImageList);
              form.setFieldValue("imagesToUpload", null);
            }
          },
        }}
        children={(field) => (
          <div>
            <input
            id="custom-file-upload"
            className="hidden"
            multiple
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                field.handleChange([...Array.from(e.target.files)]);
                e.target.files = null;
              }
            }}
            />
            <div className="border rounded-lg border-dashed border-stone-300 p-4 flex items-center justify-center">
              <label
                htmlFor="custom-file-upload"
                className="flex gap-2 rounded-xl text-stone-900 text-sm items-center font-medium"
              >
                <ImageIcon size={16} />
                Add Image
              </label>
            </div>
          </div>
        )}
        />
      </div>
    );
  },
});

/**
* Helps to generate Image grid, regardless for local image or
* from response from the server (api call)
*
* Also handles removing image
*/
const ImageGrid = withForm({
  ...propertyFormOpts,
  render: ({ form }) => {
    const images = useStore(form.store, (state) => state.values.images);

    const handleDeleteImage = (id: string) => {
      form.setFieldValue(
        "images",
        images.filter((image) => image.id !== id),
      );
    };

    console.log("images", images)

    return (
      <div className="flex gap-2 mt-4 flex-wrap">
        {images.map((image) => {
          return <ImagePreview key={image.id} image={image} handleDelete={handleDeleteImage}/>
        })}
      </div>
    );
  },
});

type ImagePreviewProps = {
  image: Image
  handleDelete: (id: string) => void;
};

const ImagePreview: React.FC<ImagePreviewProps> = (props) => {
  const { handleDelete, image } = props;
  return (
    <div className="relative w-24 h-24 bg-stone-200 rounded-2xl overflow-clip outline-1 outline-stone-200">
      <button
        type="button"
        onClick={() => handleDelete(image.id)}
        className="absolute z-10 top-1 right-1 w-6 h-6 bg-white border flex items-center justify-center rounded-full border-stone-300"
      >
        <X size={14} />
      </button>
      {"previewURL" in image ?
        <img
          src={image.previewURL}
          alt="preview-image"
          className="absolute h-full w-full inset-0 object-cover"
        ></img>
     : <ProtectedImage image={image}/>
      }
    </div>
  );
};
