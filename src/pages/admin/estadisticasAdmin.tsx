import { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { getAllPedidos } from '../../services/pedido_service';

const EstadisticasAdmin = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalIngresos: 0,
        totalPedidos: 0,
        ticketPromedio: 0,
        totalProductosVendidos: 0,
        pedidosPorEstado: { pendiente: 0, completado: 0, cancelado: 0 },
        topProductos: [] as { nombre: string; cantidad: number; imagen?: string; total: number }[],
        topClientes: [] as { nombre: string; email: string; totalGastado: number; pedidosCount: number }[],
        ventasPorHora: new Array(24).fill(0),
        ingresosPorDia: [] as { fecha: string; total: number }[]
    });

    useEffect(() => {
        const calcularEstadisticas = async () => {
            try {
                const pedidos = await getAllPedidos();
                
                // 1. KPIs Generales
                const pedidosValidos = pedidos.filter(p => p.estado !== 'cancelado');
                const totalIngresos = pedidosValidos.reduce((acc, p) => acc + Number(p.montototal), 0);
                const totalPedidos = pedidos.length;
                const ticketPromedio = totalPedidos > 0 ? totalIngresos / pedidosValidos.length : 0;

                // 2. Productos Vendidos y Top Productos
                const productoMap = new Map<string, { nombre: string; cantidad: number; imagen?: string; total: number }>();
                let totalProductos = 0;

                // 2.1 Top Clientes
                const clienteMap = new Map<string, { nombre: string; email: string; totalGastado: number; pedidosCount: number }>();

                // 3. Ventas por Hora
                const ventasHora = new Array(24).fill(0);

                // 4. Ingresos por Día (Últimos 7 días)
                const ingresosDiaMap = new Map<string, number>();
                const hoy = new Date();
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(hoy.getDate() - i);
                    ingresosDiaMap.set(d.toLocaleDateString('es-PE'), 0);
                }

                pedidos.forEach(p => {
                    // Procesar Productos y Clientes (Solo pedidos válidos)
                    if (p.estado !== 'cancelado') {
                        // Clientes
                        const clienteId = p.usuario_id || 'anonimo';
                        const clienteNombre = p.usuario?.nombre || 'Cliente Anónimo';
                        const clienteEmail = p.usuario?.email || '-';
                        const monto = Number(p.montototal);

                        if (clienteMap.has(clienteId)) {
                            const c = clienteMap.get(clienteId)!;
                            c.totalGastado += monto;
                            c.pedidosCount += 1;
                        } else {
                            clienteMap.set(clienteId, {
                                nombre: clienteNombre,
                                email: clienteEmail,
                                totalGastado: monto,
                                pedidosCount: 1
                            });
                        }

                        p.detalles?.forEach(d => {
                            const cantidad = Number(d.cantidad);
                            const subtotal = cantidad * Number(d.preciounitario);
                            totalProductos += cantidad;

                            const key = d.producto_nombre || 'Producto Desconocido';
                            if (productoMap.has(key)) {
                                const current = productoMap.get(key)!;
                                current.cantidad += cantidad;
                                current.total += subtotal;
                            } else {
                                productoMap.set(key, {
                                    nombre: key,
                                    cantidad: cantidad,
                                    imagen: d.producto_imagen,
                                    total: subtotal
                                });
                            }
                        });

                        // Procesar Ventas por Hora
                        if (p.fechapedido) {
                            const fecha = new Date(p.fechapedido);
                            const hora = fecha.getHours();
                            ventasHora[hora] += Number(p.montototal);

                            // Procesar Ingresos por Día
                            const fechaStr = fecha.toLocaleDateString('es-PE');
                            if (ingresosDiaMap.has(fechaStr)) {
                                ingresosDiaMap.set(fechaStr, ingresosDiaMap.get(fechaStr)! + Number(p.montototal));
                            }
                        }
                    }

                    // Distribución por Estado (incluye cancelados)
                    const estado = p.estado.toLowerCase() as keyof typeof stats.pedidosPorEstado;
                    if (stats.pedidosPorEstado.hasOwnProperty(estado)) {
                        // Nota: No actualizamos el estado aquí directamente, lo haremos al final
                    }
                });

                const topProductos = Array.from(productoMap.values())
                    .sort((a, b) => b.cantidad - a.cantidad)
                    .slice(0, 5);

                const topClientes = Array.from(clienteMap.values())
                    .sort((a, b) => b.totalGastado - a.totalGastado)
                    .slice(0, 5);

                // 3. Distribución por Estado (Recalculado)
                const porEstado = { pendiente: 0, completado: 0, cancelado: 0 };
                pedidos.forEach(p => {
                    const estado = p.estado.toLowerCase() as keyof typeof porEstado;
                    if (porEstado[estado] !== undefined) {
                        porEstado[estado]++;
                    }
                });

                // Convertir mapa de días a array
                const ingresosPorDia = Array.from(ingresosDiaMap.entries()).map(([fecha, total]) => ({ fecha, total }));

                setStats({
                    totalIngresos,
                    totalPedidos,
                    ticketPromedio,
                    totalProductosVendidos: totalProductos,
                    pedidosPorEstado: porEstado,
                    topProductos,
                    topClientes,
                    ventasPorHora: ventasHora,
                    ingresosPorDia
                });

            } catch (error) {
                console.error("Error calculando estadísticas:", error);
            } finally {
                setLoading(false);
            }
        };

        calcularEstadisticas();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009951]"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 uppercase border-b-4 border-[#009951] pb-2 inline-block">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 mt-2">Resumen general del rendimiento de tu negocio.</p>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KpiCard 
                        title="Ingresos Totales" 
                        value={`S/ ${stats.totalIngresos.toFixed(2)}`} 
                        icon="💰" 
                        color="green"
                    />
                    <KpiCard 
                        title="Pedidos Totales" 
                        value={stats.totalPedidos.toString()} 
                        icon="🛍️" 
                        color="blue"
                    />
                    <KpiCard 
                        title="Ticket Promedio" 
                        value={`S/ ${stats.ticketPromedio.toFixed(2)}`} 
                        icon="📊" 
                        color="purple"
                    />
                    <KpiCard 
                        title="Prod. Vendidos" 
                        value={stats.totalProductosVendidos.toString()} 
                        icon="🍗" 
                        color="orange"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* VENTAS POR HORA */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-wider">Ventas por Hora</h3>
                        <div className="h-64 flex items-end gap-1">
                            {stats.ventasPorHora.map((total, hora) => {
                                const maxVenta = Math.max(...stats.ventasPorHora, 1); // Evitar división por cero
                                const height = (total / maxVenta) * 100;
                                return (
                                    <div key={hora} className="flex-1 flex flex-col items-center group relative">
                                        <div 
                                            className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all relative"
                                            style={{ height: `${height}%` }}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                                                {hora}:00 - S/ {total.toFixed(2)}
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-1 transform -rotate-90 sm:rotate-0">{hora}h</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* INGRESOS ÚLTIMOS 7 DÍAS */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-wider">Ingresos (Últimos 7 días)</h3>
                        <div className="space-y-4">
                            {stats.ingresosPorDia.map((dia, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-24 text-sm text-gray-500 font-medium">{dia.fecha}</div>
                                    <div className="flex-grow bg-gray-100 rounded-full h-4 overflow-hidden">
                                        <div 
                                            className="bg-[#009951] h-full rounded-full" 
                                            style={{ width: `${(dia.total / (Math.max(...stats.ingresosPorDia.map(d => d.total), 1))) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="w-24 text-right font-bold text-gray-800 text-sm">S/ {dia.total.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ESTADO DE PEDIDOS */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-wider">Estado de Pedidos</h3>
                        <div className="space-y-6">
                            <ProgressBar 
                                label="Completados" 
                                count={stats.pedidosPorEstado.completado} 
                                total={stats.totalPedidos} 
                                color="bg-[#009951]" 
                            />
                            <ProgressBar 
                                label="Pendientes" 
                                count={stats.pedidosPorEstado.pendiente} 
                                total={stats.totalPedidos} 
                                color="bg-yellow-400" 
                            />
                            <ProgressBar 
                                label="Cancelados" 
                                count={stats.pedidosPorEstado.cancelado} 
                                total={stats.totalPedidos} 
                                color="bg-red-500" 
                            />
                        </div>
                    </div>

                    {/* TOP PRODUCTOS */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-wider">Top 5 Productos</h3>
                        <div className="space-y-4">
                            {stats.topProductos.map((prod, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="font-bold text-gray-400 w-6 text-center">#{index + 1}</div>
                                    {prod.imagen ? (
                                        <img src={`/img/${prod.imagen}`} alt={prod.nombre} className="w-12 h-12 rounded-md object-cover bg-gray-200" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center text-xl">🍗</div>
                                    )}
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-gray-800 text-sm">{prod.nombre}</h4>
                                        <p className="text-xs text-gray-500">{prod.cantidad} unidades vendidas</p>
                                    </div>
                                    <div className="font-bold text-[#009951] text-sm">
                                        S/ {prod.total.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            {stats.topProductos.length === 0 && (
                                <p className="text-gray-400 text-center py-4">No hay datos suficientes aún.</p>
                            )}
                        </div>
                    </div>

                    {/* TOP CLIENTES */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-wider">Mejores Clientes</h3>
                        <div className="space-y-4">
                            {stats.topClientes.map((cliente, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="font-bold text-gray-400 w-6 text-center">#{index + 1}</div>
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                        {cliente.nombre.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-gray-800 text-sm">{cliente.nombre}</h4>
                                        <p className="text-xs text-gray-500">{cliente.pedidosCount} pedidos realizados</p>
                                    </div>
                                    <div className="font-bold text-[#009951] text-sm">
                                        S/ {cliente.totalGastado.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            {stats.topClientes.length === 0 && (
                                <p className="text-gray-400 text-center py-4">No hay datos de clientes aún.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

// Componentes auxiliares para mantener limpio el código principal
const KpiCard = ({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) => {
    const colorClasses = {
        green: "bg-[#009951]/10 text-[#009951]",
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600"
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${colorClasses[color as keyof typeof colorClasses]}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">{title}</p>
                <p className="text-2xl font-black text-gray-900">{value}</p>
            </div>
        </div>
    );
};

const ProgressBar = ({ label, count, total, color }: { label: string, count: number, total: number, color: string }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{label}</span>
                <span className="text-gray-500">{count} ({percentage.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                    className={`h-2.5 rounded-full ${color}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default EstadisticasAdmin;
