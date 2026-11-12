import projectConfig from '../../repos/qwen-pr14353-maint-20261108/packages/web-shell/vite.config.ts';

// Local harness only: normalize the junction's physical root and cache paths.
export default async (env) => {
  const config = typeof projectConfig === 'function' ? await projectConfig(env) : await projectConfig;
  return {
    ...config,
    root: 'F:/Antigravity/PR_Workspace/repos/qwen-pr14353-maint-20261108/packages/web-shell/client',
    cacheDir: 'F:/PR_Workspace/.work/pr-repair/qwen-ui-verify-20261112-1520-gate-agent/vite-cache',
    server: {
      ...config.server,
      fs: { allow: ['F:/Antigravity/PR_Workspace/repos', 'F:/PR_Workspace/repos', 'F:/PR_Workspace/.work/pr-repair/qwen-ui-verify-20261112-1520-gate-agent/vite-cache'] },
    },
  };
};
