<template>
    <div>
    <header style="display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px solid #e5e7eb;">
        <strong>Conecta Voluntário</strong>
        <nav style="display:flex; gap:12px; align-items:center;">
        <RouterLink to="/">Início</RouterLink>
        <RouterLink to="/oportunidades">Oportunidades</RouterLink>
        <RouterLink to="/login">Entrar</RouterLink>
        <RouterLink to="/cadastro">Cadastrar</RouterLink>
        </nav>
    </header>
    <main style="max-width:1100px; margin:0 auto; padding:18px;">
        <RouterView />
    </main>
        <footer style="padding:14px 18px; border-top:1px solid #e5e7eb; margin-top:30px; font-size:14px;">
        © Conecta Voluntário — Extensão e Impacto Social
    </footer>
    </div>
</template>