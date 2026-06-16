import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Product from "./pages/Product.tsx";
import UseCases from "./pages/UseCases.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Demos from "./pages/Demos.tsx";
import Physics from "./pages/Physics.tsx";
import Models from "./pages/Models.tsx";
import Press from "./pages/Press.tsx";
import SeeItInAction from "./pages/SeeItInAction.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/sim2real-v2">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product" element={<Product />} />
          <Route path="/use-cases" element={<UseCases />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="/physics" element={<Physics />} />
          <Route path="/models" element={<Models />} />
          <Route path="/press" element={<Press />} />
          <Route path="/see-it-in-action" element={<SeeItInAction />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
