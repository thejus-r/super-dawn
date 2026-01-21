import { useAppForm, withForm } from "@/shared/components/Form/hooks/form";
import { Tabs } from "@base-ui/react/tabs";
import { propertyFormOpts } from "./shared-form";
import { Button } from "@/shared/ui/Button";
import { useStore } from "@tanstack/react-form";
import api from "@/shared/lib/api";
import { X } from "lucide-react";

type PropertyFormProps = {};

export const PropertyForm: React.FC<PropertyFormProps> = () => {
  const form = useAppForm({
    ...propertyFormOpts,
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2));
    },
  });
  return (
    <div className="h-96 grow flex">
      <form
        className="grow flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Tabs.Root className="flex grow" defaultValue="basic">
          <Tabs.List className="flex flex-col bg-stone-100 gap-1.5 p-4 h-full border-r border-stone-200">
            <Tabs.Tab
              className="w-28 bg-white ring ring-stone-200 text-sm font-medium text-start py-2 px-2.5 min-w-40 data-active:text-white data-active:bg-stone-900 rounded-xl data-active:ring-2"
              value="basic"
            >
              Basic Details
            </Tabs.Tab>
            <Tabs.Tab
              className="w-28 bg-white ring ring-stone-200 text-sm font-medium text-start py-2 px-2.5 min-w-40 data-active:text-white data-active:bg-stone-900 rounded-xl data-active:ring-2"
              value="gallery"
            >
              Gallery
            </Tabs.Tab>
          </Tabs.List>
          <div className="p-4 grow">
            <Tabs.Panel value="basic">
              <BasicFields form={form} />
            </Tabs.Panel>
            <Tabs.Panel value="gallery">
              <ImageFields form={form} />
            </Tabs.Panel>
            <div className="flex justify-end">
              <Button> Create </Button>
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
      </div>
    );
  },
});

export const ImageUploader = withForm({
  ...propertyFormOpts,
  render: ({ form }) => {
    const imagesToUpload = useStore(
      form.store,
      (state) => state.values.imagesToUpload,
    );
    const images = useStore(form.store, (state) => state.values.images);

    const handleDeleteImage = (id: string) => {
      form.setFieldValue(
        "images",
        images.filter((image) => image.id != id),
      );
    };
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
            <input
              multiple
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  field.handleChange([...Array.from(e.target.files)]);
                  e.target.files = null;
                }
              }}
            />
          )}
        />
        <div className="grid grid-cols-5">
          {images.map((image) => {
            return (
              <ImagePreview id={image.id} handleDelete={handleDeleteImage} />
            );
          })}
        </div>
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
