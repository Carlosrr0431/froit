/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/crmREMAX',
        destination: '/CrmREMAX',
        permanent: true,
      },
      {
        source: '/crm',
        destination: '/CrmREMAX',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
