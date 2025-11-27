import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Importamos las páginas (Asegúrate de que coincidan con los nombres de archivo reales)
import Home from './pages/home';
import Productos from './pages/productos';
import Busqueda from './pages/busqueda';
import ProductDetail from './pages/productDetail';
import Login from './pages/login';
import Registro from './pages/registro';
import CompletarPerfil from './pages/completarPerfil';
import CarritoPage from './pages/carritoPage';
import AdminDashboard from './pages/admin/dashboard';
import ProductoAdmin from './pages/admin/productoAdmin';
import PromocionesAdmin from './pages/admin/promocionesAdmin';
import PedidosAdmin from './pages/admin/pedidosAdmin';
import EstadisticasAdmin from './pages/admin/estadisticasAdmin';
import PerfilAdmin from './pages/admin/perfilAdmin';
import ProductForm from './pages/admin/productoForm';
import AdminRoute from './components/AdminRoute';

// localStorage.clear()

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Productos />} />
            <Route path="/busqueda/:query" element={<Busqueda />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            
            {/* Nueva ruta del carrito */}
            <Route path="/carrito" element={<CarritoPage />} />

            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/completar-perfil" element={<CompletarPerfil />} />

            {/* Rutas de Administrador */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/productos" element={<ProductoAdmin />} />
              <Route path="/admin/promociones" element={<PromocionesAdmin />} />
              <Route path="/admin/pedidos" element={<PedidosAdmin />} />
              <Route path="/admin/estadisticas" element={<EstadisticasAdmin />} />
              <Route path="/admin/perfil" element={<PerfilAdmin />} />
              
              {/* Rutas de Gestión de Productos */}
              <Route path="/admin/producto/nuevo" element={<ProductForm />} />
              <Route path="/admin/producto/editar/:id" element={<ProductForm />} />
            </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
export default App;