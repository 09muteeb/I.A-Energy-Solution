import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { cartItems, products } from "@db/schema";
import { eq, and, sql } from "drizzle-orm";

export const cartRouter = createRouter({
  get: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    const items = await db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
        productId: cartItems.productId,
        productName: products.name,
        productSlug: products.slug,
        productImage: products.image,
        productPrice: products.price,
        productStock: products.stock,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));

    const total = items.reduce(
      (sum, item) =>
        sum + Number(item.productPrice) * item.quantity,
      0
    );

    return { items, total };
  }),

  add: authedQuery
    .input(
      z.object({
        productId: z.number(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const existing = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.userId, userId),
            eq(cartItems.productId, input.productId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        const newQty = existing[0].quantity + input.quantity;
        await db
          .update(cartItems)
          .set({ quantity: newQty })
          .where(eq(cartItems.id, existing[0].id));
        return { ...existing[0], quantity: newQty };
      }

      // FIX: PostgreSQL uses .returning() to get inserted ID
      const result = await db.insert(cartItems).values({
        userId,
        productId: input.productId,
        quantity: input.quantity,
      }).returning({ id: cartItems.id });

      return {
        id: result[0].id,
        userId,
        productId: input.productId,
        quantity: input.quantity,
      };
    }),

  update: authedQuery
    .input(
      z.object({
        cartItemId: z.number(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      await db
        .update(cartItems)
        .set({ quantity: input.quantity })
        .where(
          and(
            eq(cartItems.id, input.cartItemId),
            eq(cartItems.userId, userId)
          )
        );

      return { id: input.cartItemId, quantity: input.quantity };
    }),

  remove: authedQuery
    .input(z.object({ cartItemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      await db
        .delete(cartItems)
        .where(
          and(
            eq(cartItems.id, input.cartItemId),
            eq(cartItems.userId, userId)
          )
        );

      return { success: true };
    }),

  clear: authedQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    await db.delete(cartItems).where(eq(cartItems.userId, userId));

    return { success: true };
  }),

  getCount: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    const result = await db
      .select({ count: sql<number>`COALESCE(SUM(${cartItems.quantity}), 0)` })
      .from(cartItems)
      .where(eq(cartItems.userId, userId));

    return { count: Number(result[0]?.count ?? 0) };
  }),
});