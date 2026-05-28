export interface Vaccine {
  id: string;
  name: string;
  date: string;
  nextDueDate: string;
  status: "Em dia" | "Próxima da data" | "Vencida" | "Pendente";
  veterinarian: string;
}

export interface Exam {
  id: string;
  name: string; // Ex: Hemograma, Raio-X
  date: string;
  result: string;
  status: "Normal" | "Requer atenção" | "Pendente";
}

export interface Consultation {
  id: string;
  date: string;
  reason: string;
  vetName: string;
  notes: string;
  prescriptions: string[];
}

export interface HealthReport {
  overallScore: number; // 0 a 100
  generalStatus: string; // Ex: Excelente, Monitorando, etc.
  nutritionalStatus: string;
  tips: string[];
  lastUpdate: string;
}

export interface Pet {
  id: string;
  name: string;
  type: "Cão" | "Gato";
  breed: string;
  birthDate: string;
  weight: number; // em kg
  gender: "Macho" | "Fêmea";
  avatar: string; // placeholder or base64
  vaccines: Vaccine[];
  exams: Exam[];
  consultations: Consultation[];
  healthReport: HealthReport;
}

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  serviceType: "Banho" | "Tosa" | "Combo Banho e Tosa" | "Consulta Geral" | "Especialista";
  clinicName: string;
  date: string;
  time: string;
  price: number;
  status: "Confirmado" | "Cancelado" | "Concluído";
  paymentStatus: "Pago online" | "Pagar no local";
  paymentId?: string;
}

export interface Product {
  id: string;
  name: string;
  category: "Alimentação" | "Acessórios" | "Higiene" | "Brinquedos" | "Saúde";
  price: number;
  image: string;
  description: string;
  rating: number;
  inStock: boolean;
  tag?: string; // Ex: "Mais vendido", "Organico", "Recomendado"
}

export interface ChatMessage {
  id: string;
  sender: "user" | "vet";
  text: string;
  timestamp: string;
  imageUrl?: string; // Optativo, para triagem rápida enviando fotos
  vetName?: string;
}

export interface PartnerClinic {
  id: string;
  name: string;
  address: string;
  distance: string; // Ex: "1.2 km"
  rating: number;
  reviews: number;
  services: string[];
  phone: string;
  lat: number; // relative SVG coordinates for mini map (0 to 100)
  lng: number; // relative SVG coordinates for mini map (0 to 100)
}

export interface ProductCartItem {
  product: Product;
  quantity: number;
}
