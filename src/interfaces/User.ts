interface UserInterface {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  designation: string;
  role: string;
  type: "super" | "user";
  password: string;
  status: "active" | "deactivate" | "non_verify" | "request";
  session: string;
  otp: string;
  agency_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
