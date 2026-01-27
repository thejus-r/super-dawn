import { Select } from "@base-ui/react"
import { useNavigate } from "@tanstack/react-router";
import { ChevronsUpDownIcon } from "lucide-react";
import styles from "./style.module.css"

type ScopeOption= {
  label: string;
  slug: string
}

const scopeOptions: ScopeOption[] = [
  {
    label: "Personal Workspace",
    slug: "personal"
  },
  {
    label: "Vadakaveedu",
    slug: "vadakaveedu"
  },
  {
    label: "Raven Homes",
    slug: "raven"
  }
]


export const SelectScope = () => {

  const navigate = useNavigate()

  const handleScopeChange = (value: ScopeOption | null) => {
    if (value) {
      navigate({
        to: "/$scopeId",
        params: {
          scopeId: value.slug
        }
      })

    }
  }


  return <Select.Root onValueChange={handleScopeChange} defaultValue={scopeOptions[0]} itemToStringValue={item => item.slug}>
    <Select.Trigger className={styles.Select}>
      <Select.Value>
        {(option: ScopeOption) =>
          <span className={styles.ValueText}>
            <span className={styles.ValuePrimary}>
              {option.label}
            </span>
          </span>
        }
      </Select.Value>
      <Select.Icon className={styles.SelectIcon}>
        <ChevronsUpDownIcon size={16}/>
      </Select.Icon>
    </Select.Trigger >
    <Select.Portal>
      <Select.Positioner className={styles.Positioner} align="start" sideOffset={8} >
        <Select.Popup className={styles.Popup}>
          <Select.List className={styles.List}>
            {scopeOptions.map(option => (
              <Select.Item className={styles.Item} value={option} key={option.slug}>
                <Select.ItemText className={styles.ItemText}>{ option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.List>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
}
