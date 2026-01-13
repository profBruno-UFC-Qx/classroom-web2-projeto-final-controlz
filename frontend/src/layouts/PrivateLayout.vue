<template>
    <div style="display:flex; min-height:100vh;">
    <aside style="width:240px; border-right:1px solid #e5e7eb; padding:16px;">
        <div style="font-weight:700; margin-bottom:14px;">Painel</div>
        <div v-if="auth.user" style="margin-bottom:14px; font-size:14px;">
        <div><strong>{{ auth.user.name }}</strong></div>
        <div style="opacity:.8">{{ auth.user.role }}</div>
        </div>
        <nav style="display:flex; flex-direction:column; gap:10px;">
        <RouterLink v-if="auth.role==='student'" to="/app/student/dashboard">Dashboard Aluno</RouterLink>
        <RouterLink v-if="auth.role==='institution'" to="/app/institution/dashboard">Dashboard Instituição</RouterLink>
        <RouterLink v-if="auth.role==='admin'" to="/app/admin/dashboard">Dashboard Admin</RouterLink>
        </nav>
        <button @click="logout" style="margin-top:18px;">Sair</button>
    </aside>
    <main style="flex:1; padding:18px;">
        <RouterView />
    </main>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth.store";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

function logout() {
    auth.logout();
    router.push("/");
}
</script>