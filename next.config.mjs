/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        staleTimes: {
            dynamic: 0,
        },
        serverComponentsExternalPackages: ["googleapis"],
    }
};

export default nextConfig;
