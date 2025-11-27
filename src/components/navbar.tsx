import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './navbar.css'; 

// --- ICONOS SVG EN LINEA (Para evitar errores de build) ---
const MenuBurgerIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const UserIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const CartIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FED800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const LOGO_URL = "/img/norkys_logo.png";

const Navbar = () => {
    const [query, setQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Hooks de contexto
    const { user, profile, signOut } = useAuth();
    const { totalItems } = useCart(); 
    
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/busqueda/${query}`); 
            setQuery(''); 
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        // Primero cerramos el menú
        toggleMenu();
        // Luego cerramos sesión
        await signOut();
    };

    // Lógica nombre
    const displayName = (user && profile?.nombre) 
        ? profile.nombre.split(' ')[0] 
        : (user?.user_metadata?.full_name?.split(' ')[0] || 'Mi cuenta');

    const isAdmin = profile?.rol === 'admin';

    return (
        <header>
            <nav className='bar-navegation flex flex-row items-center shadow-md justify-between px-5 relative z-30 bg-white'>
                <div className='flex flex-row justify-between items-center w-40'>
                    <button className='cursor-pointer' onClick={toggleMenu}>
                        <MenuBurgerIcon />
                    </button>
                    
                    <Link to={isAdmin ? "/admin/dashboard" : "/"} className='cursor-pointer'>
                        <img src={LOGO_URL} alt="logo" className='logo' />
                    </Link>
                </div>

                <form onSubmit={handleSearch} className='form-search flex flex-row items-center'>
                    <input 
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='¿Cuál es su antojo?'
                        className='search mr-6'
                    />
                    <button type="submit" aria-label='Buscar' className='cursor-pointer text-white'>
                        <SearchIcon />
                    </button>
                </form>

                <div className='flex flex-row justify-between items-center'>
                    <div 
                        className='user flex md:mr-10 font-bold font-sans items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity'
                        onClick={() => {
                            if (isAdmin) {
                                navigate('/admin/perfil');
                            } else if (user) {
                                // Si es usuario normal, quizás quieras llevarlo a su perfil también o no hacer nada
                                // navigate('/perfil'); 
                            } else {
                                navigate('/login');
                            }
                        }}
                    >
                        <p className="truncate max-w-[100px]">{displayName}</p>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <UserIcon />
                        </div>
                    </div>
                    
                    {!isAdmin && (
                        <div 
                            className='shop-car flex flex-row justify-around items-center cursor-pointer hover:opacity-90 transition-opacity'
                            onClick={() => navigate('/carrito')}
                        >
                            <CartIcon />
                            <p className='font-bold'>
                                {totalItems > 99 ? '99+' : totalItems.toString().padStart(2, '0')}
                            </p>
                        </div>
                    )}
                </div>
            </nav>

            {/* --- OFFCANVAS SIMPLE --- */}
            <div className={`
                fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 
                transform transition-transform duration-300 ease-in-out
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                    <h2 className="font-bold text-lg text-gray-700">Menú</h2>
                    <button onClick={toggleMenu} className="text-gray-500 hover:text-red-500 font-bold text-2xl focus:outline-none">&times;</button>
                </div>
                
                <div className="flex flex-col p-4 space-y-4 items-center">
                    <img src={LOGO_URL} alt="" className='w-32 mb-4 object-contain'/>
                    
                    <Link to={isAdmin ? "/admin/dashboard" : "/"} onClick={toggleMenu} className="text-gray-700 hover:text-yellow-600 font-medium text-lg">Inicio</Link>
                    
                    {isAdmin && (
                        <>
                            <Link to="/admin/productos" onClick={toggleMenu} className="text-gray-700 hover:text-yellow-600 font-medium text-lg">Productos</Link>
                            <Link to="/admin/promociones" onClick={toggleMenu} className="text-gray-700 hover:text-yellow-600 font-medium text-lg">Promociones</Link>
                            <Link to="/admin/pedidos" onClick={toggleMenu} className="text-gray-700 hover:text-yellow-600 font-medium text-lg">Pedidos</Link>
                            <Link to="/admin/estadisticas" onClick={toggleMenu} className="text-gray-700 hover:text-yellow-600 font-medium text-lg">Estadísticas</Link>
                        </>
                    )}

                    {!isAdmin && (
                        <Link to="/menu" onClick={toggleMenu} className="text-gray-700 hover:text-yellow-600 font-medium text-lg">Nuestra Carta</Link>
                    )}
                    
                    <div className='flex flex-col w-full gap-3 mt-4'>
                        {user ? (
                            <button 
                                onClick={handleLogout}
                                className='boton w-full text-white py-2 rounded-full font-bold hover:bg-yellow-50 transition-colors cursor-pointer'
                            >
                                Cerrar Sesión
                            </button>
                        ) : (
                            <>
                                <Link to="/login" onClick={toggleMenu} className='boton w-full text-center text-white py-2 rounded-full font-bold hover:bg-yellow-50 transition-colors'>Ingresar</Link>
                                <Link to="/registro" onClick={toggleMenu} className='boton w-full text-center text-white py-2 rounded-full font-bold hover:bg-yellow-50 transition-colors'>Registrarse</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {isMenuOpen && <div className="fixed inset-0 bg-opacity-50 z-40" onClick={toggleMenu}></div>}
        </header>
    );
}
export default Navbar;