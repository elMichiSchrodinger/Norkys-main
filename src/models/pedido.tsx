import type { Pago } from './pago';
import type { DetallePedido } from './detallePedido';
import type { Profile } from './profile';

export interface Pedido {
  pedidoid: number;        
  fechapedido: string | null;
  montototal: number | null;
  estado: string;
  pago?: Pago;
  detalles?: (DetallePedido & { producto_nombre?: string; producto_imagen?: string })[];
  usuario_id?: string;
  usuario?: Profile;
}