import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articles = await getCollection('articles');
  return rss({
    title: 'michelangelo rss',
    description: 'mis estúpidas cavilaciones sobre cualquier cosa',
    site: context.site,
    items: articles.map(({ slug, data }) => ({
      title: data.title,
      pubDate: data.date,
      description: data.description,
      link: `/${slug}/`,
    })),
    customData: `<language>es-es</language>`,
  });
}