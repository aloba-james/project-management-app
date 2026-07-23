import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    try {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "team.json",
    "project.json",
    "projectTeam.json",
    "user.json",
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  await deleteAllData(orderedFileNames);

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    // Seed JSON is anchored in 2023–2024; shift into the current year window
    // so calendar/timeline demos stay populated.
    const anchorYear = 2023;
    const yearShift = new Date().getFullYear() - anchorYear;

    const shiftDate = (value: unknown) => {
      if (typeof value !== "string" || !value) return value;
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      date.setFullYear(date.getFullYear() + yearShift);
      return date.toISOString();
    };

    try {
      for (const data of jsonData) {
        const record = { ...data } as Record<string, unknown>;
        for (const key of ["startDate", "dueDate", "endDate"]) {
          if (key in record) record[key] = shiftDate(record[key]);
        }
        await model.create({ data: record });
      }
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(`Error seeding data for ${modelName}:`, error);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());