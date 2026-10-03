import { z, type ZodType } from 'zod';

export const pageMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type PageMeta = z.infer<typeof pageMetaSchema>;

const dataEnvelopeSchema = z.object({ data: z.unknown() });
const pageEnvelopeSchema = z.object({ data: z.array(z.unknown()), meta: pageMetaSchema });

export const readData = <T extends ZodType>(schema: T, body: unknown): z.output<T> =>
  schema.parse(dataEnvelopeSchema.parse(body).data);

export const readPage = <T extends ZodType>(itemSchema: T, body: unknown) => {
  const page = pageEnvelopeSchema.parse(body);
  const items: z.output<T>[] = page.data.map((item) => itemSchema.parse(item));
  return { items, meta: page.meta };
};
