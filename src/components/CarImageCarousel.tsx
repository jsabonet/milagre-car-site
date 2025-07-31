import React, { useState } from "react";
import { CarImage } from "@/services/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarImageCarouselProps {
  images: CarImage[];
  className?: string;
  aspectRatio?: string; // e.g. "aspect-[4/3]"
}

const CarImageCarousel: React.FC<CarImageCarouselProps> = ({ images, className = "", aspectRatio = "aspect-[4/3]" }) => {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;

  const goToPrev = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goToNext = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className={`relative w-full ${aspectRatio} ${className}`}>
      <img
        src={images[current].image}
        alt={images[current].alt_text || `Imagem ${current + 1}`}
        className="w-full h-full object-cover rounded-lg transition-all duration-300"
      />
      {images.length > 1 && (
        <>
          <button
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
            onClick={goToPrev}
            aria-label="Imagem anterior"
            type="button"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
            onClick={goToNext}
            aria-label="Próxima imagem"
            type="button"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`block w-2 h-2 rounded-full ${idx === current ? "bg-primary" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CarImageCarousel;
