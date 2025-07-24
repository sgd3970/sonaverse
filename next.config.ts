import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    MONGODB_URI: 'mongodb+srv://admin:kACXwyLodJiLE3Ka@sonaverse.e0zqfop.mongodb.net/sonaverse?retryWrites=true&w=majority&appName=Sonaverse',
  },
};

export default nextConfig;
