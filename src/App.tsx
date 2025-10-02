import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Learn from "./pages/Learn";
import Tools from "./pages/Tools";
import ToolDetail from "./pages/ToolDetail";
import Ebooks from "./pages/Ebooks";
import EbookDetail from "./pages/EbookDetail";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import MyCourses from "./pages/MyCourses";
import MyTools from "./pages/MyTools";
import MyEbooks from "./pages/MyEbooks";
import MyCertificates from "./pages/MyCertificates";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminLessons from "./pages/admin/AdminLessons";
import AdminLessonsOverview from "./pages/admin/AdminLessonsOverview";
import AdminTools from "./pages/admin/AdminTools";
import AdminEbooks from "./pages/admin/AdminEbooks";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPaymentMethods from "./pages/admin/AdminPaymentMethods";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReports from "./pages/admin/AdminReports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:slug" element={<CourseDetail />} />
              <Route path="tools" element={<Tools />} />
              <Route path="tools/:slug" element={<ToolDetail />} />
              <Route path="ebooks" element={<Ebooks />} />
              <Route path="ebooks/:slug" element={<EbookDetail />} />
              <Route path="about" element={<About />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="cart" element={<Cart />} />
            </Route>
            
            {/* Auth pages without layout */}
            <Route path="auth/signin" element={<SignIn />} />
            <Route path="auth/signup" element={<SignUp />} />
            
            {/* Protected Routes */}
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="my-courses" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <MyCourses />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="my-tools" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <MyTools />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="my-ebooks" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <MyEbooks />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="my-certificates" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <MyCertificates />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes - without nested Layout */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/courses" element={<AdminCourses />} />
            <Route path="admin/lessons" element={<AdminLessonsOverview />} />
            <Route path="admin/courses/:courseId/lessons" element={<AdminLessons />} />
            <Route path="admin/tools" element={<AdminTools />} />
            <Route path="admin/ebooks" element={<AdminEbooks />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/payment-methods" element={<AdminPaymentMethods />} />
            <Route path="admin/orders" element={<AdminOrders />} />
            <Route path="admin/reports" element={<AdminReports />} />
            
            {/* Learning pages without main layout */}
            <Route path="learn/:courseSlug/:lessonSlug" element={<Learn />} />
            
            {/* Catch all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;