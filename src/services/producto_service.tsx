import { supabase } from "../utils/supabase";
import type { Producto } from "../models/producto";

export const getAllProductos = async (onlyAvailable: boolean = true): Promise<Producto[]> => {
  let query = supabase
    .from('producto')
    .select('*')
    .order('nombre', { ascending: true })

  if (onlyAvailable) {
    query = query.eq('disponibilidad', true)
  }

  const { data, error } = await query

  if (error) throw error
  return (data as Producto[]) || []
}


export const getProductosByCategoria = async (categoria: string, onlyAvailable: boolean = true): Promise<Producto[]> => {
  let query = supabase
    .from('producto')
    .select('*')
    .eq('categoria', categoria)
    .order('nombre', { ascending: true })

  if (onlyAvailable) {
    query = query.eq('disponibilidad', true)
  }

  const { data, error } = await query

  if (error) throw error
  return (data as Producto[]) || []
}

export const searchProductos = async (termino: string): Promise<Producto[]> => {
    // Si tienes una API real de búsqueda:
    // const response = await fetch(`T_URL/productos/buscar?q=${termino}`);
    // return await response.json();

    // SI NO TIENES API DE BÚSQUEDA, simulamos filtrando todo:
    const todos = await getAllProductos(); // Asumo que tienes una función que trae todo
    const terminoLower = termino.toLowerCase();
    
    return todos.filter(p => 
        p.nombre.toLowerCase().includes(terminoLower) || 
        (p.descripcion && p.descripcion.toLowerCase().includes(terminoLower))
    );
};

export const getProductoById = async (id: string | number) => {
    try {
        const { data, error } = await supabase
            .from('producto')
            .select('*')
            .eq('productoid', id)
            .single(); // .single() es importante porque esperamos solo uno

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error obteniendo producto:", error);
        return null;
    }
};

export const createProducto = async (producto: Omit<Producto, 'productoid'>): Promise<Producto | null> => {
  const { data, error } = await supabase
    .from('producto')
    .insert([producto])
    .select()
    .single()

  if (error) throw error
  return data as Producto
}

export const updateProducto = async (id: number, producto: Partial<Producto>): Promise<Producto | null> => {
  const { data, error } = await supabase
    .from('producto')
    .update(producto)
    .eq('productoid', id)
    .select()
    .single()

  if (error) throw error
  return data as Producto
}

export const softDeleteProducto = async (id: number): Promise<void> => {
    const { error } = await supabase
        .from('producto')
        .update({ disponibilidad: false })
        .eq('productoid', id);
    
    if (error) throw error;
}



