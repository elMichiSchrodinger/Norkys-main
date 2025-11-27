import { useState } from 'react'

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)

  return (
    <div className="relative w-full mx-auto h-130">
      {/* Imagen actual */}
      <div className="overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full object-cover h-130"
        />
      </div>

      {/* Botones de navegación */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        ›
      </button>

    </div>
  )
}

export default Carousel
// Uso:
// <Carousel images={['img1.jpg', 'img2.jpg', 'img3.jpg']} />