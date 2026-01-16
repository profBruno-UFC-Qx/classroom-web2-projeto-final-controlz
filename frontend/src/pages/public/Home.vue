<template>
  <!-- Pagina inicial publica (landing page) do sistema -->
  <v-row justify="center" class="mt-8">
    <v-col cols="12" md="8" lg="6">
      <v-card class="pa-8 text-center" elevation="3">
        <!-- Icone principal e branding -->
        <v-icon size="64" color="primary" class="mb-4">mdi-hand-heart</v-icon>
        <h1 class="text-h3 mb-4">Conecta Voluntário</h1>
        <p class="text-h6 text-medium-emphasis mb-6">
          Plataforma para conectar estudantes a oportunidades de voluntariado e
          certificar horas complementares.
        </p>

        <!-- CTAs principais: navegar para oportunidades ou cadastro -->
        <div class="d-flex flex-column flex-sm-row gap-3 justify-center">
          <v-btn
            to="/oportunidades"
            color="primary"
            size="large"
            prepend-icon="mdi-briefcase"
          >
            Ver oportunidades
          </v-btn>
          <v-btn
            to="/cadastro"
            color="primary"
            variant="outlined"
            size="large"
            prepend-icon="mdi-account-plus"
          >
            Quero participar
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
