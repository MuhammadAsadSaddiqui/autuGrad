export interface UserInterface {
  id: number;
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  emailVerifiedTime: Date | null;
}
