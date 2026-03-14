export interface User {
  name: string;
  email: string;
  address: {
    city: string;
    pincode: number;
  };
  tags: string[];
}
