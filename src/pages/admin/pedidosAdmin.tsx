import { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { getAllPedidos } from '../../services/pedido_service';
import type { Pedido } from '../../models/pedido';

const PedidosAdmin = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [filtroEstado, setFiltroEstado] = useState<'todos' | 'completado' | 'pendiente' | 'cancelado'>('todos');

    useEffect(() => {
        const cargarPedidos = async () => {
            try {
                const data = await getAllPedidos();
                setPedidos(data);
            } catch (error: any) {
                console.error("Error cargando pedidos:", error);
                setError(error.message || "Error desconocido al cargar pedidos");
            } finally {
                setLoading(false);
            }
        };
        cargarPedidos();
    }, []);

    const toggleRow = (id: number) => {
        if (expandedRow === id) {
            setExpandedRow(null);
        } else {
            setExpandedRow(id);
        }
    };

    // Filtrar pedidos por estado
    const pedidosFiltrados = filtroEstado === 'todos'
        ? pedidos
        : pedidos.filter(p => p.estado.toLowerCase() === filtroEstado);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'completado': return 'bg-[#009951]/10 text-[#009951] border-[#009951]/20';
            case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-gray-900 uppercase border-b-4 border-[#009951] pb-2 inline-block">
                        Gestión de Pedidos
                    </h1>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                        <span className="text-gray-500 font-medium">Total Pedidos: </span>
                        <span className="text-[#009951] font-bold text-xl">{pedidos.length}</span>
                    </div>
                </div>

                {/* Filtros por estado */}
                <div className="mb-6 flex gap-3 flex-wrap">
                    <button
                        className={`px-4 py-2 rounded-full font-bold border transition-colors ${filtroEstado === 'todos' ? 'bg-[#009951] text-[#FED800] border-[#009951]' : 'bg-white text-[#009951] border-[#009951] hover:bg-[#009951]/10'}`}
                        onClick={() => setFiltroEstado('todos')}
                    >Todos</button>
                    <button
                        className={`px-4 py-2 rounded-full font-bold border transition-colors ${filtroEstado === 'completado' ? 'bg-[#009951] text-[#FED800] border-[#009951]' : 'bg-white text-[#009951] border-[#009951] hover:bg-[#009951]/10'}`}
                        onClick={() => setFiltroEstado('completado')}
                    >Entregado</button>
                    <button
                        className={`px-4 py-2 rounded-full font-bold border transition-colors ${filtroEstado === 'pendiente' ? 'bg-[#009951] text-[#FED800] border-[#009951]' : 'bg-white text-[#009951] border-[#009951] hover:bg-[#009951]/10'}`}
                        onClick={() => setFiltroEstado('pendiente')}
                    >Pendiente</button>
                    <button
                        className={`px-4 py-2 rounded-full font-bold border transition-colors ${filtroEstado === 'cancelado' ? 'bg-[#009951] text-[#FED800] border-[#009951]' : 'bg-white text-[#009951] border-[#009951] hover:bg-[#009951]/10'}`}
                        onClick={() => setFiltroEstado('cancelado')}
                    >Cancelado</button>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009951] mx-auto mb-4"></div>
                            <p className="text-gray-500">Cargando pedidos...</p>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center">
                            <div className="text-red-500 text-5xl mb-4">⚠️</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Error al cargar pedidos</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <p className="text-sm text-gray-500">
                                Posibles causas: <br/>
                                1. La tabla 'pedido' no existe o tiene otro nombre.<br/>
                                2. No tienes permisos para ver los pedidos (RLS).<br/>
                                3. La columna 'fechapedido' no existe.
                            </p>
                        </div>
                    ) : pedidosFiltrados.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <p className="text-xl mb-2">📭</p>
                            <p>No hay pedidos registrados.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pedidosFiltrados.map((pedido) => (
                                <div key={pedido.pedidoid} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                    {/* Card Header */}
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                        <span className="font-bold text-gray-700">#{pedido.pedidoid}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(pedido.estado)}`}>
                                            {pedido.estado.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        {/* Cliente Info */}
                                        <div className="mb-4 pb-4 border-b border-gray-100">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cliente</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-[#009951]/10 flex items-center justify-center text-[#009951] font-bold text-xs">
                                                    {pedido.usuario?.nombre?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{pedido.usuario?.nombre || 'Anónimo'}</p>
                                                    <p className="text-xs text-gray-500">{pedido.usuario_id ? pedido.usuario_id : 'Sin email'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Fecha</p>
                                                <p className="text-gray-700 font-medium">{formatDate(pedido.fechapedido)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
                                                <p className="text-2xl font-black text-gray-900">S/ {Number(pedido.montototal).toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => toggleRow(pedido.pedidoid)}
                                            className="w-full mt-2 flex items-center justify-center gap-2 text-sm font-bold text-[#FED800] bg-[#009951] hover:opacity-90 py-2 rounded-lg transition-colors"
                                        >
                                            {expandedRow === pedido.pedidoid ? 'Ocultar Detalles' : 'Ver Detalles'}
                                            <span className="text-xs">{expandedRow === pedido.pedidoid ? '▲' : '▼'}</span>
                                        </button>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedRow === pedido.pedidoid && (
                                        <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-4 animate-fadeIn">
                                            {/* Info Pago */}
                                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Pago</h4>
                                                {pedido.pago ? (
                                                    <div className="text-sm space-y-1">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Estado:</span>
                                                            <span className={`font-bold ${pedido.pago.mp_status === 'approved' ? 'text-[#009951]' : 'text-yellow-600'}`}>
                                                                {pedido.pago.mp_status?.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">ID:</span>
                                                            <span className="font-mono text-gray-700 text-xs">{pedido.pago.mp_paymentid}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-400 italic text-xs">Sin pago registrado</p>
                                                )}
                                            </div>

                                            {/* Productos */}
                                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Productos ({pedido.detalles?.length || 0})</h4>
                                                <div className="space-y-3">
                                                    {pedido.detalles?.map((detalle) => (
                                                        <div key={detalle.detalleid} className="flex items-center gap-3 text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                                            {detalle.producto_imagen && (
                                                                <img 
                                                                    src={`/img/${detalle.producto_imagen}`} 
                                                                    alt="" 
                                                                    className="w-10 h-10 rounded object-cover bg-gray-100 flex-shrink-0"
                                                                />
                                                            )}
                                                            <div className="flex-grow min-w-0">
                                                                <p className="font-medium text-gray-800 truncate">{detalle.producto_nombre}</p>
                                                                <p className="text-gray-500 text-xs">{detalle.cantidad} x S/ {Number(detalle.preciounitario).toFixed(2)}</p>
                                                            </div>
                                                            <div className="font-bold text-gray-700">
                                                                S/ {(Number(detalle.cantidad) * Number(detalle.preciounitario)).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PedidosAdmin;
