import { db } from "@/database"
import { AgencyI } from "@/database/model/Agency"


const agencyRegistrationIntoDB = async (data : AgencyI) => {
  console.log("data", data)
  const result = await db.Agency.create(data);
  return result;
}




export const agencyServices = {
  agencyRegistrationIntoDB
}
