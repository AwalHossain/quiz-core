/** @type {import('next').NextConfig} */
const nextConfig = {
  // remote pattern
  images: {
    remotePatterns: [{ hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
