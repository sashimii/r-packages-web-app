import { AuthorType } from "./author";

export interface PackageType {
  id: number;
  name: string;
  title: string;
  version: string;
  license: string;
  depends?: [string];
  suggests?: [string];
  imports?: [string];
  authors: [AuthorType]
}