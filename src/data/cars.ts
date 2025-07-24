export interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  location: string;
  images: string[];
  category: string;
  featured?: boolean;
  description?: string;
  transmission?: string;
  color?: string;
}

export const cars: Car[] = [
  {
    id: "1",
    name: "Civic Touring",
    brand: "Honda",
    year: 2023,
    price: 185000,
    mileage: 15000,
    fuel: "Gasolina",
    location: "Maputo",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Sedan",
    featured: true,
    description: "Honda Civic Touring 2023 em excelente estado de conservação. Único dono, revisões em dia.",
    transmission: "CVT",
    color: "Branco Pérola"
  },
  {
    id: "2",
    name: "Corolla XEi",
    brand: "Toyota",
    year: 2022,
    price: 165000,
    mileage: 25000,
    fuel: "Diesel",
    location: "Matola",
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Sedan",
    description: "Toyota Corolla XEi 2022, bem conservado e com todos os opcionais.",
    transmission: "CVT",
    color: "Prata"
  },
  {
    id: "3",
    name: "Tiguan Allspace",
    brand: "Volkswagen",
    year: 2021,
    price: 195000,
    mileage: 35000,
    fuel: "Gasolina",
    location: "Beira",
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
    ],
    category: "SUV",
    featured: true,
    description: "Volkswagen Tiguan Allspace 2021, 7 lugares, completa.",
    transmission: "Automática",
    color: "Azul Metálico"
  },
  {
    id: "4",
    name: "HB20S Diamond",
    brand: "Hyundai",
    year: 2023,
    price: 95000,
    mileage: 8000,
    fuel: "Gasolina",
    location: "Nampula",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Hatch",
    description: "Hyundai HB20S Diamond 2023, zero km de uso, garantia de fábrica.",
    transmission: "Manual",
    color: "Vermelho"
  },
  {
    id: "5",
    name: "Compass Limited",
    brand: "Jeep",
    year: 2022,
    price: 175000,
    mileage: 22000,
    fuel: "Diesel",
    location: "Chimoio",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
    ],
    category: "SUV",
    description: "Jeep Compass Limited 2022, tração 4x4, completa.",
    transmission: "Automática",
    color: "Preto"
  },
  {
    id: "6",
    name: "Onix Premier",
    brand: "Chevrolet",
    year: 2023,
    price: 89000,
    mileage: 12000,
    fuel: "Gasolina",
    location: "Nacala",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Hatch",
    description: "Chevrolet Onix Premier 2023, econômico e moderno.",
    transmission: "Automática",
    color: "Branco"
  }
];

export const categories = [
  "Todos",
  "Sedan",
  "SUV", 
  "Hatch",
  "Pickup"
];