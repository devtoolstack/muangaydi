/**
 * Creates an SEO-friendly slug from a string.
 * Removes Vietnamese accents, converts to lowercase, replaces spaces with hyphens.
 */
export const slugify = (text: string): string => {
  if (!text) return '';
  
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/đ/g, 'd').replace(/Đ/g, 'D') // Handle specific Vietnamese 'đ'
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove all non-word chars except hyphens
    .replace(/--+/g, '-'); // Replace multiple hyphens with single one
};

export const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
