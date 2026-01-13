<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

function logout() {
  auth.logout();
  router.push("/login"); // ou "/" se preferir
}

// cria uma classe simples pro link ativo
function linkClass(pathStartsWith: string) {
  const isActive = route.path.startsWith(pathStartsWith);

  return isActive ? "nav-link nav-link-active" : "nav-link";
}
</script>

<template>
  <div style="display: flex; min-height: 100vh; background: #f9fafb">
    <aside
      style="
        width: 260px;
        border-right: 1px solid #e5e7eb;
        padding: 16px;
        background: #fff;
      "
    >
      <div style="font-weight: 800; margin-bottom: 14px">Painel</div>

      <div v-if="auth.user" style="margin-bottom: 14px; font-size: 14px">
        <div>
          <strong>{{ auth.user.name }}</strong>
        </div>
        <div style="opacity: 0.7; text-transform: capitalize">
          {{ auth.user.role }}
        </div>
      </div>

      <div style="height: 1px; background: #e5e7eb; margin: 12px 0"></div>

      <nav style="display: flex; flex-direction: column; gap: 8px">
        <!-- STUDENT -->
        <template v-if="auth.role === 'aluno'">
          <RouterLink
            :class="linkClass('/app/student/dashboard')"
            to="/app/student/dashboard"
          >
            Dashboard
          </RouterLink>
          <RouterLink
            :class="linkClass('/app/student/candidaturas')"
            to="/app/student/candidaturas"
          >
            Minhas candidaturas
          </RouterLink>
          <RouterLink
            :class="linkClass('/app/student/oportunidades')"
            to="/app/student/oportunidades"
          >
            Oportunidades
          </RouterLink>
          <RouterLink
            :class="linkClass('/app/student/perfil')"
            to="/app/student/perfil"
          >
            Perfil
          </RouterLink>
        </template>

        <!-- INSTITUTION -->
        <template v-else-if="auth.role === 'instituicao'">
          <RouterLink
            :class="linkClass('/app/institution/dashboard')"
            to="/app/institution/dashboard"
          >
            Dashboard
          </RouterLink>
          <RouterLink
            :class="linkClass('/app/institution/vagas')"
            to="/app/institution/vagas"
          >
            Minhas vagas
          </RouterLink>
          <RouterLink
            :class="linkClass('/app/institution/vagas/nova')"
            to="/app/institution/vagas/nova"
          >
            Criar vaga
          </RouterLink>
        </template>

        <!-- ADMIN -->
        <template v-else-if="auth.role === 'admin'">
          <RouterLink
            :class="linkClass('/app/admin/dashboard')"
            to="/app/admin/dashboard"
          >
            Dashboard
          </RouterLink>
        </template>
      </nav>

      <button
        @click="logout"
        style="
          margin-top: 18px;
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
        "
      >
        Sair
      </button>
    </aside>

    <main style="flex: 1; padding: 22px">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.nav-link {
  display: block;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: #111827;
}
.nav-link:hover {
  background: #f3f4f6;
}
.nav-link-active {
  background: #111827;
  color: white;
}
</style>
