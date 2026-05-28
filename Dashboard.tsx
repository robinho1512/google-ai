import React from "react";
import { Pet, Appointment } from "../types";
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
  ShieldAlert,
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  pets: Pet[];
  appointments: Appointment[];
  loyaltyPoints: number;
  onNavigate: (tab: string) => void;
  onSelectPet: (petId: string) => void;
}

export default function Dashboard({
  pets,
  appointments,
  loyaltyPoints,
  onNavigate,
  onSelectPet,
}: DashboardProps) {
  // Filter confirmed upcoming scheduled events
  const upcomingEvents = appointments.filter((app) => app.status === "Confirmado");

  // Sum total registered active vaccines and critical vaccine warnings
  const nextVaccinesToTake = pets.reduce((acc, pet) => {
    const alerts = pet.vaccines.filter((v) => v.status === "Vencida" || v.status === "Próxima da data");
    return acc + alerts.length;
  }, 0);

  return (
    <div className="space-y-6" id="dashboard-view-wrapper">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="absolute right-0 bottom-0 top-0 opacity-15 hidden md:block">
          <svg width="400" height="100%" viewBox="0 0 400 400" fill="none">
            <circle cx="250" cy="250" r="150" stroke="white" strokeWidth="20" />
            <circle cx="280" cy="180" r="80" stroke="white" strokeWidth="15" />
            <path d="M120,350 Q180,280 250,340" stroke="white" strokeWidth="15" strokeLinecap="round" />
          </svg>
        </div>
        <div className="max-w-xl relative z-10 space-y-3">
          <span className="bg-white/20 text-white font-semibold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
            Tudo em um só lugar
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-white">
            Seu Pet Feliz e Saudável
          </h1>
          <p className="text-amber-50 text-sm sm:text-base font-light">
            Monitore vacinas, consulte nossos veterinários via chat inteligente com foto, agende banhos e compre produtos com entrega expressa.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => onNavigate("scheduler")}
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" /> Agendar Banho e Tosa
            </button>
            <button
              onClick={() => onNavigate("chat")}
              className="bg-orange-600 text-white border border-orange-400/40 hover:bg-orange-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" /> Telemedicina / Chat Vet
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pets Count */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Meus Pets</span>
            <p className="text-2xl font-black text-gray-800">{pets.length}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Heart className="w-6 h-6 fill-amber-100" />
          </div>
        </div>

        {/* Loyalty Balance */}
        <div
          onClick={() => onNavigate("fidelidade")}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all group"
        >
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Saldo PetPoints</span>
            <p className="text-2xl font-black text-indigo-600 flex items-center gap-1">
              {loyaltyPoints}
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Appointments */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Serviços Agendados</span>
            <p className="text-2xl font-black text-gray-800">{upcomingEvents.length}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Vaccine Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Avisos de Saúde</span>
            <p className="text-2xl font-black text-gray-800">
              {nextVaccinesToTake > 0 ? (
                <span className="text-red-500 font-extrabold">{nextVaccinesToTake} pendentes</span>
              ) : (
                <span className="text-emerald-600 font-semibold text-base">Tudo Ok! ✨</span>
              )}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${nextVaccinesToTake > 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Health Reports and Upcomings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health status list */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" /> Relatório Rápido de Saúde
            </h2>
            <button
              onClick={() => onNavigate("pets")}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-0.5"
            >
              Mais detalhes <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {pets.map((pet) => (
              <div key={pet.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={pet.avatar}
                    alt={pet.name}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base flex items-center gap-1.5">
                      {pet.name}
                      <span className="text-xs font-normal text-gray-400">
                        {pet.breed}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Status: <span className="font-semibold text-emerald-600">{pet.healthReport.generalStatus}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block uppercase font-medium">Índice Geral</span>
                    <span className="text-base font-black text-gray-700">{pet.healthReport.overallScore}%</span>
                  </div>
                  {/* Circular health meter */}
                  <div className="relative w-10 h-10">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500"
                        strokeDasharray={`${pet.healthReport.overallScore}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                  </div>
                  <button
                    onClick={() => {
                      onSelectPet(pet.id);
                      onNavigate("pets");
                    }}
                    className="p-1 px-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-600 transition-colors"
                  >
                    Acessar Prontuário
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming schedules reminders list */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" /> Próximos Banhos e Consultas
            </h2>

            {upcomingEvents.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-50 rounded-xl space-y-2">
                <p className="text-sm text-gray-500">Nenhum serviço agendado.</p>
                <button
                  onClick={() => onNavigate("scheduler")}
                  className="text-xs text-amber-600 hover:text-amber-700 font-bold underline"
                >
                  Agendar Banho Agora
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.slice(0, 3).map((app) => (
                  <div key={app.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-xs text-amber-600 font-semibold">{app.serviceType}</p>
                      <p className="text-sm font-bold text-gray-800">{app.petName}</p>
                      <p className="text-xs text-gray-400">{app.clinicName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-800 block">{app.date}</span>
                      <span className="text-xs text-gray-500">{app.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <button
              onClick={() => onNavigate("perfil")}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-bold uppercase tracking-wider"
            >
              Ver Seu Histórico Completo
            </button>
          </div>
        </div>
      </div>

      {/* Grid Quick Navigation Shortcuts */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">Ações Rápidas de Integração</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigate("scheduler")}
            className="p-4 rounded-xl hover:bg-amber-50/50 hover:border-amber-200 border border-gray-100 text-center flex flex-col items-center gap-2 transition-all cursor-pointer"
          >
            <Calendar className="w-6 h-6 text-orange-500" />
            <span className="text-xs font-bold text-gray-800">Agendar Banho</span>
          </button>
          <button
            onClick={() => onNavigate("chat")}
            className="p-4 rounded-xl hover:bg-amber-50/50 hover:border-amber-200 border border-gray-100 text-center flex flex-col items-center gap-2 transition-all cursor-pointer"
          >
            <MessageSquare className="w-6 h-6 text-blue-500" />
            <span className="text-xs font-bold text-gray-800">Conversar com Vet</span>
          </button>
          <button
            onClick={() => onNavigate("vitrine")}
            className="p-4 rounded-xl hover:bg-amber-50/50 hover:border-amber-200 border border-gray-100 text-center flex flex-col items-center gap-2 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-6 h-6 text-emerald-500" />
            <span className="text-xs font-bold text-gray-800">Vitrine Expressa</span>
          </button>
          <button
            onClick={() => onNavigate("clinicas")}
            className="p-4 rounded-xl hover:bg-amber-50/50 hover:border-amber-200 border border-gray-100 text-center flex flex-col items-center gap-2 transition-all cursor-pointer"
          >
            <MapPin className="w-6 h-6 text-red-500" />
            <span className="text-xs font-bold text-gray-800">Mapa Parceiras</span>
          </button>
          <button
            onClick={() => {
              onNavigate("pets");
            }}
            className="p-4 rounded-xl hover:bg-amber-50/50 hover:border-amber-200 border border-gray-100 text-center flex flex-col items-center gap-2 transition-all cursor-pointer col-span-2 sm:col-span-1"
          >
            <Plus className="w-6 h-6 text-indigo-500" />
            <span className="text-xs font-bold text-gray-800">Cadastrar Novo Pet</span>
          </button>
        </div>
      </div>
    </div>
  );
}
