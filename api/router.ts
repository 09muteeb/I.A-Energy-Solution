import { createRouter } from "./middleware.js";
import { authRouter } from "./auth-router.js";
import { productRouter } from "./routers/product.js";
import { cartRouter } from "./routers/cart.js";
import { orderRouter } from "./routers/order.js";
import { contactRouter } from "./routers/contact.js";

export const appRouter = createRouter({
  auth: authRouter,
  product: productRouter,
  cart: cartRouter,
  order: orderRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;

