import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

// Pages
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Learn from "./pages/Learn";
import Tools from "./pages/Tools";
import ToolDetail from "./pages/ToolDetail";
import Ebooks from "./pages/Ebooks";
import EbookDetail from "./pages/EbookDetail";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
            <Route path="pricing" element={<Pricing />} />
            <Route path="about" element={<About />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          
          {/* Auth pages without layout */}
          <Route path="auth/signin" element={<SignIn />} />
          <Route path="auth/signup" element={<SignUp />} />
          
          {/* Learning pages without main layout */}
          <Route path="learn/:courseSlug/:lessonSlug" element={<Learn />} />
          
          {/* Catch all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;