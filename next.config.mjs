import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        staleTimes: {
            dynamic: 0,
        },
        serverComponentsExternalPackages: ["googleapis"],
    }
};

export default withNextIntl(nextConfig);
