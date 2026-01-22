import { useAppForm, withForm } from "@/shared/components/Form/hooks/form";
import { Tabs } from "@base-ui/react/tabs";
import { propertyFormOpts } from "./shared-form";
import { Button } from "@/shared/ui/Button";
import { useStore } from "@tanstack/react-form";
import api from "@/shared/lib/api";
import { X, Image, Book, Images } from "lucide-react";

type PropertyFormProps = {};

export const PropertyForm: React.FC<PropertyFormProps> = () => {
  const form = useAppForm({
    ...propertyFormOpts,
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2));
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
              <Button> Create Property </Button>
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
          name="propertyName"
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
              console.log("debug", value);
              if (value && value.length > 0) {
                const imageUploadPromises = value.map(async (file) => {
                  const formData = new FormData();
                  formData.append("file", file);

                  const response = await api.apiClient.post(
                    "/media/image",
                    formData,
                    {
                      headers: {
                        "Content-Type": undefined,
                      },
                    },
                  );

                  return response.data;
                });

                const imageResponse = await Promise.all(imageUploadPromises);

                const newImages = imageResponse.map((image) => ({
                  id: image.id,
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
                  <Image size={16} />
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
        images.filter((image) => image.id != id),
      );
    };

    return (
      <div className="flex gap-2 mt-4 flex-wrap">
        {images.map((image) => {
          return (
            <ImagePreview id={image.id} handleDelete={handleDeleteImage} />
          );
        })}
      </div>
    );
  },
});

type ImagePreviewProps = {
  id: string;
  handleDelete: (id: string) => void;
};
const ImagePreview: React.FC<ImagePreviewProps> = (props) => {
  const { id, handleDelete } = props;
  return (
    <div className="relative w-24 h-24 bg-stone-200 rounded-2xl">
      <button
        type="button"
        onClick={() => handleDelete(id)}
        className="absolute top-1 right-1 w-6 h-6 bg-white border flex items-center justify-center rounded-full border-stone-300"
      >
        <X size={14} />
      </button>
    </div>
  );
};
