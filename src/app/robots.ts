import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/checkout/'],
      },
    ],
    sitemap: 'https://obracircular.com.br/sitemap.xml',
  };
}
