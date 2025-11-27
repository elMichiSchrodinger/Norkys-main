// src/models/Profile.ts

export interface Profile {
  id: string;          // UUID del usuario
  nombre: string;
  telefono: string | null;
  direccion: string | null;
  rol: 'usuario' | 'admin';
}