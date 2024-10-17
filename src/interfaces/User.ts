export interface institute {
  id: string | null;
  institute_name: string | null;
  email: string;
  phone: string;
  logo: string | null;
  institute_code: string | null;
  institute_type: string | null;
  facebook_url: string | null;
  division: string | null;
  board: string | null;
  Address: string | null;
  subscription: Date | null;
  status: "active" | "deactivate" | "non_verify";
  subscription_pac: "free" | "monthly" | "yearly" | "yearly_bio" | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface user {
  type: "user" | "super";
  role: string[];
  institute_id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  logo: string;
  institute_code: string;
  institute_type: string;
  facebook_url: string;
  division: string;
  board: string;
  address: string;
  subscription: string;
  institutes?: institute | null;
}

export type RegInputs = {
  name: string;
  email: string;
  phone: string;
  newPassword: string;
  confirmPassword: string;
  acceptTerms: string;
};
