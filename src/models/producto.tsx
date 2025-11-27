export interface Producto {
  productoid: number;
  nombre: string;
  categoria: string;
  descripcion: string | null;
  precio: number;
  image_path: string | null;
  disponibilidad: boolean;
}