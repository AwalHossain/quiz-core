import { ExamService } from "../src/exam/exam.service";
import { QuestionsService } from "../src/questions/questions.service";
import { PrismaService } from "../src/prisma/prisma.service";
import { CreateExamDto } from "../src/exam/dtos/createExam.dto";
import { OptionLetter } from "@prisma/client";
import { examQuestions } from "./data";

const prisma = new PrismaService();
const examService = new ExamService(prisma);
const questionsService = new QuestionsService(prisma);

const sampleExams = [
  {
    title: "Mathematics Assessment",
    description: "Test your mathematical skills from basic to advanced concepts",
    duration: 10,
    passingScore: 30,
    startTime: null,
    endTime: null,
  },
  {
    title: "Islamic Studies Comprehensive",
    description: "Evaluate your knowledge of Islamic history and principles",
    duration: 15,
    passingScore: 20,
    startTime: null,
    endTime: null,
  },
  {
    title: "Science Explorer",
    description: "Test your understanding of basic scientific concepts",
    duration: 15,
    passingScore: 30,
    startTime: null,
    endTime: null,
  },
  {
    title: "English Literature",
    description: "Assess your knowledge of classic literature and authors",
    duration: 15,
    passingScore: 20,
    startTime: null,
    endTime: null,
  },
  {
    title: "General Knowledge",
    description: "Test your awareness about various general topics",
    duration: 10,
    passingScore: 25,
    startTime: null,
    endTime: null,
  },
];

// ... rest of the seeding code remains the same ...

async function seedExamsAndQuestions() {
  try {
    console.log("Starting seed...");

    // Create exams

    // Create questions for each exam
    for (const examData of sampleExams) {
      // create exam
      const exam = await examService.createExam(examData as CreateExamDto);
      console.log(`Created exam: ${exam.title}`);

      // get the question for this exam
      const questions = examQuestions[exam.title];
      for (const questionData of questions) {
        await questionsService.createQuestion([
          {
            questionText: questionData.questionText,
            options: questionData.options,
            examId: exam.id,
            correctOptionId: questionData.correctOptionId as OptionLetter,
          },
        ]);
        console.log(`Created question for exam: ${exam.title}`);
      }
      console.log(`Completed seeding for exam: ${exam.title}`);
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
seedExamsAndQuestions();
