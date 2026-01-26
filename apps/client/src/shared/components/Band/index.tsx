import { Select } from "@base-ui/react"
import { SelectScope } from "./SelectScope"

type SwitcherType = {
  label: string
  slug: string,
}
const switcherOptions: SwitcherType[] = [
  {
    label: "Personal Workspace",
    slug: "personal",
  },
  {
    label: "Vadakaveedu",
    slug: "vadakaveedu",
  },
  {
    label: "Raven Homes",
    slug: "raven-homes",
  }
]

export const Band = () => {
  return <div className="p-3 border-b border-stone-300">
    <SelectScope/>
  </div>
}

const Switcher = () => {
  return <Select.Root defaultValue={switcherOptions[0]} itemToStringValue={item => item.slug}>
    <Select.Trigger>
      <Select.Value>
        {(item: SwitcherType) => (
          <span className="text-sm">
            {item.label}
          </span>
        )}
      </Select.Value>
    </Select.Trigger>
    <Select.Portal>
      <Select.Backdrop />
      <Select.Positioner align="start" alignItemWithTrigger={false} className="outline-none select-none z-10" sideOffset={8}>
        <Select.Popup className="group min-w-(--anchor-width) origin-(--transform-origin) bg-clip-padding bg-white rounded-lg shadow-lg shadow-gray-200 outline-1 outline-gray-200">
          {switcherOptions.map(item =>
            <Select.Item
              className="cursor-default gap-2 py-2.5 pr-4 pl-2.5 outline-none select-none group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-5 pointer-coarse:py-2.5 pointer-coarse:text-[0.925rem] [@media(hover:hover)]:data-highlighted:relative [@media(hover:hover)]:data-highlighted:z-0 [@media(hover:hover)]:data-highlighted:text-gray-50 [@media(hover:hover)]:data-highlighted:before:content-[''] [@media(hover:hover)]:data-highlighted:before:absolute [@media(hover:hover)]:data-highlighted:before:inset-y-0 [@media(hover:hover)]:data-highlighted:before:inset-x-1 [@media(hover:hover)]:data-highlighted:before:rounded-sm [@media(hover:hover)]:data-highlighted:before:bg-gray-900 [@media(hover:hover)]:data-highlighted:before:z-[-1]"
              key={item.slug}
              value={item}>
                <Select.ItemText className="text-sm">{item.label} </Select.ItemText>
              </Select.Item>
          )}
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
}
