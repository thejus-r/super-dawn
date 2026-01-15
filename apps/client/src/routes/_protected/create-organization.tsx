import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useCreateOrganization } from "@/features/organization/hooks/use-create-organization";

export const Route = createFileRoute("/_protected/create-organization")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate } = useCreateOrganization();
  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
    },
    onSubmit: ({ value }) => {
      console.log(value);

      mutate({
        organizationName: value.name,
        organizationSlug: value.slug,
      });
    },
  });

  return (
    <div className="w-screen h-screen flex flex-col bg-neutral-100 items-center justify-center">
      <div className="bg-white p-5 flex flex-col gap-4 w-full max-w-1/4 min-w-96">
        <div>
          <h3 className="text-xl font-medium">Create Organization</h3>
          <p className="text-sm text-neutral-400">
            Create or select and organization to continue.
          </p>
        </div>
        <div>
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="name"
              children={(field) => {
                return (
                  <label>
                    <span>Organization Name</span>
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </label>
                );
              }}
            />

            <form.Field
              name="slug"
              children={(field) => {
                return (
                  <label>
                    <span>Organization Slug</span>
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </label>
                );
              }}
            />
            <button type="submit">Create organization</button>
          </form>
        </div>
      </div>
    </div>
  );
}
