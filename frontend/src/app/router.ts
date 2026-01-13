import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "../stores/auth.store";

import PrivateLayout from "../layouts/PrivateLayout.vue";
import PublicLayout from "../layouts/PublicLayout.vue";

// Public pages
import Home from "../pages/public/Home.vue";
import Login from "../pages/public/Login.vue";
import OpportunitiesList from "../pages/public/OpportunitiesList.vue";
import OpportunityDetails from "../pages/public/OpportunityDetails.vue";
import Register from "../pages/public/Register.vue";

// Student pages
import StudentDashboard from "../pages/student/StudentDashboard.vue";
import StudentApplicationDetail from "../pages/student/StudentApplicationDetail.vue";
import StudentApplications from "../pages/student/StudentApplications.vue";
import StudentProfile from "../pages/student/StudentProfile.vue";

// Institution pages
import InstitutionDashboard from "../pages/institution/InstitutionDashboard.vue";
import InstitutionOpportunities from "../pages/institution/InstitutionOpportunities.vue";
import InstitutionOpportunityCreate from "../pages/institution/InstitutionOpportunityCreate.vue";
import InstitutionOpportunityManage from "../pages/institution/InstitutionOpportunityManage.vue";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: PublicLayout,
    children: [
      { path: "", name: "home", component: Home },
      {
        path: "oportunidades",
        name: "opportunities",
        component: OpportunitiesList,
      },
      {
        path: "oportunidades/:id",
        name: "opportunity_details",
        component: OpportunityDetails,
      },
      { path: "login", name: "login", component: Login },
      { path: "cadastro", name: "register", component: Register },
    ],
  },

  {
    path: "/app",
    component: PrivateLayout,
    meta: { requiresAuth: true },
    children: [
      // STUDENT
      {
        path: "student",
        meta: { role: "aluno" },
        children: [
          {
            path: "dashboard",
            name: "student_dashboard",
            component: StudentDashboard,
          },
          {
            path: "candidaturas",
            name: "student_applications",
            component: StudentApplications,
          },
          {
            path: "candidaturas/:id",
            name: "student_application_detail",
            component: StudentApplicationDetail,
          },
          {
            path: "perfil",
            name: "student_profile",
            component: StudentProfile,
          },
        ],
      },

      // INSTITUTION
      {
        path: "institution",
        meta: { role: "instituicao" },
        children: [
          {
            path: "dashboard",
            name: "institution_dashboard",
            component: InstitutionDashboard,
          },
          {
            path: "vagas",
            name: "institution_opportunities",
            component: InstitutionOpportunities,
          },
          {
            path: "vagas/nova",
            name: "institution_opportunity_create",
            component: InstitutionOpportunityCreate,
          },
          {
            path: "vagas/:id",
            name: "institution_opportunity_manage",
            component: InstitutionOpportunityManage,
          },
        ],
      },

      // ADMIN
      {
        path: "admin",
        meta: { role: "admin" },
        children: [
          {
            path: "dashboard",
            name: "admin_dashboard",
            component: AdminDashboard,
          },
        ],
      },
    ],
  },

  { path: "/:pathMatch(.*)*", redirect: "/" },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (!auth.user) auth.loadFromStorage();

  // Se tem token mas não tem user, verifica com a API
  if (auth.token && !auth.user) {
    await auth.checkAuth();
  }

  const requiresAuth = !!to.meta.requiresAuth;

  const requiredRole =
    (to.meta.role as string | undefined) ||
    (to.matched.find((r) => r.meta.role)?.meta.role as string | undefined);

  if (requiresAuth && !auth.isAuthenticated) {
    return { name: "login" };
  }

  if (requiresAuth && requiredRole && auth.role !== requiredRole) {
    if (auth.role === "aluno") return { name: "student_dashboard" };
    if (auth.role === "instituicao") return { name: "institution_dashboard" };
    if (auth.role === "admin") return { name: "admin_dashboard" };
    return { name: "home" };
  }

  return true;
});
