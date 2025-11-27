import { useNavigate, Link } from 'react-router-dom';

// En tu proyecto local, descomenta la siguiente línea:
// import logo from '../assets/img/norkys_logo.png'; 

// Usamos un placeholder para que el código compile aquí sin errores
const LOGO_URL = "/img/norkys_logo.png";
// En tu local puedes usar: const LOGO_URL = logo;

const NavbarSimple = () => {
    const navigate = useNavigate();

    return (
        <header className="h-[70px] bg-white shadow-md flex items-center justify-between px-4 sticky top-0 z-50">
            
            {/* 1. Botón de Retroceso (Izquierda) */}
            <button 
                onClick={() => navigate(-1)} 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                aria-label="Volver atrás"
            >
                {/* Icono de Flecha Izquierda SVG */}
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </button>

            {/* 2. Logo Centrado */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link to="/">
                    <img 
                        src={LOGO_URL} 
                        alt="Norkys Logo" 
                        className="h-10 object-contain"
                    />
                </Link>
            </div>

            {/* 3. Espaciador vacío a la derecha */}
            <div className="w-10"></div>

        </header>
    );
};

export default NavbarSimple;