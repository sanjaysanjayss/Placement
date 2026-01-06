import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Training from "./pages/Training";
import Drives from "./pages/Drives";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import UserList from "./pages/UserList";
import UserDetails from "./pages/UserDetails";
import StudentProfile from "./pages/StudentProfile";
import TrainingSchedule from "./pages/TrainingSchedule";
import CompanyDrives from "./pages/CompanyDrives";
import EligibilityCheck from "./pages/EligibilityCheck";
import PerformanceAnalytics from "./pages/PerformanceAnalytics";
import Notifications from "./pages/Notifications";
import ResumeBuilder from "./pages/ResumeBuilder";
import AdminDashboard from "./pages/AdminDashboard";
import MockTests from "./pages/MockTests";
import ContactUs from "./pages/ContactUs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/training" element={<Training />} />
          <Route path="/drives" element={<Drives />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/profile/:id" element={<StudentProfile />} />
          <Route path="/training-schedule" element={<TrainingSchedule />} />
          <Route path="/company-drives" element={<CompanyDrives />} />
          <Route path="/eligibility-check" element={<EligibilityCheck />} />
          <Route path="/performance-analytics" element={<PerformanceAnalytics />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/mock-tests" element={<MockTests />} />
          <Route path="/contact" element={<ContactUs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
