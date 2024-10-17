import os from "os";
const getIpAddress = () => {
  // Get the network interfaces
  const networkInterfaces = os.networkInterfaces();

  // Iterate through network interfaces to find the IPv4 address
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    const interfaceInfo = networkInterfaces[interfaceName];
    for (const info of interfaceInfo) {
      // Check if it's an IPv4 address and not internal (like 127.0.0.1)
      if (info.family === "IPv4" && !info.internal) {
        console.log(`System IP Address: ${info.address}`);
      }
    }
  });
};
export default getIpAddress;
