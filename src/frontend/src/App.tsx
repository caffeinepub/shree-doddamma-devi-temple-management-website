import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/public/HomePage';
import DonationsPage from './pages/public/DonationsPage';
import PaymentConfirmationPage from './pages/public/PaymentConfirmationPage';
import TotalCollectionPage from './pages/public/TotalCollectionPage';
import CommitteePage from './pages/public/CommitteePage';
import JatreFestivalsPage from './pages/public/JatreFestivalsPage';
import GalleryPage from './pages/public/GalleryPage';
import ContactsPage from './pages/public/ContactsPage';
import LocationPage from './pages/public/LocationPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminHomePage from './pages/admin/AdminHomePage';
import BalanceDashboardPage from './pages/admin/BalanceDashboardPage';
import PaymentApprovalsPage from './pages/admin/PaymentApprovalsPage';
import DonorListPage from './pages/admin/DonorListPage';
import CommitteeManagementPage from './pages/admin/CommitteeManagementPage';
import JatreManagementPage from './pages/admin/JatreManagementPage';
import ContactsManagementPage from './pages/admin/ContactsManagementPage';
import GalleryManagementPage from './pages/admin/GalleryManagementPage';
import ReceiptViewPage from './pages/admin/ReceiptViewPage';
import AdminRoute from './components/auth/AdminRoute';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: () => (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: HomePage,
});

const donationsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/donations',
  component: DonationsPage,
});

const paymentConfirmationRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/payment-confirmation',
  component: PaymentConfirmationPage,
});

const totalCollectionRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/total-collection',
  component: TotalCollectionPage,
});

const committeeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/committee',
  component: CommitteePage,
});

const jatreRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/jatre',
  component: JatreFestivalsPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/gallery',
  component: GalleryPage,
});

const contactsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/contacts',
  component: ContactsPage,
});

const locationRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/location',
  component: LocationPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLoginPage,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminRoute>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AdminRoute>
  ),
});

const adminHomeRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/',
  component: AdminHomePage,
});

const balanceDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/balance',
  component: BalanceDashboardPage,
});

const paymentApprovalsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/approvals',
  component: PaymentApprovalsPage,
});

const donorListRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/donors',
  component: DonorListPage,
});

const committeeManagementRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/committee',
  component: CommitteeManagementPage,
});

const jatreManagementRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/jatre',
  component: JatreManagementPage,
});

const contactsManagementRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/contacts',
  component: ContactsManagementPage,
});

const galleryManagementRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/gallery',
  component: GalleryManagementPage,
});

const receiptViewRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/receipts/$receiptNumber',
  component: ReceiptViewPage,
});

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    homeRoute,
    donationsRoute,
    paymentConfirmationRoute,
    totalCollectionRoute,
    committeeRoute,
    jatreRoute,
    galleryRoute,
    contactsRoute,
    locationRoute,
  ]),
  adminLoginRoute,
  adminLayoutRoute.addChildren([
    adminHomeRoute,
    balanceDashboardRoute,
    paymentApprovalsRoute,
    donorListRoute,
    committeeManagementRoute,
    jatreManagementRoute,
    contactsManagementRoute,
    galleryManagementRoute,
    receiptViewRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
