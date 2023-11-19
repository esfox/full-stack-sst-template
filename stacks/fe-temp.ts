import { StaticSite, type StackContext } from 'sst/constructs';

export function FeTemp({ stack }: StackContext) {
  const site = new StaticSite(stack, 'fe-temp', {
    path: 'packages/fe-temp',
    buildOutput: 'build',
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
