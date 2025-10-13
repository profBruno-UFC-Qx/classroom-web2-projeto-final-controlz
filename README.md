[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iVa2Dd1Z)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=21000263)
# :checkered_flag: Conecta Voluntário

Uma plataforma web que conecta alunos universitários em busca de experiência e horas complementares com instituições da comunidade que necessitam de voluntários, gerenciando todo o processo desde a candidatura até a certificação.

## :technologist: Membros da equipe

* Luís Gustavo Rabêlo de Oliveira - 540974 (Sistemas de Informação)
* Antônio Kleberson do Carmo Silva - 540901 (Sistemas de Informação)

## :bulb: Objetivo Geral
Desenvolver um sistema Fullstack (Node.js e Vue.js) que sirva como uma ponte entre o corpo discente da instituição e as necessidades da comunidade local. O objetivo é facilitar o engajamento dos alunos em atividades de extensão, automatizar o processo de candidatura a vagas de voluntariado e simplificar a validação e certificação de horas complementares.

## :eyes: Público-Alvo
* Alunos: Estudantes que buscam oportunidades de voluntariado para ganhar experiência prática, desenvolver novas habilidades e cumprir a carga horária de atividades complementares exigida pelo seu curso.

* Instituições Comunitárias: Organizações não governamentais (ONGs), escolas, projetos sociais, empresas juniores e outras entidades da comunidade que precisam de voluntários para apoiar suas causas e projetos.

* Administração Acadêmica: Coordenadores de curso e da área de extensão que precisam validar as atividades dos alunos e que podem usar a plataforma como uma ferramenta oficial para divulgar e gerenciar parcerias.

## :star2: Impacto Esperado
Espera-se que a plataforma fortaleça o pilar de extensão da universidade, gerando um impacto positivo de via dupla. Para os alunos, o projeto facilitará o acesso a experiências enriquecedoras que contribuem para sua formação cidadã e profissional. Para as instituições, o sistema trará maior visibilidade para suas causas e um canal direto para captar talentos e ajuda qualificada. Por fim, a plataforma solidifica o papel da instituição de ensino como um agente ativo de transformação social na comunidade em que está inserida.

## :people_holding_hands: Papéis ou tipos de usuário da aplicação

1. Administrador (Admin): Responsável pela governança da plataforma. Seu principal papel é garantir a legitimidade e a segurança do ecossistema, validando os cadastros de novas instituições.

2. Instituição: Usuário que representa uma organização da comunidade. Seu objetivo é divulgar oportunidades de voluntariado e recrutar alunos para seus projetos.

3. Aluno (Student): O usuário final que busca oportunidades. Seu objetivo é encontrar vagas, candidatar-se e gerenciar o processo para obter suas horas complementares.

4. Usuário não logado (Visitante): Qualquer pessoa que acesse a plataforma sem autenticação. Pode explorar as vagas disponíveis, mas não pode interagir com elas.

A aplicação possui uma área pública para visualização de vagas e áreas restritas para alunos, instituições e administradores, cada uma com suas funcionalidades específicas.

> Tenha em mente que obrigatoriamente a aplicação deve possuir funcionalidades acessíveis a todos os tipos de usuário e outra funcionalidades restritas a certos tipos de usuários.

## :triangular_flag_on_post:	 Principais funcionalidades da aplicação

### Funcionalidades Públicas (acessíveis a todos os usuários):
* Visualizar a página inicial com destaques e informações sobre o projeto.

* Navegar por uma lista de todas as oportunidades de voluntariado ativas.

* Utilizar filtros para refinar a busca de vagas (por área de atuação, cidade, habilidades, etc.).

* Ver a página de detalhes de uma oportunidade específica, com todas as informações sobre a vaga e a instituição.

* Acessar as páginas de login e cadastro.

### Funcionalidades Restritas (após login):
### Para Alunos:

* Gerenciar o próprio perfil.

* Candidatar-se a uma ou mais vagas de voluntariado.

* Acessar um painel pessoal para acompanhar o status de suas candidaturas (Pendente, Aceita, Recusada, Concluída).

* Realizar o fluxo de documentos: baixar o termo de compromisso, fazer upload do documento assinado e receber a versão final assinada pela instituição.

* Receber e baixar o certificado de horas complementares ao final do voluntariado.

### Para Instituições:

* Cadastrar sua instituição (cadastro fica pendente de aprovação do Admin).

* Gerenciar o perfil da instituição.

* Criar, editar e excluir suas próprias oportunidades de voluntariado.

* Acessar um painel para visualizar e gerenciar os alunos candidatos em cada vaga.

* Alterar o status das candidaturas (aceitar ou recusar).

* Gerenciar o fluxo de documentos para os alunos aceitos.

* Marcar uma oportunidade como "Concluída" e validar a emissão do certificado de horas.

### Para Administradores:

* Acessar um painel de administração.

* Visualizar a lista de instituições com cadastro pendente.

* Aprovar ou rejeitar o cadastro de novas instituições.

* Moderar ou remover vagas e usuários que violem os termos da plataforma.

## :spiral_calendar: Entidades ou tabelas do sistema

* User: Armazena os dados de login de todos os usuários (`id`, `name`, `email`, `password`, `role`). O campo role define se é 'aluno', 'instituição' ou 'admin'.

* Institution: Contém as informações detalhadas das instituições (`id`, `userId`, `name`, `description`, `address`, `status`). O status ('pending', 'approved') é controlado pelo Admin.

* VolunteerOpportunity: Descreve cada vaga de voluntariado (`id`, `institutionId`, `title`, `description`, `category`, `workload_hours`).

* Application: Tabela de ligação que representa a candidatura de um aluno a uma vaga (`id`, `studentId`, `opportunityId`, `status`, `institution_document_url`, `student_signed_document_url`, `final_document_url`). É o coração do sistema, gerenciando todo o fluxo da candidatura.
