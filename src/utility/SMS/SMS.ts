import { errorCreate } from "@/middleware/errorHandler";
import axios from "axios";
function extractErrorCode(errorString) {
  const match = errorString.match(/Error:\s*(\d+)/);
  if (match) {
    return match[1];
  } else {
    return null; // or handle the case where no match is found
  }
}
function handleSMSError(errorCode) {
  switch (+errorCode) {
    case 1002:
      return "Sender ID/Masking Not Found";
    case 1003:
      return "API Not Valid";
    case 1004:
      return "SPAM Detected";
    case 1005:
      return "1005 error code";
    case 1006:
      return "Internal Error";
    case 1007:
      return "Balance Insufficient";
    case 1008:
      return "Message is empty";
    case 1009:
      return "Message Type Not Set";
    case 1010:
      return "Invalid User & Password";
    case 1011:
      return "Invalid User Id";
    case 1012:
      return "Invalid Number";
    case 1013:
      return "API limit error";
    case 1014:
      return "No matching template";
    case 1015:
      return "SMS Content Validation Fail";
    case 1016:
      return "IP was blocked by api provider";
    default:
      return "Unknown Error";
  }
}

const numberPattern = /\d+/;

const SMS = {
  async GetBalance(api_key) {
    try {
      const BalanceResponse = await axios.get(
        `http://sms.dewanict.com/miscapi/${api_key}/getBalance`
      );

      if (BalanceResponse.data.indexOf("Error") !== -1) {
        const errorCode = extractErrorCode(BalanceResponse.data);
        const Message = handleSMSError(errorCode);

        throw errorCreate(406, Message);
      } else {
        return BalanceResponse.data;
      }
    } catch (error) {
      throw error;
    }
  },

  async SendSMS(api_key, sender_id, receiver_number, message) {
    // sms count Bnagla 70 character and Unicode text limit 1530 character
    try {
      const res = await axios.get(
        `http://sms.dewanict.com/smsapi?api_key=${api_key}&type=text&contacts=${receiver_number}&senderid=${sender_id}&msg=${message}`
      );

      if (res.data.indexOf("Error") !== -1) {
        const errorCode = extractErrorCode(res.data);
        const Message = handleSMSError(errorCode);

        throw errorCreate(406, Message);
      } else {
        return res.data;
      }
    } catch (error) {
      throw error;
    }
  },
};

export default SMS;
