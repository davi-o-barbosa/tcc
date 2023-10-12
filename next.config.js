/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'http',
      hostname: 'www.scielo.*'
    }],
    
  }
}

module.exports = nextConfig
