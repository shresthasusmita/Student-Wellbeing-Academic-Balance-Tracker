import axios from "axios";

// Run 'ipconfig' in your PC terminal to grab your active IPv4 address
const PC_IP_ADDRESS = "172.20.10.2"; // <-- Replace with actual local IP

export default axios.create({
  baseURL: `http://${PC_IP_ADDRESS}:5000/api`,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});