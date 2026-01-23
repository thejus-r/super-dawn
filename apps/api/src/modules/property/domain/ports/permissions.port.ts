export interface IPermissionPort {
  can(userId: string, organizationId: string, action: string ): Promise<boolean>;
}
