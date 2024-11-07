import { AgencyI } from "@/database/model/Agency";
import { agencyServices } from "@/service/agency/Agency";
import { Request, Response } from "express";

const agencyRegistration = async (req: Request<{}, {}, AgencyI>, res: Response ) : Promise<void> => {
  try {
    // Await the service to ensure the result is returned before proceeding
    const result = await agencyServices.agencyRegistrationIntoDB(req.body);
    
    res.status(200).json({
      success: true,
      data: result,
      message: 'Agency registration completed successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'An error occurred while registering the agency'
    });
  }
};

export const  agencyControllers = {
  agencyRegistration
};
