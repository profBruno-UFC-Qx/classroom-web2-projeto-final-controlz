<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth.store";

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  title: "",
  category: "Educação",
  city: "",
  workloadHours: 10,
  description: "",
});

const categories = [
  "Educação",
  "Meio Ambiente",
  "Saúde",
  "Cultura",
  "Direitos",
];

// TODO: integrar com API real
// - substituir alert mock por useOpportunityStore() ou chamada direta
// - integrar com POST /opportunities
// - validação de campos obrigatórios
// - feedback de sucesso/erro
// - redirecionamento após criar
function submit() {
  // Mock: só demonstra o fluxo
  alert(
    `Vaga criada (mock)!\n\n` +
      `Título: ${form.title}\n` +
      `Categoria: ${form.category}\n` +
      `Cidade: ${form.city}\n` +
      `Carga: ${form.workloadHours}h\n`
  );

  // volta para "Minhas vagas"
  router.push({ name: "institution_opportunities" });
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
      <form @submit.prevent="submit" style="display: grid; gap: 12px">
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
            style="
              padding: 10px 12px;
              border: 1px solid #111827;
              border-radius: 10px;
              background: #111827;
              color: #fff;
              cursor: pointer;
            "
          >
            Criar vaga (mock)
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
