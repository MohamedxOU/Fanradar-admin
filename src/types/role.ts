import { Permession } from "./permession";

export interface Role {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  permessions: Permession[];
}
