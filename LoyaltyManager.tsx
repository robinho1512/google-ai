import React, { useState } from "react";
import { Award, CheckCircle, Gift, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface LoyaltyManagerProps {
  points: number;
  onRedeemPoints: (amount: number, rewardName: string) => void;
}

interface RewardOption {
  id: string;
  name: string;
  cost: number;
  description: string;
  category: "Banho" | "Veterinário" | "Acessórios" | "Tratamento";
}

export default function LoyaltyManager({ points, onRedeemPoints }: LoyaltyManagerProps) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const REWARDS: RewardOption[] = [
    {
      id: "rew-1",
      name: "Banho Hidratante de Mel & Aveia",
      cost: 150,
      description: "Um banho perfumado e tratamento hidratante relaxante para acalmar a pele sensível.",
      category: "Banho",
    },
    {
      id: "rew-2",
      name: "Cupom R$ 25 de Desconto em Brinquedos",
      cost: 200,
      description: "Válido para qualquer brinquedo selecionado da nossa vitrine no aplicativo.",
      category: "Acessórios",
    },
    {
      id: "rew-3",
      name: "Consulta Especialista Preventiva (Voucher)",
      cost: 500,
      description: "Garante 50% de desconto em consultas de especialistas (oftalmologista, dermatologista ou cardiologista).",
      category: "Veterinário",
    },
    {
      id: "rew-4",
      name: "Kit Higiene Bucal Premium PetCare",
      cost: 350,
      description: "Contém escova anatômica, dedeira de silicone e gel dental específico sabor menta/carne.",
      category: "Tratamento",
    },
  ];

  const handleRedeem = (reward: RewardOption) => {
    if (points >= reward.cost) {
      onRedeemPoints(reward.cost, reward.name);
      setSuccessMsg(`Parabéns! Você resgatou o prêmio: "${reward.name}". Código do voucher ativo: PET-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      setTimeout(() => setSuccessMsg(null), 8000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm" id="loyalty-manager-card">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Award className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Clube de Fidelidade
              <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                PetPoints
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Agende serviços, compre rações ou adicione vacinas para acumular pontos de saúde!
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-xl px-6 py-4 text-white text-center md:text-right flex flex-col justify-center min-w-[200px]">
          <span className="text-xs text-indigo-100 uppercase font-semibold tracking-wider">Seu Saldo Ativo</span>
          <span className="text-3xl font-extrabold flex items-center justify-center md:justify-end gap-1.5 mt-1">
            <Sparkles className="w-6 h-6 text-amber-300 animate-pulse fill-amber-300" />
            {points} <span className="text-sm text-indigo-100 font-normal">pts</span>
          </span>
        </div>
      </div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 mt-6 text-sm flex items-start gap-3"
        >
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Resgate concluído com sucesso!</p>
            <p className="mt-1 text-emerald-700">{successMsg}</p>
          </div>
        </motion.div>
      )}

      {/* Rules Breakdown */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" /> Como Funciona o Acúmulo?
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
            <span className="text-indigo-600 font-bold text-base block">+15 PTS</span>
            <span className="text-xs text-gray-500 font-medium">Banho ou Tosa</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
            <span className="text-indigo-600 font-bold text-base block">+50 PTS</span>
            <span className="text-xs text-gray-500 font-medium">Consultas Veterinárias</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
            <span className="text-indigo-600 font-bold text-base block">+10 PTS</span>
            <span className="text-xs text-gray-500 font-medium">Vacinas Registradas</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
            <span className="text-indigo-600 font-bold text-base block">10% Cash-Pts</span>
            <span className="text-xs text-gray-500 font-medium">1 ponto por R$ 10 em compras</span>
          </div>
        </div>
      </div>

      {/* Rewards Showcase */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Gift className="w-4 h-4 text-indigo-600" /> Prêmios Disponíveis para Troca:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REWARDS.map((reward) => {
            const canClaim = points >= reward.cost;
            return (
              <div
                key={reward.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  canClaim
                    ? "border-indigo-100 bg-indigo-50/20 hover:shadow-md"
                    : "border-gray-100 bg-gray-50 opacity-75"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      {reward.category}
                    </span>
                    <span className="font-extrabold text-sm text-indigo-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {reward.cost} pts
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{reward.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{reward.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
                  <button
                    disabled={!canClaim}
                    onClick={() => handleRedeem(reward)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                      canClaim
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {canClaim ? "Resgatar Prêmio" : `Faltam ${reward.cost - points} pontos`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
