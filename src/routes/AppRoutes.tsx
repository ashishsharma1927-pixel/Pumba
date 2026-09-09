import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { PageLoader } from '../components/PageLoader';

const Home = lazy(() => import('../pages/Home').then((m) => ({ default: m.Home })));
const Shop = lazy(() => import('../pages/Shop').then((m) => ({ default: m.Shop })));
const ProductDetails = lazy(() =>
  import('../pages/ProductDetails').then((m) => ({ default: m.ProductDetails }))
);
const Cart = lazy(() => import('../pages/Cart').then((m) => ({ default: m.Cart })));
const Wishlist = lazy(() => import('../pages/Wishlist').then((m) => ({ default: m.Wishlist })));
const Checkout = lazy(() => import('../pages/Checkout').then((m) => ({ default: m.Checkout })));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
