import { StaticSite, use, type StackContext } from 'sst/constructs';
import { API } from './api';

const localhostUrl = 'http://localhost:4200';

export function CMS({ stack }: StackContext) {
  const { api } = use(API);
  const site = new StaticSite(stack, 'cms', {
    path: 'packages/cms',
    buildOutput: 'dist',
    buildCommand: `sst bind npm run setenv --stage ${stack.stage} && npm run build`,
    environment: {
      API_URL: api.url,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url ?? localhostUrl,
  });
}
