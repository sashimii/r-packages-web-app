import { PackageType } from "./package";

export interface AuthorType {
  id: number;
  name: string;
  email: string;
  packages: [PackageType]
}