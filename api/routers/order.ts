import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { orders, orderItems, cartItems } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const orderRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number(),
            price: z.number(),
          })
        ),
        total: z.number(),
        subtotal: z.number(),
        shipping: z.number(),
        paymentMethod: z.enum(["cod", "bank_transfer"]),
        fullName: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(10),
        address: z.string().min(5),
        city: z.string().min(1),
        province: z.string().min(1),
        postalCode: z.string().optional(),
        notes: z.string().optional(),
        userId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // FIX: PostgreSQL uses .returning() to get inserted ID
      const orderResult = await db.insert(orders).values({
        userId: input.userId ?? null,
        total: String(input.total.toFixed(2)),
        subtotal: String(input.subtotal.toFixed(2)),
        shipping: String(input.shipping.toFixed(2)),
        paymentMethod: input.paymentMethod,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        address: input.address,
        city: input.city,
        province: input.province,
        postalCode: input.postalCode ?? null,
        notes: input.notes ?? null,
      }).returning({ id: orders.id });

      const orderId = orderResult[0].id;

      for (const item of input.items) {
        await db.insert(orderItems).values({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: String(item.price.toFixed(2)),
          total: String((item.price * item.quantity).toFixed(2)),
        });
      }

      // Clear cart if user is logged in
      if (input.userId) {
        await db.delete(cartItems).where(eq(cartItems.userId, input.userId));
      }

      return { orderId, success: true };
    }),

  getById: publicQuery
    .input(z.object({ orderId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();

      const orderResult = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.orderId))
        .limit(1);

      if (orderResult.length === 0) return null;

      const itemsResult = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, input.orderId));

      return {
        ...orderResult[0],
        items: itemsResult,
      };
    }),

  getMyOrders: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    return db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }),
});