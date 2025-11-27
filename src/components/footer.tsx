import logo from '../assets/img/logo_actual.jpg'
import Facebook from '../assets/svg/facebook.svg?react'
import Instagram from '../assets/svg/instagram.svg?react'
import Tiktok from '../assets/svg/tiktok-brands-solid-full.svg?react'

const Footer =() => {
    return(
        <footer className="bg-black text-white pb-3">
            <div className="flex flex-row justify-center p-8 items-center">
                <img src={logo} alt="" className='size-24 mx-4 rounded-full'/>
                <div className='flex flex-col'>
                    <p>En casa o en nuestro local, lo importante es que disfrutes del sabor que nos hace únicos.</p>
                    <p>¡Gracias por preferirnos!</p>
                </div>
            </div>
            <div className='flex flex-col items-center'>
                <p>Síguenos a través de</p>
                <div className='flex flex-row justify-around w-50 my-4'>
                    <a href="https://www.facebook.com/norkysperu"><Facebook className='fill-white size-12'/></a>
                    <a href='https://www.instagram.com/norkys.pe/'><Instagram className='fill-white size-12'/></a>
                    <a href='https://www.tiktok.com/@norkysoficial'><Tiktok className='fill-white size-12'/></a>
                </div>
                <p className='text-xs'>Norkys © 2025 - Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}
export default Footer;