import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./app/router";
import { pinia } from "./app/pinia";
import { useAuthStore } from "./stores/auth.store";
import vuetify from "./plugins/vuetify";

const app = createApp(App);

app.use(pinia);
app.use(vuetify);

useAuthStore().loadFromStorage(); // garante user/token

app.use(router).mount("#app");
