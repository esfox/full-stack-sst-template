import { SSTConfig } from 'sst';
import { API } from './stacks/api';
import { FeTemp } from './stacks/fe-temp';

const esbuild = {
  target: 'node18',
  bundle: true,
  minify: false,
  sourcemap: true,
  external: ['aws-sdk'],
};

export default {
  config(_input) {
    return {
      name: 'full-stack-sst-starter',
      region: process.env.AWS_REGION ?? 'ap-southeast-1',
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({ nodejs: { esbuild } });
    app.stack(API);
    app.stack(FeTemp);
  },
} satisfies SSTConfig;
