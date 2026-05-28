import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { products } from "@db/schema";
import { eq, like, and, gte, lte, desc, asc, sql } from "drizzle-orm";

const listInput = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sort: z.enum(["price_asc", "price_desc", "name_asc", "newest"]).optional(),
  page: z.number().default(1),
  limit: z.number().default(12),
});

export const productRouter = createRouter({
  list: publicQuery
    .input(listInput)
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input.category) {
        conditions.push(eq(products.category, input.category as any));
      }
      if (input.search) {
        conditions.push(like(products.name, `%${input.search}%`));
      }
      if (input.minPrice !== undefined) {
        conditions.push(gte(products.price, input.minPrice.toString()));
      }
      if (input.maxPrice !== undefined) {
        conditions.push(lte(products.price, input.maxPrice.toString()));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      let orderBy;
      switch (input.sort) {
        case "price_asc":
          orderBy = asc(products.price);
          break;
        case "price_desc":
          orderBy = desc(products.price);
          break;
        case "name_asc":
          orderBy = asc(products.name);
          break;
        case "newest":
        default:
          orderBy = desc(products.createdAt);
          break;
      }

      const page = input.page ?? 1;
      const limit = input.limit ?? 12;
      const offset = (page - 1) * limit;

      const [results, countResult] = await Promise.all([
        db
          .select()
          .from(products)
          .where(whereClause)
          .orderBy(orderBy)
          .limit(limit)
          .offset(offset),
        db
          .select({ count: sql<number>`count(*)` })
          .from(products)
          .where(whereClause),
      ]);

      const total = Number(countResult[0]?.count ?? 0);

      return {
        products: results,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(products)
        .where(eq(products.slug, input.slug))
        .limit(1);
      return result[0] ?? null;
    }),

  getFeatured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .orderBy(desc(products.createdAt));
  }),

  getRelated: publicQuery
    .input(
      z.object({
        productId: z.number(),
        category: z.string(),
        limit: z.number().default(3),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(products)
        .where(
          and(
            eq(products.category, input.category as any),
            sql`${products.id} != ${input.productId}`
          )
        )
        .limit(input.limit);
    }),
});
