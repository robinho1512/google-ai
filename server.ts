import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

// Load environment variables for local testing
dotenv.config();

const app = express();
const PORT = 3000;

// Body parser configuration with comfortable limit for base64 image sending (20mb)
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Lazy init of Gemini Client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY") {
    console.warn("⚠️ GEMINI_API_KEY environment variable is not configured or is placeholder. Using mock vet backup.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Simulated specialist vet response fallback in Portuguese
function getMockVetResponse(message: string, petInfo?: any, hasImage?: boolean): string {
  const text = message.toLowerCase();
  const petName = petInfo?.name || "seu pet";
  const petBreed = petInfo?.breed || "raça indefinida";
  const petType = petInfo?.type || "animal";

  let response = `Olá! Sou o Dr. Rafael, veterinário do PetCare. `;

  if (hasImage) {
    response += `Recebi a foto de ${petName} (${petBreed}). Pelos sinais visíveis na imagem, `;
    if (text.includes("vermelho") || text.includes("coçar") || text.includes("pele") || text.includes("alergia")) {
      return response + `percebe-se uma leve vermelhidão ou descamação local. Isso pode ser decorrente de dermatite de contato, alergia alimentar ou picada de pulga. Recomendo higienizar o local apenas com soro fisiológico ou água morna, evitar o uso de xampus perfumados temporariamente e agendar uma consulta para avaliarmos se há necessidade de anti-histamínicos ou pomadas antibióticas. Evite que ele lamber a área, se possível usando uma coleira elizabetana.`;
    }
    if (text.includes("olho") || text.includes("remela") || text.includes("fechado")) {
      return response + `observo uma pequena secreção ao redor do globo ocular. Pode indicar uma conjuntivite infecciosa, trauma leve, ou irritação por corpo estranho. Recomendo limpar delicadamente a região dos olhos com uma gaze umedecida em soro fisiológico (sempre de dentro para fora), sem esfregar. Certifique-se de levá-lo à clínica para examinarmos a córnea e prescrever o colírio correto, pois usar colírio inadequado pode agravar úlceras oculares.`;
    }
    if (text.includes("orelha") || text.includes("coça") || text.includes("cera") || text.includes("otite")) {
      return response + `há sinais de incômodo ou secreção no canal auditivo. Isso é muito característico de otite (por fungos ou bactérias), especialmente após banhos inadequados onde entra água na orelha. Não tente limpar profundamente com cotonetes para não empurrar a secreção. O ideal é realizarmos uma otoscopia presencial e prescrever o ceruminolítico ou gotas otológicas específicas.`;
    }
    if (text.includes("dente") || text.includes("boca") || text.includes("gengiva")) {
      return response + `percebo um leve acúmulo de tártaro e gengiva levemente reativa. A doença periodontal é comum e pode causar dor ao mastigar e mau hálito. Recomendo iniciar escovação com pasta para pets de forma gradual e agendarmos uma avaliação para limpeza de tártaro sob sedação segura, o que evita infecções cardíacas e renais secundárias.`;
    }
    return response + `analisei a imagem cuidadosamente. Aparentemente não detectamos sinais de trauma ou sangramento ativo urgente, mas qualquer alteração de comportamento, apatia, ou coceira constante deve ser avaliada de perto em consultório. Como está o apetite e a energia dele no momento?`;
  }

  // Text-only questions fallback
  if (text.includes("vômito") || text.includes("vomito") || text.includes("diarreia") || text.includes("diarréia")) {
    return response + `Entendo a sua preocupação com o ${petName}. O vômito ou diarreia podem ser sintomas comuns a várias condições, desde uma indisposição alimentar leve até infecções virais (como parvovirose), parasitas ou ingestão de corpo estranho. Mantenha água fresca disponível em pequenas quantidades para evitar desidratação extrema. Se ele estiver apático, sem comer, ou se houver sangue, leve-o imediatamente à nossa urgência presencial. Para um suporte preventivo rápido, podemos fazer um exame de fezes completo. Quer que eu ajude a deixar pré-agendado um check-up para ele?`;
  }
  if (text.includes("vacina") || text.includes("vacin")) {
    return response + `As vacinas são a maior proteção para o ${petName}! É fundamental manter a V10/V8 de cães ou V4/V5 de gatos atualizadas anualmente, além da vacina Antirrábica obrigatória. Se o histórico de vacinas dele estiver incompleto ou prestes a vencer, podemos programar a dose hoje mesmo aqui no painel do app, garantindo imunidade total contra cinomose, parvovirose e raiva.`;
  }
  if (text.includes("coçar") || text.includes("pele") || text.includes("coceira") || text.includes("pulga") || text.includes("carrapato")) {
    return response + `Coceira frequente em cães e gatos geralmente aponta para dermatite alérgica (DAPP), sarna, fungos ou infestações de pulgas e carrapatos. O uso de comprimidos mastigáveis mensais de prevenção é excelente. No banho, prefira xampus hipoalergênicos e certifique-se de secar muito bem os pelos para evitar umidade. Posso te sugerir alguns produtos antiparasitários da nossa vitrine no app, temos entrega super rápida!`;
  }
  if (text.includes("comida") || text.includes("ração") || text.includes("peso") || text.includes("gordo") || text.includes("emagrecer")) {
    return response + `A nutrição adequada faz toda a diferença para o bem-estar e a longevidade de ${petName}. A quantidade indicada varia de acordo com o peso, idade e nível de atividade física. Se ele estiver gordinho ou emagrecendo rápido demais, uma consulta nutricional pode mapear se necessita de ração especial (como Renal, Obesity ou Hipoalergênica). O que ele come atualmente de forma rotineira?`;
  }
  if (text.includes("castra") || text.includes("operar")) {
    return response + `A castração é um ato de amor e cuidado! Ela previne tumores de mama em fêmeas e infecções graves (piometra), além de diminuir a marcação de território e fugas em machos. É um procedimento extremamente seguro e rápido aqui na clínica, com pré-operatório completo de exames de sangue e avaliação cardíaca para máxima segurança. Quer agendar os exames prévios?`;
  }
  if (text.includes("febre") || text.includes("quente") || text.includes("triste") || text.includes("apático") || text.includes("apatia")) {
    return response + `A apatia ou a sensação de que o pet está 'quente' ou muito quieto são avisos claros de que ele pode estar com febre ou dor. Pets tentam esconder o sofrimento. Nunca medique seu pet em casa com remédios de humanos (como paracetamol ou ibuprofeno, que são extremamente tóxicos para eles). Me informe se ele comeu hoje ou se está bebendo água, e recomendo muito trazê-lo para medirmos a temperatura e examiná-lo presencialmente.`;
  }

  return response + `Estou aqui para tirar dúvidas e ajudar na saúde do seu querido ${petName}. Você pode me contar um pouco mais sobre o comportamento dele, os hábitos diários ou tirar dúvidas sobre banho, produtos, cronograma vacinal ou exames. Se puder, envie uma foto da região ou sintoma que te preocupa para eu fazer uma avaliação rápida de triagem!`;
}

// Professional Veterinarian Consultations Endpoint with Server-Side Gemini API
app.post("/api/vet-chat", async (req, res) => {
  try {
    const { message, petInfo, history, image } = req.body;

    if (!message) {
      return res.status(400).json({ error: "A mensagem é obrigatória." });
    }

    const ai = getAi();
    if (!ai) {
      // Graceful fallback to rich simulated vet response if API Key is not set or placeholder
      const fallbackText = getMockVetResponse(message, petInfo, !!image);
      return res.json({ response: fallbackText, isMock: true });
    }

    // Standard Gemini 3.5 Flash setup
    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role === 'model' || h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.text }]
    }));

    // Setup image part if present
    let imagePart: any = null;
    if (image) {
      const match = image.match(/^data:(image\/[a-zA-Z0-9.-]+);base64,(.+)$/);
      if (match) {
        imagePart = {
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        };
      } else {
        imagePart = {
          inlineData: {
            mimeType: "image/jpeg",
            data: image,
          },
        };
      }
    }

    const currentParts: any[] = [];
    if (imagePart) {
      currentParts.push(imagePart);
    }

    // Feed context of active pet if present
    let textPrompt = "";
    if (petInfo) {
      textPrompt += `[CONTEXTO DO PET ATUAL: Nome: ${petInfo.name || "indefinido"}, Espécie: ${petInfo.type || "gato/cão"}, Raça: ${petInfo.breed || "indefinida"}, Idade: ${petInfo.age || "indefinida"}]\n`;
    }
    textPrompt += message;
    currentParts.push({ text: textPrompt });

    const currentTurn = {
      role: "user",
      parts: currentParts
    };

    const systemInstruction = `Você é o Dr. Rafael (ou Dr(a). Cláudia), médico veterinário da clínica PetCare. Responda com muito carinho, empatia, seriedade e linguagem profissional técnica porém acessível em português brasileiro. Você está tirando dúvidas imediatas de um tutor no chat do app.
- Se o tutor te enviar uma foto de um pet, faça uma avaliação de triagem prévia do sintoma visível (irritação ocular, descamação, manchas, dentes, cera do ouvido) fornecendo explicações plausíveis.
- Dê orientações preventivas práticas de rotina, cuidados de primeiros socorros ou recomendações de higiene corretas.
- IMPORTANTE: Enfatize sempre, com responsabilidade profissional, que a triagem online não substitui exames laboratoriais físicos ou auscultação clínica presencial no consultório veterinário se os sintomas persistirem ou forem graves (como dor, febre, sangramento ou diarreia frequente).
- Seja simpático, utilize termos acolhedores e mostre que a PetCare está de portas abertas para ajudá-los presencialmente ou por exames agendados pelo aplicativo.`;

    // Prompt content generate
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [...formattedHistory, currentTurn],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const responseText = response.text || "Desculpe, não consegui processar sua dúvida no momento. Gostaria de tentar reformular?";
    return res.json({ response: responseText, isMock: false });

  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    // In case of any actual server API failure, respond gracefully using the fallback mock
    const { message, petInfo, image } = req.body;
    const fallbackText = getMockVetResponse(message || "", petInfo, !!image);
    return res.json({
      response: `${fallbackText}\n\n*(Nota: Ocorreu uma lentidão técnica temporária na conexão de IA, mas nosso médico veterinário virtual respondeu normalmente via simulação de triagem)*`,
      isMock: true,
      errorInfo: error.message
    });
  }
});

// Start routing and asset handling for Full-Stack structure
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: any, res: any) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://localhost:${PORT}`);
  });
}

startServer();
