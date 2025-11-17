/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['stripe.com', 'luma-pos-assets.s3.amazonaws.com'],
  },
}

module.exports = nextConfig