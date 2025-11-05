const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  i18n,
  publicRuntimeConfig: {
    contentEnv: process.env.CONTENT_ENV, // production / development / staging, ..
    apiBaseUrl: process.env.INOVIS_API_URL,
  },
  serverRuntimeConfig: {
    gaConfig: 'ga4Config.json',
  },
  // Tell Next to transpile the linked package so changes in the package source are picked up and HMR works
  transpilePackages: ['@pfp/frontend-platform'],
  experimental: {
    largePageDataBytes: 256 * 10000,
    esmExternals: 'loose', // Allow ESM externals to be handled more loosely
  },
  images: {
    domains: [
      'cdn.stage.universum.renomia.cz',
      'fe-source2.suri.cz',
      'fe-source2.povinne-ruceni.com',
      'fe-source2.srovnator.cz',
      'qr.stage.inovis.renomia.cz',
      'qr.inovis.renomia.cz',
    ],
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    // Handle symlinks properly - but don't break ESM resolution
    // config.resolve.symlinks = false;  // This breaks react-bootstrap ESM resolution

    // In development mode, watch for changes in linked packages
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /node_modules\/(?!@pfp\/frontend-platform)/,
        followSymlinks: true,
      };
    } // Ensure consistent React resolution for ALL dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      react$: require.resolve('react'),
      'react-dom$': require.resolve('react-dom'),
      'react/jsx-runtime$': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime$': require.resolve('react/jsx-dev-runtime'),
    };

    // Explicitly tell webpack where to find react modules for ESM packages
    config.resolve.modules = ['node_modules', require('path').resolve(__dirname, 'node_modules')];

    // Provide jsx-runtime globally for all UMD and ESM modules
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.ProvidePlugin({
        React: 'react',
        ReactJSXRuntime: 'react/jsx-runtime',
      }),
    );

    // Handle import.meta in dependencies
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/pojisteni',
        destination: '/contract',
      },
      {
        source: '/pojistnik',
        destination: '/insurer',
      },
      {
        source: '/preplatek',
        destination: '/overpayment',
      },
      {
        source: '/podpis',
        destination: '/signature',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/povinne-ruceni',
        destination: '/povinne-ruceni-prehled',
        permanent: true,
      },
      {
        source: '/havarijni-pojisteni',
        destination: '/havarijni-pojisteni-prehled',
        permanent: true,
      },
      {
        source: '/pay',
        destination: '/api/payment-gateway/entry',
        permanent: true,
      },
    ];
  },
};

if (process.env.CONTENT_ENV !== 'production' && process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
    openAnalyzer: false,
  });

  module.exports = (phase, defaultConfig) => {
    return withBundleAnalyzer(defaultConfig);
  };
}
