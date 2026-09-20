import copy from '../prepared-content.json';
import sources from '../../public/images/enhanced/sources.json';
import careDetails from './care-details.json';

export const uploadName = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.webp$/;
export const defaultContent = { version: 'initial', copy, careDetails, images: sources };
export type Content = typeof defaultContent;
export type ImageKey = keyof Content['images'];

// Keep the existing page structure, card counts, and icon mappings intact.
function textShape(value: unknown, template: unknown, label: string): void {
  if (typeof template === 'string') {
    if (
      typeof value !== 'string' ||
      value.length > 6000 ||
      (template.trim() && !value.trim()) ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)
    )
      throw new Error(`${label}: enter text between 1 and 6,000 characters.`);
    return;
  }
  if (Array.isArray(template)) {
    if (!Array.isArray(value) || value.length !== template.length)
      throw new Error(`${label}: keep the existing number of items.`);
    template.forEach((item, i) => textShape(value[i], item, `${label} ${i + 1}`));
    return;
  }
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error(`${label}: invalid section.`);
  const expected = template as Record<string, unknown>;
  const actual = value as Record<string, unknown>;
  if (
    Object.keys(actual).length !== Object.keys(expected).length ||
    Object.keys(actual).some((key) => !Object.hasOwn(expected, key))
  )
    throw new Error(`${label}: unexpected fields.`);
  for (const key of Object.keys(expected))
    textShape(actual[key], expected[key], `${label} / ${key}`);
}
export function validateContent(value: unknown): Content {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Invalid content.');
  const c = value as Content;
  if (
    Object.keys(c).sort().join(',') !== 'careDetails,copy,images,version' ||
    typeof c.version !== 'string' ||
    !/^(initial|[a-f0-9-]{36})$/.test(c.version)
  )
    throw new Error('Invalid content version.');
  textShape(c.copy, copy, 'Page text');
  textShape(c.careDetails, careDetails, 'Care services');
  for (const key of ['who', 'when', 'support'] as const) {
    const values = c.copy.contact[key];
    if (
      values.some((text) => text.length > 60 || /[\r\n\t]/.test(text) || text !== text.trim()) ||
      new Set(values).size !== values.length
    )
      throw new Error('Contact options must be unique, trimmed, and at most 60 characters.');
  }
  if (
    !c.images ||
    typeof c.images !== 'object' ||
    Array.isArray(c.images) ||
    Object.keys(c.images).sort().join() !== Object.keys(sources).sort().join()
  )
    throw new Error('Invalid photo list.');
  for (const key of Object.keys(sources) as ImageKey[]) {
    const img = c.images[key];
    if (
      !img ||
      Object.keys(img).sort().join() !== 'height,src,width' ||
      typeof img.src !== 'string' ||
      !(
        img.src === sources[key].src ||
        (img.src.startsWith('/media/') && uploadName.test(img.src.slice(7)))
      ) ||
      !Number.isInteger(img.width) ||
      !Number.isInteger(img.height) ||
      img.width < 1 ||
      img.height < 1 ||
      img.width > 10000 ||
      img.height > 10000
    )
      throw new Error(`Invalid photo: ${key}.`);
  }
  return structuredClone(c);
}
