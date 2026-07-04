// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   images: {
//     domains: ["img.magnific.com"],
//   },

//   // reactCompiler: true,
// };

// export default nextConfig;




/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.magnific.com",
      },
    ],
  },
};

export default nextConfig;