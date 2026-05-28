import { authRouter } from "./auth-router";
import { productRouter } from "./routers/product";
import { cartRouter } from "./routers/cart";
import { orderRouter } from "./routers/order";
import { contactRouter } from "./routers/contact";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  product: productRouter,
  cart: cartRouter,
  order: orderRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
