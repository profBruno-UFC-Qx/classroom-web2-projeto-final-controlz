<script setup lang="ts">
import { useAuthStore, type UserRole } from "../../stores/auth.store"
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

function go(role: UserRole) {
    auth.loginMock(role);
    if (role === "student") router.push("/app/student/dashboard");
    if (role === "institution") router.push("/app/institution/dashboard");
    if (role === "admin") router.push("/app/admin/dashboard");
}
</script>

<template>
    <div style="max-width:420px;">
    <h2>Entrar</h2>
    <p>Por enquanto, login mock só pra testar rotas por papel.</p>
    <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
        <button @click="go('student')">Entrar como Aluno</button>
        <button @click="go('institution')">Entrar como Instituição</button>
        <button @click="go('admin')">Entrar como Admin</button>
    </div>
    </div>
</template>