export interface UserData {
  _id?: any;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  deletionRequested: boolean;
  createdAt: Date;
}
