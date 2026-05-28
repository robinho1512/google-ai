import React, { useState, useEffect } from "react";
import {
  Calendar,
  MessageSquare,
  ShoppingBag,
  MapPin,
  Heart,
  Plus,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  User,
  Trash2,
  CheckCircle,
  Clock,
  Menu,
  X,
  CreditCard,
  PlusCircle,
  DollarSign,
  FileText,
  Bookmark,
  Camera,
  Search,
  ShoppingCart,
  Phone,
  Star,
  Activity,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_PETS, INITIAL_PRODUCTS, PARTNER_CLINICS } from "./mockData";
import { Pet, Appointment, Product, ChatMessage, ProductCartItem, Vaccine, Exam, PartnerClinic } from "./types";
import NotificationBanner from "./components/NotificationBanner";
import LoyaltyManager from "./components/LoyaltyManager";
import Dashboard from "./components/Dashboard";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core App State
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [selectedPetId, setSelectedPetId] = useState<string>("mel-dog");
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "app-1",
      petId: "mel-dog",
      petName: "Mel",
      serviceType: "Combo Banho e Tosa",
      clinicName: "PetCare Unidade Jardins (Matriz)",
      date: "2026-05-29",
      time: "14:30",
      price: 120.00,
      status: "Confirmado",
      paymentStatus: " Pago online",
      paymentId: "TX-8820"
    },
    {
      id: "app-2",
      petId: "oliver-cat",
      petName: "Oliver",
      serviceType: "Banho",
      clinicName: "Centro Veterinário Amigo Fiel Pinheiros",
      date: "2026-05-15",
      time: "10:00",
      price: 60.00,
      status: "Concluído",
      paymentStatus: "Pagar no local"
    }
  ]);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(440);

  // Active Notifications list
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      type: "warning" as const,
      message: "A vacina de Gripe Canina da Mel está vencida desde 10/05/2026!",
      date: "28/05/2026",
      read: false,
    },
    {
      id: "n2",
      type: "info" as const,
      message: "Reforço da vacina Antirrábica da Mel agendada automaticamente para Outubro.",
      date: "26/05/2026",
      read: false,
    },
    {
      id: "n3",
      type: "success" as const,
      message: "Seu agendamento 'Combo Banho e Tosa' de amanhã para a Mel foi confirmado!",
      date: "28/05/2026",
      read: false,
    }
  ]);

  // Cart State
  const [cart, setCart] = useState<ProductCartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [cartOpen, setCartOpen] = useState(false);

  // Vet Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "vet",
      text: "Olá! Sou o Dr. Rafael, médico veterinário da clínica PetCare. Como posso ajudar seu pet hoje?",
      timestamp: "10:55",
      vetName: "Dr. Rafael Silva"
    }
  ]);
  const [currentMessageText, setCurrentMessageText] = useState("");
  const [uploadedBase64Image, setUploadedBase64Image] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  // Pre-populated clinical training images users can choose instantly to test dermal/ophthalmic evaluation
  const DEMO_PHOTOS = [
    {
      label: "Irritação de Pele",
      url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=200",
      tag: "dermatite"
    },
    {
      label: "Secreção nos Olhos",
      url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200",
      tag: "secrecao"
    }
  ];

  // Appointment creation step states
  const [schPetId, setSchPetId] = useState<string>("mel-dog");
  const [schService, setSchService] = useState<"Banho" | "Tosa" | "Combo Banho e Tosa" | "Consulta Geral">("Banho");
  const [schClinic, setSchClinic] = useState<string>(PARTNER_CLINICS[0].name);
  const [schDate, setSchDate] = useState<string>("2026-06-01");
  const [schTime, setSchTime] = useState<string>("11:00");
  const [schHydrationReward, setSchHydrationReward] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "local">("online");
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Secure payment modal simulator states
  const [isPayingOnline, setIsPayingOnline] = useState<boolean>(false);
  const [pendingPaymentAmount, setPendingPaymentAmount] = useState<number>(0);
  const [creditCardNumber, setCreditCardNumber] = useState("4532 •••• •••• 9811");
  const [creditCardName, setCreditCardName] = useState("Marina S. Oliveira");
  const [creditCardExpiry, setCreditCardExpiry] = useState("09/29");
  const [creditCardCVV, setCreditCardCVV] = useState("123");
  const [payConfirmationCode, setPayConfirmationCode] = useState<string | null>(null);

  // Pet Registration State
  const [showAddPet, setShowAddPet] = useState(false);
  const [newPetName, setNewPetName] = useState("");
  const [newPetType, setNewPetType] = useState<"Cão" | "Gato">("Cão");
  const [newPetBreed, setNewPetBreed] = useState("");
  const [newPetWeight, setNewPetWeight] = useState("");
  const [newPetBirth, setNewPetBirth] = useState("");
  const [newPetGender, setNewPetGender] = useState<"Macho" | "Fêmea">("Macho");

  // Vaccine Addition Form State
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [newVacName, setNewVacName] = useState("V10 Múltipla Canina");
  const [newVacDate, setNewVacDate] = useState("2026-05-28");
  const [newVacNext, setNewVacNext] = useState("2027-05-28");
  const [newVacVet, setNewVacVet] = useState("Dr. Rafael Silva");

  // Selected clinic location on the SVG mini-map
  const [selectedClinic, setSelectedClinic] = useState<PartnerClinic>(PARTNER_CLINICS[0]);

  // Handle active pet selection helper
  const activePetObj = pets.find((p) => p.id === selectedPetId) || pets[0];

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleClearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Add loyalty points safely with real feedback
  const earnPoints = (amount: number, reason: string) => {
    setLoyaltyPoints((prev) => prev + amount);
    const newAlert = {
      id: Math.random().toString(),
      type: "success" as const,
      message: `Você ganhou +${amount} PetPoints participando de: ${reason}! 🌟`,
      date: "Hoje",
      read: false,
    };
    setNotifications((prev) => [newAlert, ...prev]);
  };

  const handleRedeemPoints = (cost: number, itemName: string) => {
    setLoyaltyPoints((prev) => Math.max(0, prev - cost));
    const newAlert = {
      id: Math.random().toString(),
      type: "info" as const,
      message: `Cupom para "${itemName}" resgatado. -${cost} pontos aplicados.`,
      date: "Hoje",
      read: false,
    };
    setNotifications((prev) => [newAlert, ...prev]);
  };

  // Handle product purchase
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });

    const newAlert = {
      id: Math.random().toString(),
      type: "info" as const,
      message: `"${product.name}" adicionado à sua Sacola Express!`,
      date: "Hoje",
      read: false,
    };
    setNotifications((prev) => [newAlert, ...prev]);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  const handleCheckoutCart = () => {
    const total = calculateTotal();
    if (total === 0) return;

    setPendingPaymentAmount(total);
    setIsPayingOnline(true);
  };

  const confirmCartPurchase = () => {
    const code = "PAY-PRODUCT-" + Math.floor(1000 + Math.random() * 9000);
    setPayConfirmationCode(code);

    // Calculate loyalty points earned (1 point per R$ 10 spent)
    const pointsEarned = Math.floor(pendingPaymentAmount / 10);
    earnPoints(pointsEarned, "Compra de Produtos Veterinários");

    // Clear cart and notify fast delivery
    const delayDeliveryAlert = {
      id: Math.random().toString(),
      type: "success" as const,
      message: `Seu pedido no valor de R$ ${pendingPaymentAmount.toFixed(2)} já está em rota expressa de entrega residencial de 20 min! Código de rastreio: BR-EXPRESS-${Math.floor(100000 + Math.random() * 900000)}`,
      date: "Há instantes",
      read: false
    };
    setNotifications((prev) => [delayDeliveryAlert, ...prev]);

    setCart([]);
    setCartOpen(false);

    setTimeout(() => {
      setIsPayingOnline(false);
      setPayConfirmationCode(null);
    }, 4500);
  };

  // Chat implementation with real-time prompt querying
  const handleSendMessage = async () => {
    if (!currentMessageText.trim() && !uploadedBase64Image) return;

    const baseMessageText = currentMessageText || "Solicito triagem de imagem anexa";
    const userMsgId = "msg-user-" + Math.random();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: baseMessageText,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      imageUrl: uploadedBase64Image || undefined
    };

    setChatMessages((prev) => [...prev, newUserMsg]);
    setCurrentMessageText("");
    const imageToSubmit = uploadedBase64Image;
    setUploadedBase64Image(null);
    setChatLoading(true);

    try {
      // API call requesting Gemini feedback
      const response = await fetch("/api/vet-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: baseMessageText,
          petInfo: {
            name: activePetObj.name,
            type: activePetObj.type,
            breed: activePetObj.breed,
            age: activePetObj.birthDate,
          },
          image: imageToSubmit,
          history: chatMessages.slice(-4).map((msg) => ({
            role: msg.sender === "user" ? "user" : "model",
            text: msg.text,
          })),
        }),
      });

      const data = await response.json();
      const answerText = data.response;

      const botMsg: ChatMessage = {
        id: "msg-vet-" + Math.random(),
        sender: "vet",
        text: answerText,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        vetName: "Dr. Rafael Silva (Veterinário da Clínica)"
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("API call error. Falling back safely.", err);
    } finally {
      setChatLoading(false);
    }
  };

  // Convert files to base64 for reliable transfer
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle manual booking creation
  const handleNewBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const petName = pets.find((p) => p.id === schPetId)?.name || "Pet";
    const calculatedPrice = schService === "Combo Banho e Tosa" ? 140 : schService === "Tosa" ? 80 : schService === "Consulta Geral" ? 180 : 60;

    const newApp: Appointment = {
      id: "app-new-" + Math.floor(Math.random() * 1000),
      petId: schPetId,
      petName,
      serviceType: schService,
      clinicName: schClinic,
      date: schDate,
      time: schTime,
      price: calculatedPrice,
      status: "Confirmado",
      paymentStatus: paymentMethod === "online" ? "Pago online" : "Pagar no local"
    };

    if (paymentMethod === "online") {
      setPendingPaymentAmount(calculatedPrice);
      setIsPayingOnline(true);
    } else {
      // Local payment flow
      setAppointments((prev) => [newApp, ...prev]);
      earnPoints(schService === "Consulta Geral" ? 50 : 15, `Agendamento de ${schService}`);
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 5000);
    }
  };

  // Final payment confirmation for online bookings
  const confirmOnlineBookingPayment = () => {
    const code = "TX-ONLINE-" + Math.floor(10000 + Math.random() * 90000);
    setPayConfirmationCode(code);

    const petName = pets.find((p) => p.id === schPetId)?.name || "Pet";
    const calculatedPrice = schService === "Combo Banho e Tosa" ? 140 : schService === "Tosa" ? 80 : schService === "Consulta Geral" ? 180 : 60;

    const newApp: Appointment = {
      id: "app-new-" + Math.floor(Math.random() * 1000),
      petId: schPetId,
      petName,
      serviceType: schService,
      clinicName: schClinic,
      date: schDate,
      time: schTime,
      price: calculatedPrice,
      status: "Confirmado",
      paymentStatus: "Pago online",
      paymentId: code
    };

    setAppointments((prev) => [newApp, ...prev]);
    earnPoints(schService === "Consulta Geral" ? 50 : 15, `Booking de ${schService} Online`);

    setTimeout(() => {
      setIsPayingOnline(false);
      setBookingSuccess(true);
      setPayConfirmationCode(null);
      setTimeout(() => setBookingSuccess(false), 5000);
    }, 4000);
  };

  // Pet creation handler
  const handleAddPetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName || !newPetBreed || !newPetWeight || !newPetBirth) return;

    const newPet: Pet = {
      id: "pet-added-" + Date.now(),
      name: newPetName,
      type: newPetType,
      breed: newPetBreed,
      birthDate: newPetBirth,
      weight: parseFloat(newPetWeight),
      gender: newPetGender,
      avatar: newPetType === "Cão"
        ? "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300"
        : "https://images.unsplash.com/photo-1472491235688-bdc81a63246e?auto=format&fit=crop&q=80&w=300",
      vaccines: [],
      exams: [],
      consultations: [],
      healthReport: {
        overallScore: 85,
        generalStatus: "Bem-vindo",
        nutritionalStatus: "A avaliar",
        tips: [
          `Parabéns pelo novo membro da família: ${newPetName}!`,
          "Mantenha as vacinas V10 ou V4 e Antirrábica em dia regularmente.",
          "Agende o primeiro Banho higiênico para acolhimento seguro."
        ],
        lastUpdate: new Date().toISOString().split("T")[0]
      }
    };

    setPets((prev) => [...prev, newPet]);
    setSelectedPetId(newPet.id);
    earnPoints(30, `Boas-vindas para ${newPetName}`);

    // Clean inputs
    setNewPetName("");
    setNewPetBreed("");
    setNewPetWeight("");
    setNewPetBirth("");
    setShowAddPet(false);
  };

  // Vaccine Addition handler
  const handleAddVaccineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVacName || !newVacDate || !newVacNext) return;

    const newVaccine: Vaccine = {
      id: "v-added-" + Date.now(),
      name: newVacName,
      date: newVacDate,
      nextDueDate: newVacNext,
      status: "Em dia",
      veterinarian: newVacVet
    };

    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id === selectedPetId) {
          const updatedVaccines = [...pet.vaccines, newVaccine];
          return {
            ...pet,
            vaccines: updatedVaccines,
            healthReport: {
              ...pet.healthReport,
              overallScore: Math.min(100, pet.healthReport.overallScore + 5),
              tips: [
                ...pet.healthReport.tips.filter((t) => !t.includes("vacina") && !t.includes("venceu")),
                `Vacina ${newVacName} aplicada em ${newVacDate}. Mantendo a carteira sempre protegida!`
              ]
            }
          };
        }
        return pet;
      })
    );

    earnPoints(10, `Vacina ${newVacName} Registrada`);
    setShowAddVaccine(false);
  };

  // Automatically check vaccine warnings to display on banner
  useEffect(() => {
    const expiredCount = pets.reduce((acc, pet) => {
      return acc + pet.vaccines.filter((v) => v.status === "Vencida").length;
    }, 0);

    if (expiredCount > 0) {
      // keep warning relevant
    }
  }, [pets]);

  const filteredProducts = INITIAL_PRODUCTS.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || prod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" id="main-app-container">
      {/* Dynamic Header with Notifications */}
      <NotificationBanner
        notifications={notifications}
        onDismiss={handleDismissNotification}
        onClearAll={handleClearAllNotifications}
      />

      {/* Main split viewport layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar applying Geometric Balance Emerald Theme */}
        <aside className="w-full md:w-64 bg-emerald-950 text-emerald-50 flex flex-col border-r border-emerald-900 shrink-0 select-none">
          <div className="p-5 sm:p-6 flex flex-col h-full justify-between">
            {/* Top Logo branding and burger toggle */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-400 rounded-lg flex items-center justify-center text-emerald-950 font-extrabold text-2xl shadow">
                    🐾
                  </div>
                  <div>
                    <span className="text-xl font-black tracking-tight block">PetCare</span>
                    <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold">Geometric Balance</span>
                  </div>
                </div>

                {/* Mobile Menu button toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1 text-emerald-200 hover:text-white md:hidden"
                  title="Menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>

              {/* Navigation Menu Links */}
              <nav className={`space-y-1 ${mobileMenuOpen ? "block" : "hidden md:block"}`}>
                {[
                  { id: "dashboard", label: "Painel Geral", icon: Activity },
                  { id: "scheduler", label: "Agendar Banho/Tosa", icon: Calendar },
                  { id: "pets", label: "Saúde & Prontuário", icon: Heart },
                  { id: "vitrine", label: "Vitrine Expressa", icon: ShoppingBag },
                  { id: "chat", label: "Tele-Medicina / Chat Vet", icon: MessageSquare },
                  { id: "clinicas", label: "Clínicas Parceiras", icon: MapPin },
                  { id: "fidelidade", label: "Clube Fidelidade", icon: Award },
                  { id: "perfil", label: "Pagamentos & Perfil", icon: User },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all ${
                        isActive
                          ? "bg-emerald-800 text-emerald-100 font-bold border-l-4 border-emerald-400 shadow-sm"
                          : "text-emerald-300 hover:bg-emerald-900/60 hover:text-emerald-50 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5 shrink-0" />
                      <span className="text-xs uppercase tracking-wider font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom active pet status widget */}
            <div className="pt-6 border-t border-emerald-900 mt-6 hidden md:block">
              <div className="flex items-center gap-3">
                <img
                  src={activePetObj.avatar}
                  alt={activePetObj.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
                  referrerPolicy="no-referrer"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-black truncate">{activePetObj.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-emerald-400/80 truncate font-semibold">
                    {activePetObj.breed}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Work Area Container */}
        <main className="flex-1 flex flex-col p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full gap-6">
          {/* Main Top Header Actions bar */}
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Portal do Tutor</p>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                Olá, Marina S. Oliveira!
              </h1>
              <p className="text-slate-500 font-medium mt-1 text-sm">
                Seus melhores amigos estão protegidos e felizes no PetCare. Seu fuso local indica: {new Date().toLocaleDateString("pt-BR")}.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Point box widget */}
              <button
                onClick={() => setActiveTab("fidelidade")}
                className="bg-white hover:bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xs text-left transition-all shrink-0"
              >
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none">Pontos Fidelidade</p>
                  <p className="text-lg font-black text-emerald-600 mt-0.5 flex items-center gap-0.5">
                    {loyaltyPoints} <span className="text-xs text-slate-400 font-normal">pts</span>
                  </p>
                </div>
                <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">
                  ★
                </div>
              </button>

              <button
                onClick={() => setActiveTab("scheduler")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider px-5 py-3 rounded-2xl shadow-lg shadow-emerald-100 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>+ Novo Banho & Tosa</span>
              </button>
            </div>
          </header>

          {/* Active Work Views Container */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {/* Tab 1: Dashboard View */}
              {activeTab === "dashboard" && (
                <motion.div
                  key="v-dash"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <Dashboard
                    pets={pets}
                    appointments={appointments}
                    loyaltyPoints={loyaltyPoints}
                    onNavigate={(tab) => setActiveTab(tab)}
                    onSelectPet={(petId) => setSelectedPetId(petId)}
                  />
                </motion.div>
              )}

              {/* Tab 2: Bath and Grooming Online Scheduler */}
              {activeTab === "scheduler" && (
                <motion.div
                  key="v-sched"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded-full tracking-wider">
                          Agendamento Imediato
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500 font-medium">Banhos, Tosas e Consultas Médicas</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Banho & Tosa Estética Online</h2>
                      <p className="text-slate-500 text-sm">
                        Escolha o pet, selecione a modalidade ideal de cuidados estéticos ou agende uma visita clínica presencial na unidade de sua conveniência.
                      </p>
                    </div>

                    {bookingSuccess && (
                      <div className="my-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800 text-sm">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Solicitação de Serviço Cadastrada com Sucesso!</p>
                          <p className="mt-1">
                            Lembrete automático enviado para o seu perfil e WhatsApp do tutor. Seu saldo de PetPoints foi atualizado. Prepare o pet para a visita!
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Booking Form Layout */}
                    <form onSubmit={handleNewBooking} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                          1. Selecione o Animal de Estimação
                        </label>
                        <select
                          value={schPetId}
                          onChange={(e) => setSchPetId(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                          {pets.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.type} - {p.breed})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                          2. Escolha o Serviço Estético ou Clínico
                        </label>
                        <select
                          value={schService}
                          onChange={(e) => setSchService(e.target.value as any)}
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                          <option value="Banho">Apenas Banho Higiênico (R$ 60,00)</option>
                          <option value="Tosa">Apenas Tosa Completa ou Higiênica (R$ 80,00)</option>
                          <option value="Combo Banho e Tosa">Combo Especial Banho & Tosa (R$ 120,00)</option>
                          <option value="Consulta Geral">Consulta Preventiva Geral com Clínico (R$ 180,00)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                          3. Escolha uma Clínica / Unidade Parceira
                        </label>
                        <select
                          value={schClinic}
                          onChange={(e) => setSchClinic(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                          {PARTNER_CLINICS.map((u) => (
                            <option key={u.id} value={u.name}>
                              {u.name} (Distância: {u.distance})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                            4st. Data Ideal
                          </label>
                          <input
                            type="date"
                            value={schDate}
                            onChange={(e) => setSchDate(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700"
                            min="2026-05-28"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                            Hora Disponível
                          </label>
                          <input
                            type="time"
                            value={schTime}
                            onChange={(e) => setSchTime(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex gap-3">
                          <input
                            type="checkbox"
                            checked={schHydrationReward}
                            onChange={(e) => setSchHydrationReward(e.target.checked)}
                            className="w-5.5 h-5.5 border-slate-300 rounded text-emerald-600 focus:ring-emerald-500 mt-0.5 sm:mt-0"
                            id="opt-hydration"
                          />
                          <div>
                            <label htmlFor="opt-hydration" className="font-bold text-xs sm:text-sm text-slate-800 block cursor-pointer">
                              Adicionar Hidratação Natural Antipruriginosa (+ R$ 20,00)
                            </label>
                            <span className="text-xs text-slate-500">
                              Tratamento dermatológico profundo recomendado pelo Dr. Rafael para prevenir coceiras de grama.
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-black bg-indigo-100 text-indigo-800 px-3 py-1 rounded">
                          Ganha +15 Pts de Fidelidade!
                        </span>
                      </div>

                      {/* Payment Options Section */}
                      <div className="md:col-span-2 border-t border-slate-100 pt-6 space-y-4">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                          5. Método de Pagamento e Checkout Seguro
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div
                            onClick={() => setPaymentMethod("online")}
                            className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                              paymentMethod === "online"
                                ? "border-emerald-500 bg-emerald-50/20"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <CreditCard className="w-5 h-5 text-emerald-600" />
                              <div>
                                <p className="font-bold text-sm text-slate-800">Pagar com Segurança Online</p>
                                <p className="text-xs text-emerald-600 font-semibold">Desconto de 5% + Ativação Flash de Pontos</p>
                              </div>
                            </div>
                            <span className={paymentMethod === "online" ? "text-emerald-500" : "text-gray-300"}>●</span>
                          </div>

                          <div
                            onClick={() => setPaymentMethod("local")}
                            className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                              paymentMethod === "local"
                                ? "border-emerald-500 bg-emerald-50/20"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <DollarSign className="w-5 h-5 text-slate-500" />
                              <div>
                                <p className="font-bold text-sm text-slate-800">Pagar na Recepção do Local</p>
                                <p className="text-xs text-slate-400">Cartão de Débito, Crédito ou Pix físico</p>
                              </div>
                            </div>
                            <span className={paymentMethod === "local" ? "text-emerald-500" : "text-gray-300"}>●</span>
                          </div>
                        </div>
                      </div>

                      {/* Form summary footer */}
                      <div className="md:col-span-2 bg-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                        <div>
                          <p className="text-xs text-slate-400 uppercase font-semibold">Valor Total a Pagar</p>
                          <p className="text-3xl font-black text-white">
                            R${" "}
                            {((schService === "Combo Banho e Tosa"
                              ? 120
                              : schService === "Tosa"
                              ? 80
                              : schService === "Consulta Geral"
                              ? 180
                              : 60) + (schHydrationReward ? 20 : 0) * (paymentMethod === "online" ? 0.95 : 1)).toFixed(2)}
                            {paymentMethod === "online" && (
                              <span className="text-xs text-emerald-400 block mt-1">✓ Desconto de 5% incluso</span>
                            )}
                          </p>
                        </div>

                        <button
                          type="submit"
                          className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-500 text-emerald-950 font-black uppercase text-xs tracking-widest py-4 px-8 rounded-xl shadow-lg transition-all"
                        >
                          {paymentMethod === "online" ? "Proceder para o Pagamento" : "Confirmar Agendamento Rápido"}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Detailed Health records: Pets vaccine, exam, advice */}
              {activeTab === "pets" && (
                <motion.div
                  key="v-pet"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Select active pet sub-header with creation option */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase mr-2 shrink-0">Filtrar Pet:</span>
                      {pets.map((p) => {
                        const isMatch = p.id === selectedPetId;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPetId(p.id)}
                            className={`p-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                              isMatch
                                ? "bg-emerald-900 text-emerald-50 shadow-xs"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            }`}
                          >
                            {p.name} ({p.type})
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setShowAddPet(!showAddPet)}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-300/40 text-slate-800 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors self-start md:self-center shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Cadastrar Novo Pet
                    </button>
                  </div>

                  {/* Add Pet Form Modal Drawer */}
                  {showAddPet && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md"
                    >
                      <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
                        <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Novo Cadastro Veterinário de Pet</h3>
                        <button onClick={() => setShowAddPet(false)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleAddPetSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Nome do Pet</label>
                          <input
                            type="text"
                            placeholder="Ex: Bento"
                            value={newPetName}
                            onChange={(e) => setNewPetName(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Espécie</label>
                          <select
                            value={newPetType}
                            onChange={(e) => setNewPetType(e.target.value as any)}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white"
                          >
                            <option value="Cão">Cão (Canina)</option>
                            <option value="Gato">Gato (Felina)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Raça</label>
                          <input
                            type="text"
                            placeholder="Ex: Golden Retriever"
                            value={newPetBreed}
                            onChange={(e) => setNewPetBreed(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Peso Corporal (kg)</label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="Ex: 12.5"
                            value={newPetWeight}
                            onChange={(e) => setNewPetWeight(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Nascimento aproximado</label>
                          <input
                            type="date"
                            value={newPetBirth}
                            onChange={(e) => setNewPetBirth(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Gênero</label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setNewPetGender("Macho")}
                              className={`flex-1 py-3 text-center rounded-xl text-xs font-bold border transition-all ${
                                newPetGender === "Macho"
                                  ? "bg-slate-800 text-white border-slate-900"
                                  : "bg-white border-slate-200"
                              }`}
                            >
                              Macho
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewPetGender("Fêmea")}
                              className={`flex-1 py-3 text-center rounded-xl text-xs font-bold border transition-all ${
                                newPetGender === "Fêmea"
                                  ? "bg-slate-800 text-white border-slate-900"
                                  : "bg-white border-slate-200"
                              }`}
                            >
                              Fêmea
                            </button>
                          </div>
                        </div>

                        <div className="md:col-span-3 pt-3 text-right">
                          <button
                            type="submit"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs uppercase font-black tracking-widest py-3 px-6 rounded-xl shadow-md"
                          >
                            Concluir Registro Inicial
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* Active Pet detailed prontuário */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Column 1: Health diagnostics, weight, activity score */}
                    <div className="space-y-6">
                      {/* Avatar Profile card of selected pet */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
                        <img
                          src={activePetObj.avatar}
                          alt={activePetObj.name}
                          className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-100 shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                        <h3 className="text-2xl font-black text-slate-900 mt-4 leading-none">{activePetObj.name}</h3>
                        <p className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">
                          {activePetObj.type} • {activePetObj.breed}
                        </p>

                        <div className="w-full mt-6 grid grid-cols-2 gap-3 pt-6 border-t border-slate-100">
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-[9px] text-slate-400 uppercase font-black block">Peso Atual</span>
                            <span className="text-lg font-black text-slate-800">{activePetObj.weight} kg</span>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-[9px] text-slate-400 uppercase font-black block">Idade</span>
                            <span className="text-xs font-bold text-slate-700 block mt-1 truncate">
                              Desde {new Date(activePetObj.birthDate).toLocaleDateString("pt-BR", { year: "numeric", month: "short" })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Health report recommendation block */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                            Metas & Relatório Personalizado
                          </h4>
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                        </div>

                        <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl">
                          <p className="text-[10px] text-emerald-800 uppercase font-extrabold tracking-wider">Metas Clínicas Ativas</p>
                          <div className="font-bold text-lg text-emerald-900 mt-1 flex items-center gap-1.5">
                            <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
                            {activePetObj.healthReport.generalStatus} ({activePetObj.healthReport.overallScore}%)
                          </div>
                        </div>

                        <div className="space-y-2">
                          {activePetObj.healthReport.tips.map((tip, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100/60 text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                              <span className="text-amber-500 font-bold shrink-0">•</span>
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2">
                          <span className="text-[9px] text-slate-400 block text-right font-medium">Último Check-up: {activePetObj.healthReport.lastUpdate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Interactive Vaccination Records card */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div>
                          <h3 className="text-xl font-black text-slate-900 leading-none">Carteira de Vacinação Integrada</h3>
                          <p className="text-xs text-slate-500 mt-1 font-medium">Histórico imunológico verificado pelo Dr. Rafael</p>
                        </div>

                        <button
                          onClick={() => setShowAddVaccine(!showAddVaccine)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs uppercase tracking-wider py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors self-start sm:self-center"
                        >
                          <Plus className="w-3.5 h-3.5" /> Registrar Vacina Fora do App
                        </button>
                      </div>

                      {showAddVaccine && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 bg-slate-50 border border-slate-200 rounded-2xl"
                        >
                          <h4 className="font-bold text-slate-800 text-sm mb-3">Registrar nova imunização:</h4>
                          <form onSubmit={handleAddVaccineSubmit} className="grid grid-cols-2 gap-3 text-xs">
                            <div className="col-span-2">
                              <label className="font-semibold text-slate-500 uppercase text-[9px] block mb-1">Nome da Vacina</label>
                              <select
                                value={newVacName}
                                onChange={(e) => setNewVacName(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                              >
                                <option value="V10 Múltipla Canina">V10 Múltipla Canina</option>
                                <option value="Quádrupla Felina (V4)">Quádrupla Felina (V4)</option>
                                <option value="Antirrábica">Antirrábica</option>
                                <option value="Gripe Canina (BronchiGuard)">Gripe Canina (BronchiGuard)</option>
                                <option value="Giardíase">Giardíase</option>
                              </select>
                            </div>

                            <div>
                              <label className="font-semibold text-slate-500 uppercase text-[9px] block mb-1">Data de Aplicação</label>
                              <input
                                type="date"
                                value={newVacDate}
                                onChange={(e) => setNewVacDate(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg p-2 text-slate-700 bg-white"
                              />
                            </div>

                            <div>
                              <label className="font-semibold text-slate-500 uppercase text-[9px] block mb-1">Próxima aplicação</label>
                              <input
                                type="date"
                                value={newVacNext}
                                onChange={(e) => setNewVacNext(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg p-2 text-slate-700 bg-white"
                              />
                            </div>

                            <div className="col-span-2">
                              <label className="font-semibold text-slate-500 uppercase text-[9px] block mb-1">Veterinário Responsável</label>
                              <input
                                type="text"
                                placeholder="Dra. Cláudia Melo"
                                value={newVacVet}
                                onChange={(e) => setNewVacVet(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                              />
                            </div>

                            <div className="col-span-2 text-right pt-2">
                              <button
                                type="submit"
                                className="bg-emerald-600 text-white px-4 py-2 font-bold rounded-lg uppercase tracking-wider"
                              >
                                Adicionar Dose Registrada
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      )}

                      {/* Vaccines List */}
                      {activePetObj.vaccines.length === 0 ? (
                        <div className="text-center py-8 text-sm text-gray-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                          Nenhuma vacinação registrada no prontuário ainda. <br /> Use o agendamento ou adicione manualmente acima.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activePetObj.vaccines.map((vac) => {
                            const isExpired = vac.status === "Vencida";
                            const isWarning = vac.status === "Próxima da data";
                            return (
                              <div
                                key={vac.id}
                                className={`p-4 rounded-2xl border ${
                                  isExpired
                                    ? "bg-red-50/40 border-red-200"
                                    : isWarning
                                    ? "bg-amber-50/40 border-amber-200"
                                    : "bg-slate-50/40 border-slate-200"
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{vac.name}</h4>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Aplicado por: {vac.veterinarian}</p>
                                  </div>

                                  <span
                                    className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                      isExpired
                                        ? "bg-red-500 text-white animate-pulse"
                                        : isWarning
                                        ? "bg-amber-500 text-white"
                                        : "bg-emerald-100 text-emerald-800"
                                    }`}
                                  >
                                    {vac.status}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-dashed border-gray-200 text-[11px]">
                                  <div>
                                    <span className="text-slate-400 block uppercase text-[8px] font-bold">Data de Dose</span>
                                    <span className="font-bold text-slate-800">{new Date(vac.date).toLocaleDateString("pt-BR")}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block uppercase text-[8px] font-bold">Duplicação / Reforço</span>
                                    <span className={`font-black ${isExpired ? "text-red-600 underline" : "text-slate-800"}`}>
                                      {new Date(vac.nextDueDate).toLocaleDateString("pt-BR")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Exams History Section list */}
                      <div className="pt-4 border-t border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                          <Bookmark className="w-4.5 h-4.5 text-indigo-500" /> Histórico Clínico de Exames e Laudos
                        </h4>

                        {activePetObj.exams.length === 0 ? (
                          <p className="text-xs text-gray-500 italic bg-gray-50 rounded-xl p-4 text-center">Nenhum exame cadastrado no dossiê clínico.</p>
                        ) : (
                          <div className="space-y-3">
                            {activePetObj.exams.map((ex) => (
                              <div key={ex.id} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{ex.name}</span>
                                  <span className="text-[10px] font-bold text-slate-400">{ex.date}</span>
                                </div>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-white/70 p-2.5 rounded border border-slate-100/50 mt-2">{ex.result}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Consultations and notes history */}
                      <div className="pt-4 border-t border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                          <FileText className="w-4.5 h-4.5 text-emerald-500" /> Prontuário de Consultas e Receitas
                        </h4>

                        {activePetObj.consultations.length === 0 ? (
                          <p className="text-xs text-gray-500 italic bg-gray-50 rounded-xl p-4 text-center">Nenhum registro de consulta anterior.</p>
                        ) : (
                          <div className="space-y-4">
                            {activePetObj.consultations.map((con) => (
                              <div key={con.id} className="p-4 rounded-xl border border-dotted border-slate-300 bg-emerald-50/10 space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-extrabold text-slate-900 uppercase">{con.reason}</span>
                                  <span className="text-slate-400 font-bold">{con.date}</span>
                                </div>
                                <p className="text-xs text-slate-500">Médico Responsável: <span className="font-semibold text-slate-700">{con.vetName}</span></p>
                                <p className="text-xs text-slate-600 italic leading-relaxed">{con.notes}</p>

                                {con.prescriptions && con.prescriptions.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-gray-200/50">
                                    <span className="text-[9px] uppercase font-bold text-slate-400">Prescrições Ativas:</span>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                      {con.prescriptions.map((p, pIdx) => (
                                        <span key={pIdx} className="text-[10.5px] bg-indigo-50 border border-indigo-100 text-indigo-900 rounded px-2 py-0.5 font-medium">
                                          {p}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 4: Product express storefront */}
              {activeTab === "vitrine" && (
                <motion.div
                  key="v-vitrine"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Category switcher panel and Search search */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 leading-none">PetStore Express de 20 min</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Produtos premium selecionados sugeridos pelo seu vet para entrega rápida.</p>
                      </div>

                      {/* Live search input */}
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          placeholder="Buscar produtos..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full sm:w-64 border border-slate-200 rounded-xl p-2 px-3 pl-9 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-700"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-50">
                      {["Todos", "Alimentação", "Higiene", "Saúde", "Brinquedos", "Acessórios"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`p-2 px-4 rounded-xl text-xs font-bold transition-all ${
                            selectedCategory === cat
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}

                      {/* Header cart controller */}
                      <button
                        onClick={() => setCartOpen(true)}
                        className="ml-auto bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all relative"
                      >
                        <ShoppingCart className="w-4 h-4" /> Sacola ({cart.reduce((a, b) => a + b.quantity, 0)})
                        {cart.length > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white font-black rounded-full flex items-center justify-center text-[9px] animate-bounce">
                            {cart.length}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Products Grid layout */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col justify-between hover:shadow-md transition-all duration-300 relative group"
                      >
                        {prod.tag && (
                          <span className="absolute top-3 left-3 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full z-10 shadow-xs">
                            {prod.tag}
                          </span>
                        )}

                        <div className="space-y-3">
                          <div className="w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-100">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            {!prod.inStock && (
                              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                <span className="bg-red-500 text-white font-bold text-[9px] uppercase tracking-wider p-1.5 rounded-md">Reposição</span>
                              </div>
                            )}
                          </div>

                          <div>
                            <span className="text-[9.5px] text-slate-400 uppercase font-black tracking-wider block">{prod.category}</span>
                            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm mt-0.5 line-clamp-2 h-9 leading-tight">
                              {prod.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 leading-normal line-clamp-2">
                              {prod.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase">Preço</span>
                            <span className="text-sm font-black text-emerald-600">R$ {prod.price.toFixed(2)}</span>
                          </div>

                          <button
                            disabled={!prod.inStock}
                            onClick={() => handleAddToCart(prod)}
                            className={`p-2 rounded-xl transition-all ${
                              prod.inStock
                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white cursor-pointer"
                                : "bg-gray-100 text-gray-300 cursor-not-allowed"
                            }`}
                            title="Adicionar à sacola"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shopping cart side panel drawer overlay */}
                  {cartOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end z-50">
                      <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        className="w-full max-w-md bg-white h-full p-6 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
                            <h3 className="font-black text-slate-900 text-base uppercase tracking-tight flex items-center gap-2">
                              🐾 Sacola Expressa PetCare
                            </h3>
                            <button
                              onClick={() => setCartOpen(false)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <X className="w-6 h-6" />
                            </button>
                          </div>

                          {cart.length === 0 ? (
                            <div className="text-center py-12 space-y-2">
                              <p className="text-sm text-gray-500">Sua sacola está vazia.</p>
                              <button
                                onClick={() => setCartOpen(false)}
                                className="text-xs text-emerald-600 font-bold underline cursor-pointer"
                              >
                                Buscar produtos recomendados
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                              {cart.map((item) => (
                                <div key={item.product.id} className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-12 h-12 rounded-lg object-cover bg-white"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-extrabold text-xs text-slate-900 truncate">{item.product.name}</h4>
                                    <p className="text-[10px] text-slate-400 uppercase mt-0.5">{item.product.category}</p>
                                    <div className="flex justify-between items-center mt-2">
                                      <span className="text-xs font-semibold text-slate-500">Qtd: {item.quantity}</span>
                                      <span className="text-xs font-black text-emerald-600">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveFromCart(item.product.id)}
                                    className="text-red-500 hover:text-red-600 p-1 shrink-0 self-center"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {cart.length > 0 && (
                          <div className="border-t border-gray-100 pt-6 space-y-4">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-bold uppercase text-slate-400">Total parcial</span>
                              <span className="text-2xl font-black text-slate-950">R$ {calculateTotal().toFixed(2)}</span>
                            </div>

                            <button
                              onClick={handleCheckoutCart}
                              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-xs tracking-widest py-4 rounded-xl shadow-lg shadow-emerald-100 transition-all cursor-pointer"
                            >
                              Finalizar Pedido com Pagamento Seguro
                            </button>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab 5: Vet Telemedicine smart consult image chat */}
              {activeTab === "chat" && (
                <motion.div
                  key="v-chat"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm h-[650px]" id="chat-container">
                    {/* Left chat user / training guidance panel */}
                    <div className="lg:col-span-4 bg-slate-50 p-6 flex flex-col justify-between border-r border-slate-100">
                      <div className="space-y-5">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-[9.5px] font-black uppercase rounded-full tracking-wider">
                          Veterinário na Linha
                        </span>
                        <h2 className="text-xl font-black text-slate-900 leading-none">Canal Médico de Contato Direto</h2>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Tire dúvidas urgentes em tempo real com nossos médicos veterinários pós-graduados. Envie fotos dos sintomas visíveis do {activePetObj.name} para uma pré-triagem ágil e diagnósticos sugestivos de primeiros socorros.
                        </p>

                        <div className="p-4 bg-white rounded-2xl border border-slate-200/60 space-y-3">
                          <p className="font-bold text-xs text-slate-800">Dica de Triagem Visual Inteligente:</p>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Você pode anexar imagens clínicas clicando na câmera fotográfica abaixo para realizar exames preliminares e receber laudos descritivos.
                          </p>

                          {/* Quick training images simulation selection */}
                          <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-2">Fotos de Demo Para Teste:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {DEMO_PHOTOS.map((dp, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setUploadedBase64Image(dp.url)}
                                className="p-1.5 border border-slate-100 hover:border-emerald-500 rounded-xl bg-white text-left transition-all"
                              >
                                <img
                                  src={dp.url}
                                  alt={dp.label}
                                  className="w-full h-10 object-cover rounded-md"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="text-[9.5px] font-extrabold text-slate-700 block mt-1 truncate">{dp.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>A triagem virtual descritiva visa suporte de emergência preliminar. Em persistência, encaminhe o pet a um check-up físico presencial.</span>
                      </div>
                    </div>

                    {/* Chat engine inside Geometric Balance Slate Dark Theme styling as in design template */}
                    <div className="lg:col-span-8 bg-slate-950 font-sans p-6 flex flex-col justify-between text-slate-300 relative h-full">
                      {/* Back filter background glow */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-slate-900/40 rounded-bl-[100px] pointer-events-none" />

                      <div className="flex justify-between items-center pb-4 border-b border-slate-800 z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                          <span className="text-white text-sm font-bold">Dr. Rafael Silva - Plantonista Ativo</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-black">Telemedicina Veterinária</span>
                      </div>

                      {/* Message lists viewport scroll container */}
                      <div className="flex-1 overflow-y-auto space-y-4 py-6 pr-1">
                        {chatMessages.map((msg) => {
                          const isVet = msg.sender === "vet";
                          return (
                            <div
                              key={msg.id}
                              className={`flex gap-3 max-w-[85%] ${
                                isVet ? "" : "ml-auto flex-row-reverse"
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 select-none ${
                                  isVet ? "bg-emerald-600 text-white" : "bg-indigo-600 text-white"
                                }`}
                              >
                                {isVet ? "V" : "M"}
                              </div>

                              <div className="space-y-1">
                                <div
                                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                                    isVet
                                      ? "bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800"
                                      : "bg-emerald-700 text-white rounded-tr-none"
                                  }`}
                                >
                                  {msg.imageUrl && (
                                    <div className="mb-2 max-w-xs rounded-xl overflow-hidden border border-white/10">
                                      <img
                                        src={msg.imageUrl}
                                        alt="Foto inserida para triagem"
                                        className="w-full h-32 object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                      <span className="text-[8px] bg-black/60 text-emerald-400 font-semibold p-1 px-2 uppercase tracking-wider block">Região sob avaliação</span>
                                    </div>
                                  )}
                                  <p>{msg.text}</p>
                                </div>
                                <span className="text-[8.5px] text-slate-500 block text-right font-medium">{msg.timestamp}</span>
                              </div>
                            </div>
                          );
                        })}

                        {chatLoading && (
                          <div className="flex gap-2 items-center text-slate-400 text-xs italic">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                            <span>Dr. Rafael está analisando a foto e preparando seu parecer médico...</span>
                          </div>
                        )}
                      </div>

                      {/* Photo preview widget when preparing to send */}
                      {uploadedBase64Image && (
                        <div className="p-2 mb-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between z-10 max-w-xs">
                          <div className="flex items-center gap-2">
                            <img
                              src={uploadedBase64Image}
                              alt="Anexo"
                              className="w-10 h-10 object-cover rounded-lg"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-emerald-400 block font-bold">Imagem Anexada</span>
                              <span className="text-[8px] text-slate-500 block truncate">pata_bento_diagnostico.jpg</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setUploadedBase64Image(null)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1 rounded-sm cursor-pointer"
                            title="Remover foto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Input Actions row bar */}
                      <div className="bg-slate-900 rounded-2xl p-3 flex items-center gap-3 border border-slate-800/80 z-10">
                        <label className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center relative shrink-0">
                          <Camera className="w-5 h-5" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>

                        <input
                          type="text"
                          placeholder="Digite aqui sua dúvida de saúde ou sintoma..."
                          value={currentMessageText}
                          onChange={(e) => setCurrentMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSendMessage();
                          }}
                          className="flex-1 bg-transparent border-none text-white text-xs sm:text-sm focus:outline-none placeholder-slate-500"
                        />

                        <button
                          onClick={handleSendMessage}
                          className="p-2 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 rounded-xl font-bold text-xs uppercase tracking-wider px-4 shrink-0 transition-all cursor-pointer"
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 6: Interactive mini clinics search map and appointment scheduling */}
              {activeTab === "clinicas" && (
                <motion.div
                  key="v-map"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Clinics list columns on left */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 leading-none">Clínicas e Hospitais Parceiros</h2>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Selecione uma clínica para visualização no mapa integrado</p>
                      </div>

                      {PARTNER_CLINICS.map((clinic) => {
                        const isSelected = clinic.id === selectedClinic.id;
                        return (
                          <div
                            key={clinic.id}
                            onClick={() => setSelectedClinic(clinic)}
                            className={`p-4 bg-white border rounded-3xl cursor-pointer transition-all ${
                              isSelected
                                ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/10"
                                : "border-slate-200 shadow-xs hover:border-slate-300"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="font-extrabold text-sm text-slate-950">{clinic.name}</h3>
                              <span className="text-[9.5px] bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-600 shrink-0">
                                {clinic.distance}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 mt-1.5 leading-snug">{clinic.address}</p>

                            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
                              <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                              <span className="font-bold text-slate-700">{clinic.rating}</span>
                              <span>({clinic.reviews} avaliações)</span>
                            </div>

                            <div className="flex flex-wrap gap-1 mt-3">
                              {clinic.services.map((srv, sIdx) => (
                                <span key={sIdx} className="text-[8.5px] font-bold bg-slate-50 text-slate-600 rounded px-1.5 py-0.5 border border-slate-100">
                                  {srv}
                                </span>
                              ))}
                            </div>

                            {/* Direct click booking button */}
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                              <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-1">
                                <Phone className="w-3 h-3 text-indigo-500" /> {clinic.phone}
                              </span>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSchClinic(clinic.name);
                                  setActiveTab("scheduler");
                                }}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[9.5px] uppercase tracking-wider py-1.5 px-3 rounded-lg flex items-center justify-center gap-0.5 transition-colors cursor-pointer"
                              >
                                Agendar Visita
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Interactive Simulated Map vector visual canvas */}
                    <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[500px]">
                      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                        <div>
                          <h3 className="text-base font-black text-slate-1000">Mapa de Cobertura São Paulo</h3>
                          <p className="text-xs text-slate-400">Visualização de clínicas credenciadas para vacinação anual e exames preventivos</p>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none bg-slate-100 px-3 py-1.5 rounded-full">
                          Localização atual: Jardins, SP
                        </span>
                      </div>

                      {/* Map Vector Graphic Canvas */}
                      <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl relative my-4 overflow-hidden min-h-[350px]">
                        {/* Map decorative grid gridlines */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:30px_30px] opacity-60" />

                        {/* Visual mockup of roads */}
                        <svg className="absolute inset-0 w-full h-full stroke-slate-300 stroke-2 opacity-50" fill="none">
                          <line x1="10%" y1="0%" x2="10%" y2="100%" />
                          <line x1="50%" y1="0%" x2="55%" y2="100%" />
                          <line x1="85%" y1="0%" x2="80%" y2="100%" />
                          <line x1="0%" y1="40%" x2="100%" y2="40%" />
                          <line x1="0%" y1="70%" x2="100%" y2="70%" />
                        </svg>

                        {/* Interactive Markers for Clinics */}
                        {PARTNER_CLINICS.map((clinic) => {
                          const isActive = clinic.id === selectedClinic.id;
                          return (
                            <button
                              key={clinic.id}
                              onClick={() => setSelectedClinic(clinic)}
                              style={{ left: `${clinic.lng}%`, top: `${clinic.lat}%` }}
                              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10"
                              title={clinic.name}
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all ${
                                  isActive
                                    ? "bg-emerald-600 text-white scale-110 ring-4 ring-emerald-500/20"
                                    : "bg-white border-2 border-slate-300 hover:border-emerald-500 text-slate-700"
                                }`}
                              >
                                🐾
                              </div>

                              <span
                                className={`mt-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs w-28 text-center truncate ${
                                  isActive
                                    ? "bg-slate-900 text-white"
                                    : "bg-white text-slate-800 border border-slate-100 opacity-80 group-hover:opacity-100"
                                }`}
                              >
                                {clinic.name.split(" ")[1] || clinic.name}
                              </span>
                            </button>
                          )}
                        )}

                        {/* User current location pointer marker */}
                        <div className="absolute left-[30%] top-[45%] transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-20">
                          <div className="w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow animate-ping absolute" />
                          <div className="w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow relative" />
                          <span className="text-[8px] bg-blue-900 text-white font-black uppercase px-2 py-0.5 rounded mt-1 block">Você</span>
                        </div>
                      </div>

                      {/* Map Footer card detail */}
                      <div className="p-4 bg-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">Credenciamento Selecionado</p>
                          <h4 className="font-bold text-sm text-white">{selectedClinic.name}</h4>
                          <p className="text-xs text-slate-400 font-light">{selectedClinic.address}</p>
                        </div>

                        <button
                          onClick={() => {
                            setSchClinic(selectedClinic.name);
                            setActiveTab("scheduler");
                          }}
                          className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-500 text-emerald-950 font-black uppercase text-xs tracking-widest py-3 px-6 rounded-lg shadow-sm transition-all text-center shrink-0"
                        >
                          Agendar Consulta Presencial
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 7: Loyalty points voucher redeemer */}
              {activeTab === "fidelidade" && (
                <motion.div
                  key="v-loy"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <LoyaltyManager
                    points={loyaltyPoints}
                    onRedeemPoints={handleRedeemPoints}
                  />
                </motion.div>
              )}

              {/* Tab 8: User profiling, security cards checkout tracker */}
              {activeTab === "perfil" && (
                <motion.div
                  key="v-perf"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* User profile view card */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 text-3xl font-bold select-none border-4 border-slate-50">
                          MO
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mt-4 leading-none">Marina S. Oliveira</h3>
                        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{pets.length} Animais cadastrados</p>
                      </div>

                      <div className="space-y-3 pt-6 border-t border-slate-100 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400 uppercase font-black tracking-wider text-[9px]">E-mail</span>
                          <span className="font-semibold text-slate-700">j07081526@gmail.com</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 uppercase font-black tracking-wider text-[9px]">Contato</span>
                          <span className="font-semibold text-slate-700">(11) 98112-4422</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 uppercase font-black tracking-wider text-[9px]">Endereço</span>
                          <span className="font-semibold text-slate-700 text-right truncate max-w-[150px]">Av. Paulista, 1000 - Bela Vista - SP</span>
                        </div>
                      </div>
                    </div>

                    {/* Credit saved cards visual card manager */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                      <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Cartão de Crédito de Segurança</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">Simplifique checkouts virtuais de exames e banhos sem digitação repetida.</p>

                      {/* Saved credit card visualization */}
                      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                          <CreditCard className="w-8 h-8 text-indigo-200" />
                          <span className="text-xs italic tracking-widest font-bold">VISA DE CABINE</span>
                        </div>

                        <div>
                          <p className="text-base font-mono tracking-widest text-slate-100">{creditCardNumber}</p>
                          <div className="flex justify-between items-end mt-4 text-[10px]">
                            <div>
                              <span className="text-slate-400 text-[8px] uppercase block">Titular</span>
                              <span className="font-bold truncate text-white">{creditCardName}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[8px] uppercase block">Validade</span>
                              <span className="font-bold whitespace-nowrap text-white">{creditCardExpiry}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Manual Card Reconfiguration triggers */}
                      <button
                        onClick={() => {
                          const num = prompt("Ajustar número do cartão de crédito (para simulação):", creditCardNumber);
                          if (num) setCreditCardNumber(num);
                        }}
                        className="w-full text-center text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 py-3 rounded-xl transition-all"
                      >
                        Reconfigurar Cartão de Pagamento
                      </button>
                    </div>

                    {/* Quick transactional security invoices history logs count */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Últimas Transações de Checkout</h3>

                        <div className="space-y-2.5">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                            <div className="space-y-0.5">
                              <p className="font-extrabold text-slate-800">Combo Banho e Tosa (Mel)</p>
                              <p className="text-[10px] text-slate-400">Código: TX-8820 • Pago Seguro</p>
                            </div>
                            <span className="font-black text-emerald-600">R$ 120,00</span>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                            <div className="space-y-0.5">
                              <p className="font-extrabold text-slate-800">Ração Guabi Premium (PetStore)</p>
                              <p className="text-[10px] text-slate-400">Código: TX-PROD-221 • Pago Seguro</p>
                            </div>
                            <span className="font-black text-emerald-600">R$ 249,90</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-indigo-50/50 border border-indigo-100/40 p-3.5 rounded-2xl text-[11px] text-indigo-800 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                        <span>Todas as transações do applet são auditadas com criptografia de ponta a ponta.</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* SECURE ONLINE PAYMENT GATEWAY DIALOG OVERLAY SCREEN SIMULATOR */}
      {isPayingOnline && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
          >
            {/* Visual aesthetic top banner inside overlay */}
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-emerald-500 to-indigo-600" />

            <div className="flex justify-between items-start pt-2">
              <div className="flex items-center gap-2.5">
                <div className="text-emerald-500 p-1.5 bg-emerald-50 rounded-lg shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-950 text-base leading-none">Gateway de Transação Certificado PetCare</h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">ID de Transação: TX-9081-{Math.floor(Math.random() * 90000)}</p>
                </div>
              </div>

              <button
                onClick={() => setIsPayingOnline(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Detail panel */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black">Cobrança Comercial</span>
                <span className="font-bold text-slate-800 block text-xs truncate">PetCare Serviços Integrados S/A</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-black">Valor a Consignar</span>
                <span className="font-black text-lg text-emerald-600 block">R$ {pendingPaymentAmount.toFixed(2)}</span>
              </div>
            </div>

            {payConfirmationCode ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                  ✨
                </div>
                <h4 className="text-lg font-black text-slate-950">Pagamento Aprovado com Sucesso!</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Sua fatura foi liquidada com segurança. Extrato de código de processamento bancário: <br />
                  <span className="font-bold text-gray-800 font-mono select-all">{payConfirmationCode}</span>
                </p>
                <p className="text-[10.5px] text-emerald-600 font-semibold">Parabéns! Pontos extras creditados no seu Clube de Fidelidade!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">Número do Cartão de Crédito</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 font-mono text-slate-400 text-xs">CNV</span>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl p-3.5 pl-12 text-sm font-mono tracking-widest text-slate-800"
                      value={creditCardNumber}
                      onChange={(e) => setCreditCardNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">Vencimento (MM/AA)</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl p-3.5 text-center text-sm"
                      value={creditCardExpiry}
                      onChange={(e) => setCreditCardExpiry(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">Código CVV</label>
                    <input
                      type="password"
                      maxLength={3}
                      className="w-full border border-slate-200 rounded-xl p-3.5 text-center text-sm font-mono"
                      value={creditCardCVV}
                      onChange={(e) => setCreditCardCVV(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">Nome do Titular Impresso</label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-xl p-3.5 text-sm uppercase text-slate-800 font-bold"
                    value={creditCardName}
                    onChange={(e) => setCreditCardName(e.target.value)}
                  />
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[10px] text-gray-400 text-center sm:text-left">
                    🔒 Criptografia SSL AES-256 ativa. <br /> Segurança certificada PCI-DSS Nível 1.
                  </span>

                  <button
                    onClick={() => {
                      if (cart.length > 0) {
                        confirmCartPurchase();
                      } else {
                        confirmOnlineBookingPayment();
                      }
                    }}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-950 text-white font-black text-xs uppercase tracking-widest py-4 px-8 rounded-xl shadow-lg transition-all text-center cursor-pointer"
                  >
                    Confirmar Transação Segura
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
