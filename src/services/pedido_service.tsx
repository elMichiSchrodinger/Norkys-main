import { supabase } from '../utils/supabase';
import type { CartItem } from '../models/cartItem';
import type { Pedido } from '../models/pedido';

export const createPedido = async (userId: string, cart: CartItem[], total: number) => {
    try {
        // 1. Crear la cabecera del PEDIDO
        const { data: pedidoData, error: pedidoError } = await supabase
            .from('pedido')
            .insert([
                { 
                    usuario_id: userId,
                    montototal: total,
                    estado: 'pendiente' // Estado inicial
                }
            ])
            .select()
            .single();

        if (pedidoError) throw pedidoError;
        if (!pedidoData) throw new Error("No se pudo crear el pedido");

        const pedidoId = pedidoData.pedidoid;

        // 2. Preparar los detalles (productos del carrito)
        const detalles = cart.map(item => ({
            pedidoid: pedidoId,
            productoid: item.productoid,
            cantidad: item.cantidad,
            preciounitario: item.precio
        }));

        // 3. Insertar DETALLE_PEDIDO (todos de golpe)
        const { error: detalleError } = await supabase
            .from('detalle_pedido')
            .insert(detalles);

        if (detalleError) throw detalleError;

        return { success: true, pedidoId };

    } catch (error) {
        console.error("Error creando pedido:", error);
        return { success: false, error };
    }
};

export const getAllPedidos = async (): Promise<Pedido[]> => {
    // 1. Obtener los pedidos
    const { data: pedidos, error } = await supabase
        .from('pedido')
        .select('*')
        .order('fechapedido', { ascending: false });

    if (error) throw error;
    if (!pedidos || pedidos.length === 0) return [];

    const pedidoIds = pedidos.map(p => p.pedidoid);

    // 2. Obtener Perfiles (Usuarios)
    const userIds = Array.from(new Set(pedidos.map(p => p.usuario_id).filter(Boolean)));
    const { data: profiles } = await supabase
        .from('profile')
        .select('*')
        .in('id', userIds);
    
    const profileMap = new Map(profiles?.map(p => [p.id, p]));

    // 3. Obtener Pagos
    const { data: pagos } = await supabase
        .from('pago')
        .select('*')
        .in('pedidoid', pedidoIds);
    
    const pagoMap = new Map(pagos?.map(p => [p.pedidoid, p]));

    // 3. Obtener Detalles de Pedido
    const { data: detalles } = await supabase
        .from('detalle_pedido')
        .select('*')
        .in('pedidoid', pedidoIds);

    // 4. Obtener Productos (para los nombres en los detalles)
    let productoMap = new Map();
    if (detalles && detalles.length > 0) {
        const productoIds = Array.from(new Set(detalles.map(d => d.productoid).filter(Boolean)));
        const { data: productos } = await supabase
            .from('producto')
            .select('productoid, nombre, image_path')
            .in('productoid', productoIds);
        
        productoMap = new Map(productos?.map(p => [p.productoid, p]));
    }

    // 5. Combinar todo
    const pedidosCompletos = pedidos.map(p => {
        // Usamos comparación laxa (==) por si hay diferencias de tipo (string vs number)
        const misDetalles = detalles?.filter(d => d.pedidoid == p.pedidoid).map(d => ({
            ...d,
            producto_nombre: productoMap.get(d.productoid)?.nombre || 'Producto desconocido',
            producto_imagen: productoMap.get(d.productoid)?.image_path
        })) || [];

        const usuario = p.usuario_id ? profileMap.get(p.usuario_id) : undefined;

        return {
            ...p,
            pago: pagoMap.get(p.pedidoid),
            detalles: misDetalles,
            usuario: usuario
        };
    });

    return pedidosCompletos as Pedido[];
};