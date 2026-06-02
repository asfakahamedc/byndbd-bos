export type UserLayer = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface BOSUser {
  id: string;
  email: string;
  full_name: string;
  layer: UserLayer;
  department: string | null;
  status: 'active' | 'inactive' | 'offboarded';
  two_fa_enabled: boolean;
}
