import { AppDataSource } from "./src/data-source";
import { VolunteerOpportunity } from "./src/entities/VolunteerOpportunity";

async function checkCities() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const repo = AppDataSource.getRepository(VolunteerOpportunity);

  const cities = await repo
    .createQueryBuilder("o")
    .select("DISTINCT o.city", "city")
    .where("o.city IS NOT NULL")
    .orderBy("o.city", "ASC")
    .getRawMany();

  console.log("\n Cidades encontradas no banco:");
  cities.forEach((c, idx) => {
    console.log(`  ${idx + 1}. "${c.city}"`);
  });

  console.log("\n Contagem de oportunidades por cidade:");
  const cityCount = await repo
    .createQueryBuilder("o")
    .select("o.city", "city")
    .addSelect("COUNT(o.id)", "count")
    .where("o.city IS NOT NULL AND o.isActive = :isActive", { isActive: true })
    .groupBy("o.city")
    .orderBy("count", "DESC")
    .getRawMany();

  cityCount.forEach((c) => {
    console.log(`  ${c.city}: ${c.count} oportunidade(s)`);
  });

  console.log("\n Verificação concluída!\n");
  process.exit(0);
}

checkCities().catch((err) => {
  console.error(" Erro:", err);
  process.exit(1);
});
