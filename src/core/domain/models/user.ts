export type UserRole = 'executive_ceo' | 'supply_chain_lead' | 'growth_analyst' | 'store_manager';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  avatar: string;
  assignedBranch: string;
  permissions: string[];
}
