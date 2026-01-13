import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import { useAuthStore } from "../stores/auth.store";

import PublicLayout from "../layouts/PublicLayout.vue";
import PrivateLayout from "../layouts/PrivateLayout.vue";

import Home from "../pages/public/Home.vue";
import OpportunitiesList from "../pages/public/OpportunitiesList.vue";
import OpportunityDetails from "../pages/public/OpportunityDetails.vue";
import Login from "../pages/public/Login.vue";
import Register from "../pages/public/Register.vue";

import StudentDashboard from "../pages/student/StudentDashboard.vue";
import InstitutionDashboard from "../pages/institution/InstitutionDashboard.vue";
import AdminDashboard from "../pages/admin/AdminDashboard.vue";

const routes: RouteRecordRaw[] = [
{
    path: "/",
    component: PublicLayout,
    children: [
    { path: "", name: "home", component: Home },
    { path: "oportunidades", name: "opportunities", component: OpportunitiesList },
    { path: "oportunidades/:id", name: "opportunity_details", component: OpportunityDetails },
    { path: "login", name: "login", component: Login },
    { path: "cadastro", name: "register", component: Register },
    ],
},

{
    path: "/app",
    component: PrivateLayout,
    meta: { requiresAuth: true },
    children: [
    {
        path: "student",
        children: [{ path: "dashboard", name: "student_dashboard", component: StudentDashboard, meta: { role: "student" } }],
    },
    {
        path: "institution",
        children: [{ path: "dashboard", name: "institution_dashboard", component: InstitutionDashboard, meta: { role: "institution" } }],
    },
    {
        path: "admin",
        children: [{ path: "dashboard", name: "admin_dashboard", component: AdminDashboard, meta: { role: "admin" } }],
    },
    ],
},

{ path: "/:pathMatch(.*)*", redirect: "/" },
];

export const router = createRouter({
history: createWebHistory(),
routes,
});

router.beforeEach((to) => {
const auth = useAuthStore();
if (!auth.user) auth.loadFromStorage();

const requiresAuth = !!to.meta.requiresAuth;
const requiredRole = to.meta.role as string | undefined;

if (requiresAuth && !auth.isAuthenticated) {
    return { name: "login" };
}

if (requiresAuth && requiredRole && auth.role !== requiredRole) {
    // manda pro dashboard correto
    if (auth.role === "student") return { name: "student_dashboard" };
    if (auth.role === "institution") return { name: "institution_dashboard" };
    if (auth.role === "admin") return { name: "admin_dashboard" };
    return { name: "home" };
}

return true;
});
