import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Faq from "./pages/Faq";
import Home from "./pages/Home";
import Layout from "./pages/app/Layout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Manage from "./pages/app/Manage";
import ManageOperator from "./pages/app/ManageOperator";
import ManageUser from "./pages/app/ManageUser";
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";
import Onboarding from "./pages/Onboarding";
import { HelmetProvider } from "react-helmet-async";
import Orders from "./pages/app/orders/Orders";
import History from "./pages/app/history/History";
import Products from "./pages/app/products/Products";
import Customers from "./pages/app/customers/Customers";
import NewProduct from "./pages/app/products/NewProduct";
import NewHistory from "./pages/app/history/NewHistory";
import NewCustomer from "./pages/app/customers/NewCustomer";
import EditCustomer from "./pages/app/customers/EditCustomer";
import EditHistory from "./pages/app/history/EditHistory";
import EditProduct from "./pages/app/products/EditProduct";
import Storefront from "./pages/Storefront";
import StoreItem from "./pages/StoreItem";
import StoreLayout from "./pages/StoreLayout";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutModal from "./components/CheckoutModal";
import OrderStatus from "./pages/OrderStatus";
import OrderStatusDetail from "./pages/OrderStatusDetail";
import EditOrder from "./pages/app/orders/EditOrder";
import MobileModal from "./components/MobileModal";
import AdminLayout from "./pages/app/AdminLayout";
import OperatorLayout from "./pages/app/OperatorLayout";
import User from "./pages/app/user/User";
import Account from "./pages/app/user/Account";
import NewUser from "./pages/app/user/NewUser";
import EditUser from "./pages/app/user/EditUser";
import EditRole from "./pages/app/user/EditRole";
import EditEmail from "./pages/app/user/EditEmail";
import NewTransaction from "./pages/app/transactions/NewTransaction";
import EditTransaction from "./pages/app/transactions/EditTransaction";
import Transactions from "./pages/app/transactions/Transactions";
import Auctions from "./pages/app/auctions/Auctions";
import EditAuction from "./pages/app/auctions/EditAuction";
import NewAuction from "./pages/app/auctions/NewAuction";
import ViewTransaction from "./pages/app/transactions/ViewTransaction";
import ManageAdmin from "./pages/app/ManageAdmin";
import FeedFront from "./pages/FeedFront";
import FeedLayout from "./pages/FeedLayout";
import FeedItem from "./pages/FeedItem";

function App() {
  return (
    <HelmetProvider>
      <RecoilRoot>
        <ToastContainer />
        <BrowserRouter>
          <CheckoutModal />
          <MobileModal />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="feed"> */}
            <Route path="feed" element={<FeedLayout />}>
              <Route index element={<FeedFront />} />
              <Route path=":productId" element={<FeedItem />} />
            </Route>
            <Route path="faq" element={<Faq />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-status" element={<OrderStatus />} />
            <Route
              path="order-status/:orderId"
              element={<OrderStatusDetail />}
            />
            <Route path=":storeName" element={<StoreLayout />}>
              <Route index element={<Storefront />} />
              <Route path=":productId" element={<StoreItem />} />
            </Route>
            <Route path="app" element={<Layout />}>
              <Route index element={<ManageUser />} />
              <Route path="home" element={<ManageUser />} />
              <Route path="auctions" element={<Auctions />} />
              <Route path="auctions/new" element={<NewAuction />} />
              <Route path="auctions/:id" element={<EditAuction />} />
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<NewProduct />} />
              <Route path="products/:id" element={<EditProduct />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="transactions/:id" element={<ViewTransaction />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<EditOrder />} />
              <Route path="history" element={<History />} />
              <Route path="history/new" element={<NewHistory />} />
              <Route path="history/:id" element={<EditHistory />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/new" element={<NewCustomer />} />
              <Route path="customers/:id" element={<EditCustomer />} />
              <Route path="settings" element={<Account />} />
            </Route>
            <Route path="operator" element={<OperatorLayout />}>
              <Route index element={<ManageOperator />} />
              <Route path="home" element={<ManageOperator />} />
              <Route path="auctions" element={<Auctions />} />
              <Route path="auctions/new" element={<NewAuction />} />
              <Route path="auctions/:id" element={<EditAuction />} />
            </Route>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<ManageAdmin />} />
              <Route path="home" element={<ManageAdmin />} />
              <Route path="auctions" element={<Auctions />} />
              <Route path="auctions/new" element={<NewAuction />} />
              <Route path="auctions/:id" element={<EditAuction />} />
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<NewProduct />} />
              <Route path="products/:id" element={<EditProduct />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="transactions/new" element={<NewTransaction />} />
              <Route path="transactions/:id" element={<EditTransaction />} />
              <Route path="history" element={<History />} />
              <Route path="history/new" element={<NewHistory />} />
              <Route path="history/:id" element={<EditHistory />} />
              <Route path="users" element={<User />} />
              <Route path="users/new" element={<NewUser />} />
              <Route path="users/:id" element={<EditUser />} />
              <Route path="users-role/:id" element={<EditRole />} />
              <Route path="users-email/:id" element={<EditEmail />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </HelmetProvider>
  );
}

export default App;
