import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RecoilRoot } from "recoil";
import MobileModal from "./components/MobileModal";
import AdminLayout from "./pages/app/AdminLayout";
import Auctions from "./pages/app/auctions/Auctions";
import EditAuction from "./pages/app/auctions/EditAuction";
import NewAuction from "./pages/app/auctions/NewAuction";
import EditHistory from "./pages/app/history/EditHistory";
import History from "./pages/app/history/History";
import NewHistory from "./pages/app/history/NewHistory";
import Layout from "./pages/app/Layout";
import ManageAdmin from "./pages/app/ManageAdmin";
import ManageOperator from "./pages/app/ManageOperator";
import ManageUser from "./pages/app/ManageUser";
import OperatorLayout from "./pages/app/OperatorLayout";
import EditProduct from "./pages/app/products/EditProduct";
import NewProduct from "./pages/app/products/NewProduct";
import Products from "./pages/app/products/Products";
import EditTransaction from "./pages/app/transactions/EditTransaction";
import NewTransaction from "./pages/app/transactions/NewTransaction";
import Transactions from "./pages/app/transactions/Transactions";
import ViewTransaction from "./pages/app/transactions/ViewTransaction";
import Account from "./pages/app/user/Account";
import EditEmail from "./pages/app/user/EditEmail";
import EditRole from "./pages/app/user/EditRole";
import EditUser from "./pages/app/user/EditUser";
import NewUser from "./pages/app/user/NewUser";
import User from "./pages/app/user/User";
import Faq from "./pages/Faq";
import FeedFront from "./pages/FeedFront";
import FeedItem from "./pages/FeedItem";
import FeedLayout from "./pages/FeedLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";

function App() {
  return (
    <HelmetProvider>
      <RecoilRoot>
        <ToastContainer />
        <BrowserRouter>
          <MobileModal />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="feed" element={<FeedLayout />}>
              <Route index element={<FeedFront />} />
              <Route path=":productId" element={<FeedItem />} />
            </Route>
            <Route path="faq" element={<Faq />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
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
