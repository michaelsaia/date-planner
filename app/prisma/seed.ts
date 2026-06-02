import path from "path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { DATE_IDEAS } from "./date-ideas-seed";

const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

const DEFAULT_INTERESTS = [
  { name: "Hiking", category: "Outdoor" },
  { name: "Fine Dining", category: "Food" },
  { name: "Live Music", category: "Entertainment" },
  { name: "Cooking", category: "Food" },
  { name: "Movies", category: "Entertainment" },
  { name: "Art Galleries", category: "Culture" },
  { name: "Board Games", category: "Indoor" },
  { name: "Wine Tasting", category: "Food" },
  { name: "Dancing", category: "Entertainment" },
  { name: "Photography", category: "Creative" },
  { name: "Yoga", category: "Wellness" },
  { name: "Beach", category: "Outdoor" },
  { name: "Cycling", category: "Outdoor" },
  { name: "Theater", category: "Culture" },
  { name: "Spa Day", category: "Wellness" },
  { name: "Bowling", category: "Indoor" },
  { name: "Karaoke", category: "Entertainment" },
  { name: "Farmers Market", category: "Outdoor" },
  { name: "Stargazing", category: "Outdoor" },
  { name: "Escape Room", category: "Indoor" },
];

async function main() {
  console.log("Seeding interests...");

  for (const interest of DEFAULT_INTERESTS) {
    await prisma.interest.upsert({
      where: { name: interest.name },
      update: {},
      create: interest,
    });
  }

  console.log(`Seeded ${DEFAULT_INTERESTS.length} interests.`);

  // Build a name -> id lookup for interests
  const allInterests = await prisma.interest.findMany();
  const interestByName = new Map(allInterests.map((i) => [i.name, i.id]));

  console.log("Seeding date ideas...");

  for (const idea of DATE_IDEAS) {
    const existing = await prisma.dateIdea.findFirst({
      where: { title: idea.title },
    });
    if (existing) continue;

    const created = await prisma.dateIdea.create({
      data: {
        title: idea.title,
        description: idea.description,
        mood: idea.mood,
        estimatedCost: idea.estimatedCost,
        surprise: idea.surprise,
        activities: {
          create: idea.activities,
        },
      },
    });

    // Link to interests
    for (const interestName of idea.relatedInterests) {
      const interestId = interestByName.get(interestName);
      if (interestId) {
        await prisma.dateIdeaInterest.create({
          data: { dateIdeaId: created.id, interestId },
        });
      }
    }
  }

  console.log(`Seeded ${DATE_IDEAS.length} date ideas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
