import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./pages/AdminUsers";
import MapGenerator from "./pages/MapGenerator";
import MapasEmpresariais from "./pages/MapasEmpresariais";
import HarmoniaConjugal from "./pages/HarmoniaConjugal";
import MapasInfantis from "./pages/MapasInfantis";
import Clientes from "./pages/Clientes";
import Relatorios from "./pages/Relatorios";
import PlanilhaEquivalencia from "./pages/PlanilhaEquivalencia";
import TabelaConversao from "./pages/TabelaConversao";
import TabelaProfissoes from "./pages/TabelaProfissoes";
import Analises from "./pages/Analises";
import AnaliseTelefone from "./pages/AnaliseTelefone";
import AnaliseEndereco from "./pages/AnaliseEndereco";
import AnalisePlaca from "./pages/AnalisePlaca";
import CorrecaoAssinatura from "./pages/CorrecaoAssinatura";
import Ajustes from "./pages/Ajustes";
import Ajuda from "./pages/Ajuda";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                </Route>
                <Route
                  path="/mapas"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<MapGenerator />} />
                </Route>
                <Route
                  path="/mapas-empresariais"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<MapasEmpresariais />} />
                </Route>
                <Route
                  path="/harmonia-conjugal"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<HarmoniaConjugal />} />
                </Route>
                <Route
                  path="/mapas-infantis"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<MapasInfantis />} />
                </Route>
                <Route
                  path="/clientes"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Clientes />} />
                </Route>
                <Route
                  path="/relatorios"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Relatorios />} />
                </Route>
                <Route
                  path="/planilha-equivalencia"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<PlanilhaEquivalencia />} />
                </Route>
                <Route
                  path="/tabela-conversao"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<TabelaConversao />} />
                </Route>
                <Route
                  path="/tabela-profissoes"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<TabelaProfissoes />} />
                </Route>
                <Route
                  path="/analises"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Analises />} />
                </Route>
                <Route
                  path="/analises/telefone"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AnaliseTelefone />} />
                </Route>
                <Route
                  path="/analises/endereco"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AnaliseEndereco />} />
                </Route>
                <Route
                  path="/analises/placa"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AnalisePlaca />} />
                </Route>
                <Route
                  path="/analises/assinatura"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<CorrecaoAssinatura />} />
                </Route>
                <Route
                  path="/ajustes"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Ajustes />} />
                </Route>
                <Route
                  path="/ajuda"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Ajuda />} />
                </Route>
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminUsers />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;