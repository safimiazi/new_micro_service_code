function generateOTP(): string {
  // Generate a random 5-digit number
  const otp: number = Math.floor(10000 + Math.random() * 90000);
  return otp.toString().padStart(5, "0"); // Convert to string if needed
}
export default generateOTP;
