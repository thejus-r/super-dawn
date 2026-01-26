export type Property = {
  id: string;
  name: string;
  ownerName: string;
  ownerContact: string;
  monthlyRent: string;
  securityDeposit: string;
  authorId: string;
  organizationId: string | null;
  createAt: string;
  updatedAt: string;
  images: []
};

export type ListOfPropertyResponse = {
  properties: Property[];
};
