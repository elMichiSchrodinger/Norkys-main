import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { getAllPedidos } from '../../services/pedido_service';
import { getAllProductos, getProductosByCategoria } from '../../services/producto_service';
import type { Pedido } from '../../models/pedido';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        pedidosPendientes: 0,
        totalProductos: 0,
        promocionesActivas: 0,
        ingresosTotales: 0,
        ultimosPedidos: [] as Pedido[]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pedidos, productos, promociones] = await Promise.all([
                    getAllPedidos(),
                    getAllProductos(false),
                    getProductosByCategoria('Promoción', true)
                ]);

                const pedidosValidos = pedidos.filter(p => p.estado !== 'cancelado');
                const ingresos = pedidosValidos.reduce((acc, p) => acc + Number(p.montototal), 0);

                setStats({
                    pedidosPendientes: pedidos.filter(p => p.estado === 'pendiente').length,
                    totalProductos: productos.length,
                    promocionesActivas: promociones.length,
                    ingresosTotales: ingresos,
                    ultimosPedidos: pedidos.slice(0, 5)
                });
            } catch (error) {
                console.error("Error cargando dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const modules = [
        {
            title: "Gestión de Pedidos",
            description: "Revisa, actualiza y gestiona el estado de los pedidos entrantes.",
            icon: "🛍️",
            link: "/admin/pedidos",
            color: "bg-blue-50 text-blue-600 border-blue-100",
            stat: `${stats.pedidosPendientes} Pendientes`
        },
        {
            title: "Catálogo de Productos",
            description: "Agrega nuevos platos, edita precios o desactiva productos agotados.",
            icon: "🍗",
            link: "/admin/productos",
            color: "bg-orange-50 text-orange-600 border-orange-100",
            stat: `${stats.totalProductos} Productos`
        },
        {
            title: "Promociones",
            description: "Administra las ofertas especiales y campañas de marketing.",
            icon: "🏷️",
            link: "/admin/promociones",
            color: "bg-red-50 text-red-600 border-red-100",
            stat: `${stats.promocionesActivas} Activas`
        },
        {
            title: "Estadísticas",
            description: "Visualiza el rendimiento de ventas y productos más populares.",
            icon: "📊",
            link: "/admin/estadisticas",
            color: "bg-purple-50 text-purple-600 border-purple-100",
            stat: "Ver Reportes"
        }
    ];

    const getStatusColor = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'pendiente': return 'bg-yellow-100 text-yellow-800';
            case 'completado': return 'bg-green-100 text-green-800';
            case 'cancelado': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">
                        Panel de Administración
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Resumen general de la actividad de tu negocio.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Módulos Principales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {modules.map((module, index) => (
                                <Link 
                                    key={index} 
                                    to={module.link}
                                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
                                >
                                    <div className={`p-6 flex items-center justify-between border-b ${module.color.split(' ')[2]}`}>
                                        <span className="text-3xl">{module.icon}</span>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${module.color}`}>
                                            {module.stat}
                                        </span>
                                    </div>
                                    <div className="p-6 flex-grow">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                                            {module.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            {module.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Últimos Pedidos */}
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-800 text-lg">Últimos Pedidos</h3>
                                    <Link to="/admin/pedidos" className="text-sm text-green-600 font-bold hover:underline">Ver todos</Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-500 font-medium">
                                            <tr>
                                                <th className="px-6 py-3">ID</th>
                                                <th className="px-6 py-3">Fecha</th>
                                                <th className="px-6 py-3">Total</th>
                                                <th className="px-6 py-3">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {stats.ultimosPedidos.map((pedido) => (
                                                <tr key={pedido.pedidoid} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-900">#{pedido.pedidoid}</td>
                                                    <td className="px-6 py-4 text-gray-600">{formatDate(pedido.fechapedido)}</td>
                                                    <td className="px-6 py-4 font-medium">S/ {Number(pedido.montototal).toFixed(2)}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(pedido.estado)}`}>
                                                            {pedido.estado.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {stats.ultimosPedidos.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No hay pedidos recientes.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Resumen Financiero */}
                            <div className="space-y-6">
                                {/* Tarjeta de Ingresos */}
                                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg p-6 text-white">
                                    <p className="text-green-100 text-sm font-medium mb-1 uppercase tracking-wider">Ingresos Totales</p>
                                    <h3 className="text-3xl font-black mb-4">S/ {stats.ingresosTotales.toFixed(2)}</h3>
                                    <div className="h-1 w-full bg-green-500 rounded-full overflow-hidden">
                                        <div className="h-full bg-white opacity-30 w-2/3"></div>
                                    </div>
                                    <p className="text-xs text-green-100 mt-3 opacity-80">Calculado en base a pedidos no cancelados.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
