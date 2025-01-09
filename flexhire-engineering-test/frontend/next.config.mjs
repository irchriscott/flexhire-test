import relayConfig from './relay.config.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        relay: relayConfig
    }    
};

export default nextConfig;
