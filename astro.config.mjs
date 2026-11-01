import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  trailingSlash: 'always',
  redirects: {
    '/vote':
      'https://docs.google.com/forms/d/e/1FAIpQLSflkS1b_IogVXVkgSqRHMoW1aZFUotYA4NRaQ3Qt3RYGrM6iw/viewform',
  },
  devToolbar: { enabled: false },
});
