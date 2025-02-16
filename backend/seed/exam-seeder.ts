import { ExamService } from "../src/exam/exam.service";
import { QuestionsService } from "../src/questions/questions.service";
import { PrismaService } from "../src/prisma/prisma.service";
import { CreateExamDto } from "../src/exam/dtos/createExam.dto";
import { OptionLetter } from "@prisma/client";

const prisma = new PrismaService();
const examService = new ExamService(prisma);
const questionsService = new QuestionsService(prisma);

const sampleExams = [
  {
    title: "New Math Quiz",
    description: "Test your basic math skills with this simple quiz",
    duration: 30,
    passingScore: 60,
    startTime: null,
    endTime: null,
  },
  {
    title: "New Islamic Studies",
    description: "Test your knowledge about Islamic studies",
    duration: 45,
    passingScore: 70,
    startTime: null,
    endTime: null,
  },
];

const sampleQuestions = [
  // Math Questions
  {
    questionText: "What is 2 + 2?",
    correctOptionId: "A",
    options: [
      { optionText: "4", optionLetter: "A" },
      { optionText: "3", optionLetter: "B" },
      { optionText: "5", optionLetter: "C" },
      { optionText: "6", optionLetter: "D" },
    ],
  },
  // Islamic History Questions
  {
    questionText: "Who was the first Caliph of Islam?",
    correctOptionId: "B",
    options: [
      { optionText: "Umar (RA)", optionLetter: "A" },
      { optionText: "Abu Bakr (RA)", optionLetter: "B" },
      { optionText: "Uthman (RA)", optionLetter: "C" },
      { optionText: "Ali (RA)", optionLetter: "D" },
    ],
  },
  {
    questionText: "What is the capital of France?",
    correctOptionId: "A",
    options: [
      { optionText: "Paris", optionLetter: "A" },
      { optionText: "London", optionLetter: "B" },
      { optionText: "Berlin", optionLetter: "C" },
      { optionText: "Madrid", optionLetter: "D" },
    ],
  },
  {
    questionText: "Who wrote 'Romeo and Juliet'?",
    correctOptionId: "B",
    options: [
      { optionText: "Charles Dickens", optionLetter: "A" },
      { optionText: "William Shakespeare", optionLetter: "B" },
      { optionText: "Jane Austen", optionLetter: "C" },
      { optionText: "Mark Twain", optionLetter: "D" },
    ],
  },
  // Add more questions as needed
];

async function seedExamsAndQuestions() {
  try {
    console.log("Starting seed...");

    // Create exams
    const createdExams = await Promise.all(
      sampleExams.map(async (examData) => {
        const exam = await examService.createExam(examData as CreateExamDto);
        console.log(`Created exam: ${exam.title}`);
        return exam;
      })
    );

    // Create questions for each exam
    for (const exam of createdExams) {
      for (const questionData of sampleQuestions) {
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
