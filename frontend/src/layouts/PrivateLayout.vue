<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

function logout() {
  auth.logout();
  router.push("/login");
}

const isActive = (path: string) => {
  return route.path.startsWith(path);
};

const menuItems = computed(() => {
  if (auth.role === "aluno") {
    return [
      {
        title: "Dashboard",
        icon: "mdi-view-dashboard",
        to: "/app/student/dashboard",
        path: "/app/student/dashboard",
      },
      {
        title: "Minhas candidaturas",
        icon: "mdi-file-document",
        to: "/app/student/candidaturas",
        path: "/app/student/candidaturas",
      },
      {
        title: "Oportunidades",
        icon: "mdi-briefcase",
        to: "/app/student/oportunidades",
        path: "/app/student/oportunidades",
      },
      {
        title: "Perfil",
        icon: "mdi-account",
        to: "/app/student/perfil",
        path: "/app/student/perfil",
      },
    ];
  } else if (auth.role === "instituicao") {
    return [
      {
        title: "Dashboard",
        icon: "mdi-view-dashboard",
        to: "/app/institution/dashboard",
        path: "/app/institution/dashboard",
      },
      {
        title: "Minhas vagas",
        icon: "mdi-briefcase",
        to: "/app/institution/vagas",
        path: "/app/institution/vagas",
      },
      {
        title: "Criar vaga",
        icon: "mdi-plus",
        to: "/app/institution/vagas/nova",
        path: "/app/institution/vagas/nova",
      },
      {
        title: "Perfil",
        icon: "mdi-account",
        to: "/app/institution/perfil",
        path: "/app/institution/perfil",
      },
    ];
  } else if (auth.role === "admin") {
    return [
      {
        title: "Dashboard",
        icon: "mdi-view-dashboard",
        to: "/app/admin/dashboard",
        path: "/app/admin/dashboard",
      },
      {
        title: "Perfil",
        icon: "mdi-account",
        to: "/app/admin/perfil",
        path: "/app/admin/perfil",
      },
    ];
  }
  return [];
});
</script>

<template>
  <div class="d-flex" style="min-height: 100vh">
    <v-navigation-drawer permanent>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Painel"
        class="font-weight-bold"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list-item
        v-if="auth.user"
        :prepend-icon="auth.role === 'aluno' ? 'mdi-school' : auth.role === 'instituicao' ? 'mdi-office-building' : 'mdi-shield-account'"
        :title="auth.user.name"
        :subtitle="auth.user.role"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :active="isActive(item.path)"
          color="primary"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            block
            variant="outlined"
            prepend-icon="mdi-logout"
            @click="logout"
          >
            Sair
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <div class="flex-fill d-flex flex-column">
      <v-app-bar color="primary" elevation="1">
        <v-app-bar-title>Conecta Voluntário</v-app-bar-title>
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <RouterView />
        </v-container>
      </v-main>
    </div>
  </div>
</template>
