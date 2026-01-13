<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOpportunityStore } from "../../stores/opportunity.store";
import { useApplicationStore, type Application } from "../../stores/application.store";
import { http } from "../../services/http";

const route = useRoute();
const router = useRouter();
const opportunityStore = useOpportunityStore();
const applicationStore = useApplicationStore();

const opportunityId = String(route.params.id);

const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const error = ref("");
const success = ref("");

const form = reactive({
  title: "",
  category: "",
  city: "",
  workloadHours: 10,
  description: "",
  isActive: true,
});

const applications = ref<Application[]>([]);
const updatingStatus = ref<string | null>(null);

// Perfil do aluno
const selectedStudentId = ref<string | null>(null);
const studentProfile = ref<{ id: string; name: string; email: string } | null>(null);
const loadingStudent = ref(false);
const showStudentModal = ref(false);

const categories = [
  "Educação",
  "Meio Ambiente",
  "Saúde",
  "Cultura",
  "Direitos",
];

const statusMap: Record<string, string> = {
  pending: "Pendente",
  accepted: "Aceita",
  rejected: "Recusada",
  completed: "Concluída",
};

async function loadData() {
  loading.value = true;
  error.value = "";
  try {
    // Carregar oportunidade
    await opportunityStore.getById(opportunityId);
    const opp = opportunityStore.currentOpportunity;
    
    if (!opp) {
      error.value = "Oportunidade não encontrada";
      loading.value = false;
      return;
    }

    form.title = opp.title;
    form.category = opp.category || "";
    form.city = opp.city || "";
    form.workloadHours = opp.workloadHours;
    form.description = opp.description;
    form.isActive = opp.isActive;

    // Carregar candidaturas
    const appResult = await applicationStore.listInstitutionApplications({
      opportunityId,
      limit: 100,
    });
    applications.value = appResult.data;
  } catch (err: any) {
    error.value = opportunityStore.error || applicationStore.error || "Erro ao carregar dados";
  } finally {
    loading.value = false;
  }
}

async function save() {
  saving.value = true;
  error.value = "";
  success.value = "";

  if (!form.title.trim() || !form.description.trim()) {
    error.value = "Preencha todos os campos obrigatórios";
    saving.value = false;
    return;
  }

  try {
    await opportunityStore.update(opportunityId, {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category || null,
      city: form.city.trim() || null,
      workloadHours: form.workloadHours || 0,
      isActive: form.isActive,
    });

    success.value = "Vaga atualizada com sucesso!";
    setTimeout(() => {
      success.value = "";
    }, 3000);
  } catch (err: any) {
    error.value = opportunityStore.error || "Erro ao atualizar vaga";
  } finally {
    saving.value = false;
  }
}

async function deleteOpportunity() {
  if (!confirm("Tem certeza que deseja deletar esta vaga? Esta ação não pode ser desfeita.")) {
    return;
  }

  deleting.value = true;
  error.value = "";
  try {
    await opportunityStore.delete(opportunityId);
    router.push("/app/institution/vagas");
  } catch (err: any) {
    error.value = opportunityStore.error || "Erro ao deletar vaga";
    deleting.value = false;
  }
}

async function updateApplicationStatus(appId: string, newStatus: "accepted" | "rejected" | "completed") {
  updatingStatus.value = appId;
  try {
    await applicationStore.updateStatus(appId, newStatus);
    // recarrega a lista
    const appResult = await applicationStore.listInstitutionApplications({
      opportunityId,
      limit: 100,
    });
    applications.value = appResult.data;
  } catch (err: any) {
    alert(applicationStore.error || "Erro ao atualizar status");
  } finally {
    updatingStatus.value = null;
  }
}

async function viewStudentProfile(studentId: string) {
  selectedStudentId.value = studentId;
  loadingStudent.value = true;
  studentProfile.value = null;
  showStudentModal.value = true;

  try {
    // Tenta buscar via endpoint de admin
    // Nota: Se o backend não permitir, precisaremos criar um endpoint específico
    // ou modificar o backend para incluir dados do aluno nas candidaturas
    const response = await http.get<{ user: { id: string; name: string; email: string; role: string } }>(`/users/${studentId}`);
    studentProfile.value = {
      id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
    };
  } catch (err: any) {
    // Se não tiver permissão (403) ou não encontrar (404), mostra mensagem
    if (err?.response?.status === 403) {
      studentProfile.value = {
        id: studentId,
        name: "Acesso restrito",
        email: "Permissão necessária para visualizar",
      };
    } else {
      studentProfile.value = {
        id: studentId,
        name: "Não disponível",
        email: "Erro ao carregar dados",
      };
    }
    console.error("Erro ao carregar perfil do aluno:", err);
  } finally {
    loadingStudent.value = false;
  }
}

function closeStudentModal() {
  showStudentModal.value = false;
  selectedStudentId.value = null;
  studentProfile.value = null;
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div style="max-width: 1100px">
    <button
      @click="router.push('/app/institution/vagas')"
      style="
        padding: 8px 10px;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        background: #fff;
        cursor: pointer;
        margin-bottom: 14px;
      "
    >
      ← Voltar para minhas vagas
    </button>

    <!-- Loading -->
    <div v-if="loading" style="text-align: center; padding: 40px">
      <p style="opacity: 0.75">Carregando dados...</p>
    </div>

    <!-- Erro -->
    <div
      v-else-if="error && !loading"
      style="
        padding: 16px;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 10px;
        color: #c33;
        margin-bottom: 16px;
      "
    >
      {{ error }}
    </div>

    <!-- Conteúdo -->
    <div v-else>
      <header style="margin-bottom: 20px">
        <h1 style="font-size: 28px; font-weight: 800; margin: 0 0 6px">
          Gerenciar Vaga
        </h1>
        <p style="opacity: 0.75; margin: 0">
          Edite os dados da vaga e gerencie candidaturas.
        </p>
      </header>

      <!-- Sucesso -->
      <div
        v-if="success"
        style="
          padding: 16px;
          background: #dcfce7;
          border: 1px solid #86efac;
          border-radius: 10px;
          color: #166534;
          margin-bottom: 16px;
        "
      >
        <strong>✓ {{ success }}</strong>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px">
        <!-- Formulário de edição -->
        <div>
          <div
            style="
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 16px;
              background: #fff;
              margin-bottom: 20px;
            "
          >
            <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px">
              Editar Vaga
            </h2>

            <form @submit.prevent="save" style="display: grid; gap: 12px">
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
                    <option value="">Selecione</option>
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
                  placeholder="Descreva o que o voluntário fará..."
                  style="
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    resize: vertical;
                  "
                />
              </div>

              <div>
                <label
                  style="
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    opacity: 0.75;
                  "
                >
                  <input
                    v-model="form.isActive"
                    type="checkbox"
                    style="width: auto"
                  />
                  Vaga ativa
                </label>
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
                  @click="deleteOpportunity"
                  :disabled="deleting"
                  style="
                    padding: 10px 12px;
                    border: 1px solid #dc2626;
                    border-radius: 10px;
                    background: #fff;
                    color: #dc2626;
                    cursor: pointer;
                    font-weight: 700;
                    opacity: deleting ? 0.6 : 1;
                  "
                >
                  {{ deleting ? "Deletando..." : "Deletar vaga" }}
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  :style="{
                    padding: '10px 12px',
                    border: '1px solid #111827',
                    borderRadius: '10px',
                    background: '#111827',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: '700',
                    opacity: saving ? 0.6 : 1,
                  }"
                >
                  {{ saving ? "Salvando..." : "Salvar alterações" }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Lista de candidaturas -->
        <div>
          <div
            style="
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 16px;
              background: #fff;
            "
          >
            <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px">
              Candidaturas ({{ applications.length }})
            </h2>

            <div v-if="applications.length === 0" style="opacity: 0.75; padding: 20px; text-align: center">
              Nenhuma candidatura ainda.
            </div>

            <div v-else style="display: flex; flex-direction: column; gap: 12px">
              <div
                v-for="app in applications"
                :key="app.id"
                style="
                  padding: 12px;
                  border: 1px solid #e5e7eb;
                  border-radius: 10px;
                "
              >
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px">
                  <div style="flex: 1">
                    <div style="font-weight: 700; margin-bottom: 4px">
                      Candidatura #{{ app.id.substring(0, 8) }}
                    </div>
                    <div style="font-size: 13px; opacity: 0.7; margin-bottom: 4px">
                      {{ new Date(app.createdAt).toLocaleDateString("pt-BR") }}
                    </div>
                    <button
                      @click="viewStudentProfile(app.studentId)"
                      style="
                        padding: 6px 10px;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        background: #fff;
                        color: #111827;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 600;
                        margin-top: 4px;
                      "
                    >
                      👤 Ver perfil do aluno
                    </button>
                  </div>
                  <span
                    :style="{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: app.status === 'accepted' ? '#dcfce7' : app.status === 'rejected' ? '#fee2e2' : '#f3f4f6',
                      color: app.status === 'accepted' ? '#166534' : app.status === 'rejected' ? '#991b1b' : '#6b7280',
                      fontSize: '13px',
                    }"
                  >
                    {{ statusMap[app.status] || app.status }}
                  </span>
                </div>

                <div
                  v-if="app.status === 'pending'"
                  style="display: flex; gap: 8px; margin-top: 8px"
                >
                  <button
                    @click="updateApplicationStatus(app.id, 'accepted')"
                    :disabled="updatingStatus === app.id"
                    style="
                      flex: 1;
                      padding: 8px 12px;
                      border: 1px solid #10b981;
                      border-radius: 8px;
                      background: #10b981;
                      color: #fff;
                      cursor: pointer;
                      font-size: 13px;
                      font-weight: 700;
                      opacity: updatingStatus === app.id ? 0.6 : 1;
                    "
                  >
                    Aceitar
                  </button>
                  <button
                    @click="updateApplicationStatus(app.id, 'rejected')"
                    :disabled="updatingStatus === app.id"
                    style="
                      flex: 1;
                      padding: 8px 12px;
                      border: 1px solid #ef4444;
                      border-radius: 8px;
                      background: #ef4444;
                      color: #fff;
                      cursor: pointer;
                      font-size: 13px;
                      font-weight: 700;
                      opacity: updatingStatus === app.id ? 0.6 : 1;
                    "
                  >
                    Recusar
                  </button>
                </div>

                <div
                  v-else-if="app.status === 'accepted'"
                  style="margin-top: 8px"
                >
                  <button
                    @click="updateApplicationStatus(app.id, 'completed')"
                    :disabled="updatingStatus === app.id"
                    style="
                      width: 100%;
                      padding: 8px 12px;
                      border: 1px solid #3b82f6;
                      border-radius: 8px;
                      background: #3b82f6;
                      color: #fff;
                      cursor: pointer;
                      font-size: 13px;
                      font-weight: 700;
                      opacity: updatingStatus === app.id ? 0.6 : 1;
                    "
                  >
                    {{ updatingStatus === app.id ? "Atualizando..." : "Marcar como concluída" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de perfil do aluno -->
    <div
      v-if="showStudentModal"
      style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
      "
      @click.self="closeStudentModal"
    >
      <div
        style="
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        "
      >
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px">
          <h2 style="font-size: 22px; font-weight: 800; margin: 0">
            Perfil do Aluno
          </h2>
          <button
            @click="closeStudentModal"
            style="
              padding: 8px;
              border: none;
              background: transparent;
              cursor: pointer;
              font-size: 24px;
              opacity: 0.7;
            "
          >
            ×
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loadingStudent" style="text-align: center; padding: 40px">
          <p style="opacity: 0.75">Carregando perfil...</p>
        </div>

        <!-- Perfil -->
        <div v-else-if="studentProfile">
          <div
            style="
              display: grid;
              gap: 16px;
              padding: 20px;
              background: #f9fafb;
              border-radius: 10px;
            "
          >
            <div
              style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding-bottom: 16px;
                border-bottom: 1px solid #e5e7eb;
              "
            >
              <div
                style="
                  width: 48px;
                  height: 48px;
                  border-radius: 50%;
                  background: #111827;
                  color: #fff;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 20px;
                  font-weight: 700;
                "
              >
                {{ studentProfile.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <div style="font-weight: 700; font-size: 18px; margin-bottom: 2px">
                  {{ studentProfile.name }}
                </div>
                <div style="font-size: 13px; opacity: 0.7">
                  Aluno
                </div>
              </div>
            </div>

            <div>
              <div style="font-size: 13px; opacity: 0.75; margin-bottom: 6px; font-weight: 600">
                Email
              </div>
              <div style="font-size: 15px; color: #111827">
                {{ studentProfile.email }}
              </div>
            </div>

            <div>
              <div style="font-size: 13px; opacity: 0.75; margin-bottom: 6px; font-weight: 600">
                ID do Usuário
              </div>
              <div style="font-size: 12px; font-family: monospace; opacity: 0.7; background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #e5e7eb">
                {{ studentProfile.id }}
              </div>
            </div>
          </div>
        </div>

        <!-- Erro -->
        <div v-else style="text-align: center; padding: 40px">
          <p style="opacity: 0.75">Erro ao carregar perfil do aluno.</p>
        </div>

        <div style="margin-top: 20px; display: flex; justify-content: flex-end">
          <button
            @click="closeStudentModal"
            style="
              padding: 10px 16px;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
              background: #fff;
              cursor: pointer;
              font-weight: 700;
            "
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
