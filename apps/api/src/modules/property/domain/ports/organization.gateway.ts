export interface IOrganizationGateway {
  exists (orgId: string): Promise<boolean>
  canCreateProperty (userId: string, orgId:string): Promise<boolean>
}
