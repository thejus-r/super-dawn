interface AppShellProps {
  children: React.ReactNode
}
export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return <div className="p-4 grow">{children}</div>
}
