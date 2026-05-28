import { Pet, Product, PartnerClinic } from "./types";

export const INITIAL_PETS: Pet[] = [
  {
    id: "mel-dog",
    name: "Mel",
    type: "Cão",
    breed: "Golden Retriever",
    birthDate: "2022-03-12",
    weight: 28.5,
    gender: "Fêmea",
    avatar: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300",
    vaccines: [
      {
        id: "v-mel-1",
        name: "V10 Múltipla Canina",
        date: "2026-03-01",
        nextDueDate: "2027-03-01",
        status: "Em dia",
        veterinarian: "Dr. Rafael Silva"
      },
      {
        id: "v-mel-2",
        name: "Antirrábica",
        date: "2025-10-15",
        nextDueDate: "2026-10-15",
        status: "Próxima da data",
        veterinarian: "Dr. Rafael Silva"
      },
      {
        id: "v-mel-3",
        name: "Gripe Canina (BronchiGuard)",
        date: "2025-05-10",
        nextDueDate: "2026-05-10",
        status: "Vencida",
        veterinarian: "Dra. Cláudia Melo"
      }
    ],
    exams: [
      {
        id: "e-mel-1",
        name: "Hemograma Completo",
        date: "2026-02-15",
        result: "Todos os índices dentro do limite saudável. Sem sinais de anemia ou infecção.",
        status: "Normal"
      },
      {
        id: "e-mel-2",
        name: "Ultrassom Abdominal",
        date: "2026-02-15",
        result: "Órgãos íntegros, bexiga normal. Sem alterações clínicas.",
        status: "Normal"
      }
    ],
    consultations: [
      {
        id: "c-mel-1",
        date: "2026-03-01",
        reason: "Check-up Anual e Aplicação de V10",
        vetName: "Dr. Rafael Silva",
        notes: "Excelente condição corporal (score 5/9). Coração e pulmões limpos. Solicitado reforço da vacina de gripe canina que está expirada.",
        prescriptions: ["Adicionar ômega 3 na ração diária", "Manter rotina de escovação dentária"]
      },
      {
        id: "c-mel-2",
        date: "2025-10-15",
        reason: "Irritação de Pele (Coceira)",
        vetName: "Dra. Cláudia Melo",
        notes: "Apresentou leve alergia de contato por grama na barriga. Tratado com banho terapêutico e hidratante específico.",
        prescriptions: ["Shampoo Aloe e Vera Hipoalergênico", "Pomada dermatológica 2x ao dia por 5 dias"]
      }
    ],
    healthReport: {
      overallScore: 92,
      generalStatus: "Excelente",
      nutritionalStatus: "Peso Ideal (Ótimo)",
      tips: [
        "A vacina da Gripe Canina venceu recentemente. Agende uma visita para aplicação rápida.",
        "Pelagem brilhante e dentes saudáveis. Continue escovando duas vezes por semana.",
        "Exercícios de 40 minutos diários recomendados para manter a musculatura ideal."
      ],
      lastUpdate: "2026-05-20"
    }
  },
  {
    id: "oliver-cat",
    name: "Oliver",
    type: "Gato",
    breed: "Siamês",
    birthDate: "2024-06-20",
    weight: 4.2,
    gender: "Macho",
    avatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300",
    vaccines: [
      {
        id: "v-oliver-1",
        name: "Quádrupla Felina (V4)",
        date: "2026-04-10",
        nextDueDate: "2027-04-10",
        status: "Em dia",
        veterinarian: "Dra. Cláudia Melo"
      },
      {
        id: "v-oliver-2",
        name: "Antirrábica",
        date: "2026-04-10",
        nextDueDate: "2027-04-10",
        status: "Em dia",
        veterinarian: "Dra. Cláudia Melo"
      }
    ],
    exams: [
      {
        id: "e-oliver-1",
        name: "Exame FIV/FeLV",
        date: "2024-12-05",
        result: "Negativo para ambos os vírus. Ótimo estado de imunologia.",
        status: "Normal"
      }
    ],
    consultations: [
      {
        id: "c-oliver-1",
        date: "2026-04-10",
        reason: "Reforço Vacinal e Pesagem",
        vetName: "Dra. Cláudia Melo",
        notes: "Gato ativo e hidratado. Alimentando-se exclusivamente de ração seca e úmida super premium.",
        prescriptions: ["Estimular consumo de água com fonte de água elétrica"]
      }
    ],
    healthReport: {
      overallScore: 98,
      generalStatus: "Excelente",
      nutritionalStatus: "Excelente e Ativo",
      tips: [
        "Suas vacinas estão 100% em dia! Próximo reforço somente em Abril de 2027.",
        "Fique atento ao consumo de água: felinos preferem água corrente corrente. Recomendamos fontes.",
        "Brincadeiras verticais para enriquecimento ambiental estimulam Oliver e previnem ansiedade."
      ],
      lastUpdate: "2026-05-25"
    }
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Ração Guabi Natural Cães Adultos Golden/Large 15kg",
    category: "Alimentação",
    price: 249.90,
    image: "https://images.unsplash.com/photo-1589721062905-e45dc127d75a?auto=format&fit=crop&q=80&w=400",
    description: "Ração Premium sem corantes e conservantes artificiais. Rica em ômega 3 e condroitina para as articulações.",
    rating: 4.8,
    inStock: true,
    tag: "Organico"
  },
  {
    id: "prod-2",
    name: "Sachê Royal Canin Feline Wet Intense Beauty 85g",
    category: "Alimentação",
    price: 8.50,
    image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&q=80&w=400",
    description: "Alimento úmido premium para gatos, auxilia na manutenção da beleza da pelagem e peso saudável.",
    rating: 4.9,
    inStock: true,
    tag: "Mais vendido"
  },
  {
    id: "prod-3",
    name: "Shampoo Pet Hipoalergênico Aveia e Aloe Vera 500ml",
    category: "Higiene",
    price: 49.90,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=400",
    description: "Espuma suave livre de parabenos, ideal para peles sensíveis, alérgicas ou avermelhadas.",
    rating: 4.7,
    inStock: true,
    tag: "Recomendado"
  },
  {
    id: "prod-4",
    name: "Comprimido Antiparasitário Simparic 20 a 40kg (Cães)",
    category: "Saúde",
    price: 135.00,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
    description: "Proteção eficaz contra pulgas, carrapatos e sarnas em cães por até 35 dias. Altamente palatável.",
    rating: 5.0,
    inStock: true,
    tag: "Promoção"
  },
  {
    id: "prod-5",
    name: "Brinquedo Dispenser Interativo Kong Classic G",
    category: "Brinquedos",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400",
    description: "Brinquedo de borracha natural ultra resistente para preencher com petiscos. Estimula a mentação do pet.",
    rating: 4.9,
    inStock: true
  },
  {
    id: "prod-6",
    name: "Fonte de Água Elétrica Cerâmica Bivolt Gatos 1.5L",
    category: "Acessórios",
    price: 189.00,
    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=400",
    description: "Mantém a água fresca, oxigenada e livre de resíduos com o filtro triplo ativo. Incentiva a hidratação diária.",
    rating: 4.6,
    inStock: true
  },
  {
    id: "prod-7",
    name: "Areia Sanitária Ultra Premium para Gatos Pipicat 4kg",
    category: "Higiene",
    price: 34.90,
    image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=400",
    description: "Formação de torrões firmes e imediatos, neutralizador potente de odores e 100% natural, sem poeira.",
    rating: 4.5,
    inStock: true
  },
  {
    id: "prod-8",
    name: "Coleira Guia Retrátil Confort Flex 5m até 25kg",
    category: "Acessórios",
    price: 79.90,
    image: "https://images.unsplash.com/photo-1531804055935-76f44d7c3621?auto=format&fit=crop&q=80&w=400",
    description: "Punho emborrachado macio com sistema de travagem de segurança instantâneo de um toque.",
    rating: 4.7,
    inStock: false
  }
];

export const PARTNER_CLINICS: PartnerClinic[] = [
  {
    id: "clinic-1",
    name: "PetCare Unidade Jardins (Matriz)",
    address: "Al. Lorena, 1420 - Jardim Paulista, São Paulo",
    distance: "1.2 km de você",
    rating: 4.9,
    reviews: 312,
    services: ["Banho e Tosa", "Cirurgia", "Exames Clínicos", "Urgência 24h", "Telemedicina"],
    phone: "(11) 3088-7500",
    lat: 35,
    lng: 40
  },
  {
    id: "clinic-2",
    name: "Centro Veterinário Amigo Fiel Pinheiros",
    address: "Rua dos Pinheiros, 850 - Pinheiros, São Paulo",
    distance: "2.8 km de você",
    rating: 4.8,
    reviews: 185,
    services: ["Banho e Tosa", "Vacinação", "Ortopedia", "Dentista Vet"],
    phone: "(11) 3254-8800",
    lat: 55,
    lng: 25
  },
  {
    id: "clinic-3",
    name: "Hospital Veterinário 24h Ibirapuera",
    address: "Av. República do Líbano, 1950 - Ibirapuera, São Paulo",
    distance: "4.1 km de você",
    rating: 4.7,
    reviews: 420,
    services: ["Urgência 24h", "UTI Veterinária", "Ultrassonografia", "Exames de Sangue", "Internação"],
    phone: "(11) 5055-3200",
    lat: 42,
    lng: 60
  }
];
