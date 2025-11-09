import prisma from '../db/prisma.js';

export default async function slugify(text: string): Promise<string> {
  let slug = text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replaceAll(/^-|-$/g, '');

  slug = await handleDuplicate(slug);

  return slug;
}

async function countDuplicates(slug: string): Promise<number> {
  const duplicates = await prisma.post.findMany({
    where: {
      slug: { startsWith: slug },
    },
  });

  return duplicates.length;
}

async function handleDuplicate(slug: string): Promise<string> {
  const duplicates = await countDuplicates(slug);
  if (duplicates > 0) {
    slug = slug.concat(`-${duplicates}`);
  }

  return slug;
}
