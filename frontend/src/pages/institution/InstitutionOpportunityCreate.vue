<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useOpportunityStore } from "../../stores/opportunity.store";
import { useInstitutionStore } from "../../stores/institution.store";

const router = useRouter();
const opportunityStore = useOpportunityStore();
const institutionStore = useInstitutionStore();

const form = reactive({
  title: "",
  category: "Educação",
  city: "",
  workloadHours: 10,
  description: "",
});

const error = ref("");
const success = ref(false);
const checkingProfile = ref(true);

const categories = [
  "Educação",
  "Meio Ambiente",
  "Saúde",
  "Cultura",
  "Direitos",
];

// Verifica se a instituição tem perfil cadastrado
onMounted(async () => {
  checkingProfile.value = true;
  try {
    await institutionStore.getMe();
  } catch (err: any) {
    // Se não tiver perfil, mostra mensagem
    if (err?.response?.status === 404) {
      error.value = "Você precisa cadastrar o perfil da instituição antes de criar vagas. Acesse o dashboard para cadastrar.";
    }
  } finally {
    checkingProfile.value = false;
  }
});

async function submit() {
  error.value = "";
  success.value = false;

  if (!form.title.trim() || !form.description.trim()) {
    error.value = "Preencha todos os campos obrigatórios";
    return;
  }

  try {
    await opportunityStore.create({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category || null,
      city: form.city.trim() || null,
      workloadHours: form.workloadHours || 0,
      isActive: true,
    });

    success.value = true;
    
    // redireciona após 1 segundo
    setTimeout(() => {
      router.push({ name: "institution_opportunities" });
    }, 1000);
  } catch (err: any) {
    // mostra a mensagem específica do backend
    let errorMessage = err?.response?.data?.message || opportunityStore.error || "Erro ao criar vaga. Tente novamente.";
    
    // traduz mensagens comuns do backend para português mais claro
    if (errorMessage.includes("não cadastrou o perfil")) {
      errorMessage = "Você precisa cadastrar o perfil da instituição antes de criar vagas. Acesse o dashboard para cadastrar.";
    } else if (errorMessage.includes("não aprovada")) {
      errorMessage = "Sua instituição ainda não foi aprovada pelo administrador. Aguarde a aprovação para criar vagas.";
    }
    
    error.value = errorMessage;
    console.error("Erro ao criar vaga:", err);
  }
}

function cancel() {
  router.push({ name: "institution_opportunities" });
}
</script>

<template>
  <div style="max-width: 980px">
    <header style="margin-bottom: 16px">
      <h1 style="font-size: 28px; font-weight: 900; margin: 0 0 6px">
        Criar Vaga
      </h1>
      <p style="opacity: 0.75; margin: 0">
        Preencha as informações para publicar uma nova oportunidade.
      </p>
    </header>

    <div
      style="
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 16px;
        background: #fff;
      "
    >
      <!-- verificando perfil -->
      <div v-if="checkingProfile" style="text-align: center; padding: 40px">
        <p style="opacity: 0.75">Verificando perfil da instituição...</p>
      </div>

      <form v-else @submit.prevent="submit" style="display: grid; gap: 12px">
        <!-- mensagem de sucesso -->
        <div
          v-if="success"
          style="
            padding: 16px;
            background: #dcfce7;
            border: 1px solid #86efac;
            border-radius: 10px;
            color: #166534;
          "
        >
          <strong>✓ Vaga criada com sucesso!</strong>
          <p style="margin: 8px 0 0; opacity: 0.8">Redirecionando...</p>
        </div>

        <!-- mensagem de erro -->
        <div
          v-else-if="error"
          style="
            padding: 16px;
            background: #fee;
            border: 1px solid #fcc;
            border-radius: 10px;
            color: #c33;
          "
        >
          <strong>⚠️ {{ error }}</strong>
          <div v-if="error.includes('cadastrar o perfil')" style="margin-top: 12px">
            <RouterLink
              to="/app/institution/dashboard"
              style="
                display: inline-block;
                padding: 8px 12px;
                background: #c33;
                color: #fff;
                border-radius: 8px;
                text-decoration: none;
                font-size: 13px;
              "
            >
              Ir para Dashboard
            </RouterLink>
          </div>
        </div>

        <div>
          <label
            style="
              display: block;
              font-size: 13px;
              opacity: 0.75;
              margin-bottom: 6px;
            "
          >
            Título *
          </label>
          <input
            v-model="form.title"
            required
            placeholder="Ex: Apoio escolar em reforço de matemática"
            style="
              width: 100%;
              padding: 10px 12px;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
            "
          />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
          <div>
            <label
              style="
                display: block;
                font-size: 13px;
                opacity: 0.75;
                margin-bottom: 6px;
              "
            >
              Categoria *
            </label>
            <select
              v-model="form.category"
              style="
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
              "
            >
              <option v-for="c in categories" :key="c" :value="c">
                {{ c }}
              </option>
            </select>
          </div>

          <div>
            <label
              style="
                display: block;
                font-size: 13px;
                opacity: 0.75;
                margin-bottom: 6px;
              "
            >
              Carga horária (h) *
            </label>
            <input
              v-model.number="form.workloadHours"
              type="number"
              min="1"
              required
              style="
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
              "
            />
          </div>
        </div>

        <div>
          <label
            style="
              display: block;
              font-size: 13px;
              opacity: 0.75;
              margin-bottom: 6px;
            "
          >
            Cidade *
          </label>
          <input
            v-model="form.city"
            required
            placeholder="Ex: Quixadá"
            style="
              width: 100%;
              padding: 10px 12px;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
            "
          />
        </div>

        <div>
          <label
            style="
              display: block;
              font-size: 13px;
              opacity: 0.75;
              margin-bottom: 6px;
            "
          >
            Descrição *
          </label>
          <textarea
            v-model="form.description"
            required
            rows="5"
            placeholder="Descreva o que o voluntário fará, dias/horários, detalhes..."
            style="
              width: 100%;
              padding: 10px 12px;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
              resize: vertical;
            "
          />
        </div>

        <div
          style="
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            padding-top: 4px;
          "
        >
          <button
            type="button"
            @click="cancel"
            style="
              padding: 10px 12px;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
              background: #fff;
              cursor: pointer;
            "
          >
            Cancelar
          </button>

          <button
            type="submit"
            :disabled="opportunityStore.loading || success"
            :style="{
              padding: '10px 12px',
              border: '1px solid #111827',
              borderRadius: '10px',
              background: '#111827',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '700',
              opacity: opportunityStore.loading || success ? 0.6 : 1,
            }"
          >
            {{ opportunityStore.loading ? "Criando..." : success ? "Criada!" : "Criar vaga" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
