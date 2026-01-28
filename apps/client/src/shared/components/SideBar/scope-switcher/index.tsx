import { Select } from "@base-ui/react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"
import { currentUserQueryOptions } from "@/features/auth/api/auth-query-options"
import styles from "./index.module.css"

type ScopeOption = {
  label: string;
  slug: string;
}

export const ScopeSwitcher = () => {
  const { data: { memberships } } = useSuspenseQuery(currentUserQueryOptions())
  const navigate = useNavigate({ from: "/$scopeId" })
  const params = useParams({ strict: false });

  // Maps memberships to options
  const orgOptions = memberships.map(membership => ({
    label: membership.organization.name,
    slug: membership.organization.slug,
  }))

  // First option as personal workspace
  const options: ScopeOption[] = [
    {
      label: "Personal Workspace",
      slug: "personal",
    },
    ...orgOptions
  ]

  const currentSlug = options.find(option => option.slug === params.scopeId)

  const handleOrgChange = (value: ScopeOption | null) => {
    if (!value) return

    if (value.slug === params.scopeId) return

    // Only change when scope is changed
    navigate({
      to: "/$scopeId",
      params: {
        scopeId: value.slug
      }
    })

  }
  return <Select.Root value={currentSlug ?? options[0]} onValueChange={handleOrgChange} itemToStringValue={item => item.slug}>
    <Select.Trigger className={styles.Trigger}>
      <Select.Value>
        {(option: ScopeOption) => (
          <span className={styles.ValueText}>
            <span className={styles.ValuePrimary}>{option.label}</span>
            <span className={styles.ValueSecondary}>{option.slug}</span>
          </span>
        )
        }
      </Select.Value>
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner className={styles.Positioner} align="start" sideOffset={8}>
        <Select.Popup className={styles.Popup}>
          <Select.List className={styles.List}>
            {options.map((option) => {
              return <Select.Item key={option.slug} value={option} className={styles.Item}>
                <Select.ItemText className={styles.ItemText}>
                  <span className={styles.ItemLabel}>{option.label}</span>
                  <span className={styles.ItemDescription}>{option.slug}</span>
                </Select.ItemText>
              </Select.Item>
            })}
          </Select.List>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
}
