import axios from "axios";

// Run 'ipconfig' in your PC terminal to grab active IPv4 address
const PC_IP_ADDRESS = "192.168.0.32"; // <-- Replace with actual local IP

export default axios.create({
  baseURL: `http://${PC_IP_ADDRESS}:5000/api`,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});