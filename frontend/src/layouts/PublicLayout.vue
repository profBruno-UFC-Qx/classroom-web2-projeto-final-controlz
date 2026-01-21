<template>
  <div style="overflow-x: hidden; width: 100%;">
    <v-app-bar color="primary" elevation="1">
      <v-app-bar-title>
        <strong>Conecta Voluntário</strong>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn
        to="/"
        variant="text"
        prepend-icon="mdi-home"
      >
        Início
      </v-btn>
      <v-btn
        to="/oportunidades"
        variant="text"
        prepend-icon="mdi-briefcase"
      >
        Oportunidades
      </v-btn>
      <v-btn
        to="/login"
        variant="text"
        prepend-icon="mdi-login"
      >
        Entrar
      </v-btn>
      <v-btn
        to="/cadastro"
        variant="text"
        prepend-icon="mdi-account-plus"
      >
        Cadastrar
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="pa-4" fluid style="max-width: 1400px; width: 100%;">
        <RouterView />
      </v-container>
    </v-main>

    <v-footer color="grey-lighten-4" class="mt-8">
      <v-container>
        <div class="text-center w-100">
          © Conecta Voluntário — Extensão e Impacto Social
        </div>
      </v-container>
    </v-footer>
  </div>
</template>