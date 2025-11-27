import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definimos la estructura de un ítem en el carrito
interface CartItem {
    productoid: number;
    nombre: string;
    precio: number;
    image_path: string;
    cantidad: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, newQuantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<AuthContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        // Intentamos recuperar el carrito del localStorage al iniciar
        const savedCart = localStorage.getItem('norkys_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Cada vez que el carrito cambie, lo guardamos en localStorage
    useEffect(() => {
        localStorage.setItem('norkys_cart', JSON.stringify(cart));
    }, [cart]);

    // Función para agregar producto
    const addToCart = (product: any, quantity: number) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.productoid === product.productoid);
            
            if (existingItem) {
                // Si ya existe, solo sumamos la cantidad
                return prevCart.map(item => 
                    item.productoid === product.productoid 
                        ? { ...item, cantidad: item.cantidad + quantity }
                        : item
                );
            } else {
                // Si no existe, lo agregamos nuevo
                return [...prevCart, { 
                    productoid: product.productoid,
                    nombre: product.nombre,
                    precio: parseFloat(product.precio), // Aseguramos que sea número
                    image_path: product.image_path,
                    cantidad: quantity 
                }];
            }
        });
    };

    // Función para quitar un producto
    const removeFromCart = (productId: number) => {
        setCart(prevCart => prevCart.filter(item => item.productoid !== productId));
    };

    // Función para subir o bajar cantidad desde el carrito
    const updateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity < 1) return; // No permitir menos de 1
        setCart(prevCart => 
            prevCart.map(item => 
                item.productoid === productId ? { ...item, cantidad: newQuantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    // Cálculos automáticos
    const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart, 
            totalItems, 
            totalPrice 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};