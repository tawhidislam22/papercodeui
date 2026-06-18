import { Difficulty, PrismaClient, Role, SubmissionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.aIReview.deleteMany();
  await prisma.codeExecution.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.lessonBlock.deleteMany();
  await prisma.mCQQuestion.deleteMany();
  await prisma.codingChallenge.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.xPHistory.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.xpEvent.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.blogLike.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.language.deleteMany();
  await prisma.user.deleteMany();

  const users = {
    admin: {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'admin@papercode.dev',
      password: 'Admin#123',
      username: 'admin',
      displayName: 'Paper Admin',
      avatarUrl: '',
      bio: 'Platform administrator',
      role: Role.ADMIN,
      xp: 1200,
      streak: 30,
      longestStreak: 45,
    },
    author: {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'author@papercode.dev',
      password: 'Author#123',
      username: 'author_one',
      displayName: 'Author One',
      avatarUrl: '',
      bio: 'Writes coding tutorials',
      role: Role.AUTHOR,
      xp: 900,
      streak: 14,
      longestStreak: 22,
    },
    learner: {
      id: '33333333-3333-3333-3333-333333333333',
      email: 'learner@papercode.dev',
      password: 'Learner#123',
      username: 'learner_one',
      displayName: 'Learner One',
      avatarUrl: '',
      bio: 'Learning daily',
      role: Role.USER,
      xp: 460,
      streak: 8,
      longestStreak: 12,
    },
  };

  await prisma.user.createMany({
    data: Object.values(users),
  });

  await prisma.streak.createMany({
    data: [
      {
        userId: users.learner.id,
        currentStreak: 8,
        longestStreak: 12,
        lastActiveDate: new Date(),
      },
    ],
  });

  const languages = [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
      name: 'JavaScript',
      slug: 'javascript',
      icon: 'JS',
      color: '#F7DF1E',
      description: 'The language of the web.',
      isActive: true,
      sortOrder: 1,
    },
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
      name: 'Python',
      slug: 'python',
      icon: 'PY',
      color: '#3776AB',
      description: 'Simple and expressive programming language.',
      isActive: true,
      sortOrder: 2,
    },
  ];

  await prisma.language.createMany({ data: languages });

  const jsLesson = await prisma.lesson.create({
    data: {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
      languageId: languages[0].id,
      title: 'JavaScript Foundations',
      slug: 'js-foundations',
      description: 'Learn variables, control flow, and functions with hands-on practice.',
      difficulty: Difficulty.BEGINNER,
      xpReward: 120,
      estimatedMinutes: 70,
      sortOrder: 1,
      isPublished: true,
      chapters: {
        create: [
          {
            id: 'cccccccc-cccc-cccc-cccc-ccccccccccc1',
            title: 'Variables and Types',
            description: 'Master primitives, variables, and console output.',
            sortOrder: 0,
            estimatedMinutes: 12,
            xpReward: 30,
            isPublished: true,
            blocks: {
              create: [
                {
                  id: 'dddddddd-dddd-dddd-dddd-ddddddddddd1',
                  type: 'THEORY',
                  sortOrder: 0,
                  title: 'Meet variables',
                  content: 'Use `let` and `const` to store data.\n\n```js\nconst name = "Paper";\nlet streak = 3;\n```',
                },
                {
                  id: 'dddddddd-dddd-dddd-dddd-ddddddddddd2',
                  type: 'MCQ',
                  sortOrder: 1,
                  title: 'Quick check',
                  content: '',
                  mcq: {
                    create: {
                      question: 'Which keyword creates a variable that can be reassigned?',
                      options: ['const', 'let', 'var only', 'final'],
                      correctIndex: 1,
                      explanation: '`let` variables can be reassigned. `const` locks the reference.',
                    },
                  },
                },
                {
                  id: 'dddddddd-dddd-dddd-dddd-ddddddddddd3',
                  type: 'CODING',
                  sortOrder: 2,
                  title: 'Code it',
                  content: '',
                  coding: {
                    create: {
                      question: 'Create a variable `total` that stores the sum of 7 and 5. Log it.',
                      starterCode: 'const total = 0;\nconsole.log(total);',
                      expectedOutput: '12',
                      language: 'javascript',
                      hints: ['Use the + operator', 'Update the value of total'],
                    },
                  },
                },
              ],
            },
          },
          {
            id: 'cccccccc-cccc-cccc-cccc-ccccccccccc2',
            title: 'Functions in Action',
            description: 'Write reusable helpers and practice calling them.',
            sortOrder: 1,
            estimatedMinutes: 14,
            xpReward: 40,
            isPublished: true,
            blocks: {
              create: [
                {
                  id: 'dddddddd-dddd-dddd-dddd-ddddddddddd4',
                  type: 'THEORY',
                  sortOrder: 0,
                  title: 'Function basics',
                  content: 'Functions group logic you can reuse.\n\n```js\nfunction greet(name) {\n  return `Hello ${name}`;\n}\n```',
                },
                {
                  id: 'dddddddd-dddd-dddd-dddd-ddddddddddd5',
                  type: 'CODING',
                  sortOrder: 1,
                  title: 'Build a greeter',
                  content: '',
                  coding: {
                    create: {
                      question: 'Write a function `greet` that returns `Hi, <name>!`.',
                      starterCode: 'function greet(name) {\n  // TODO\n}\n',
                      expectedOutput: 'Hi, Ada!',
                      language: 'javascript',
                      hints: ['Use template literals', 'Return the string'],
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  const pythonLesson = await prisma.lesson.create({
    data: {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
      languageId: languages[1].id,
      title: 'Python Control Flow',
      slug: 'python-control-flow',
      description: 'Learn if statements, loops, and list traversal in Python.',
      difficulty: Difficulty.BEGINNER,
      xpReward: 90,
      estimatedMinutes: 55,
      sortOrder: 2,
      isPublished: true,
      chapters: {
        create: [
          {
            id: 'cccccccc-cccc-cccc-cccc-ccccccccccc3',
            title: 'If statements',
            description: 'Create branches that react to user input.',
            sortOrder: 0,
            estimatedMinutes: 10,
            xpReward: 25,
            isPublished: true,
            blocks: {
              create: [
                {
                  id: 'dddddddd-dddd-dddd-dddd-ddddddddddd6',
                  type: 'THEORY',
                  sortOrder: 0,
                  title: 'Branching logic',
                  content: 'Python uses indentation to group logic.\n\n```py\nif score > 90:\n    print("Great job!")\n```',
                },
                {
                  id: 'dddddddd-dddd-dddd-dddd-ddddddddddd7',
                  type: 'MCQ',
                  sortOrder: 1,
                  title: 'Control check',
                  content: '',
                  mcq: {
                    create: {
                      question: 'Which keyword starts an alternate branch?',
                      options: ['else', 'switch', 'case', 'break'],
                      correctIndex: 0,
                      explanation: '`else` handles the fallback branch in Python.',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  const challenges = [
    {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
      lessonId: jsLesson.id,
      languageId: languages[0].id,
      title: 'Sum Two Numbers',
      description: 'Read two numbers and print their sum.',
      starterCode: 'function solve(a, b) {\n  // TODO\n}',
      expectedOutput: '7',
      hints: ['Use the + operator', 'Return the result'],
      difficulty: Difficulty.BEGINNER,
      xpReward: 50,
      isPublished: true,
    },
    {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2',
      lessonId: pythonLesson.id,
      languageId: languages[1].id,
      title: 'FizzBuzz',
      description: 'Print Fizz, Buzz, or FizzBuzz from 1 to n.',
      starterCode: 'def fizz_buzz(n):\n    pass',
      expectedOutput: '1 2 Fizz 4 Buzz ...',
      hints: ['Check divisibility by 3 and 5 first'],
      difficulty: Difficulty.BEGINNER,
      xpReward: 50,
      isPublished: true,
    },
  ];

  await prisma.challenge.createMany({ data: challenges });

  await prisma.userProgress.create({
    data: {
      userId: users.learner.id,
      lessonId: jsLesson.id,
      chapterId: 'cccccccc-cccc-cccc-cccc-ccccccccccc1',
      currentBlockId: 'dddddddd-dddd-dddd-dddd-ddddddddddd2',
      completedBlockIds: ['dddddddd-dddd-dddd-dddd-ddddddddddd1'],
      attempts: 1,
      isCompleted: false,
    },
  });

  await prisma.xPHistory.createMany({
    data: [
      {
        userId: users.learner.id,
        sourceType: 'lesson',
        sourceId: jsLesson.id,
        xpAmount: 20,
      },
    ],
  });

  const submissions = [
    {
      id: 'ffffffff-ffff-ffff-ffff-fffffffffff1',
      userId: users.learner.id,
      challengeId: challenges[0].id,
      languageId: languages[0].id,
      originalImageUrl: '/uploads/submission-1.jpg',
      extractedCode: 'function solve(a,b){ return a+b }',
      correctedCode: 'function solve(a, b) {\n  return a + b;\n}',
      aiFeedback: 'Great work. Added spacing and semicolon.',
      aiExplanation: 'Your logic was correct; style improvements were suggested.',
      runOutput: '7',
      score: 92,
      status: SubmissionStatus.COMPLETED,
    },
  ];

  await prisma.submission.createMany({ data: submissions });

  const blogs = [
    {
      id: '99999999-9999-9999-9999-999999999991',
      authorId: users.author.id,
      title: 'Why Handwriting Code Improves Learning',
      slug: 'why-handwriting-code-improves-learning',
      excerpt: 'Writing code by hand can improve memory and understanding.',
      content: 'Long-form blog content here.',
      coverImageUrl: '',
      tags: ['Learning', 'Productivity'],
      aiSummary: 'Handwriting helps retention.',
      isPublished: true,
      views: 120,
      likesCount: 1,
      commentsCount: 1,
      readingTime: 6,
    },
  ];

  await prisma.blog.createMany({ data: blogs });

  await prisma.blogLike.create({
    data: {
      blogId: blogs[0].id,
      userId: users.learner.id,
    },
  });

  await prisma.comment.create({
    data: {
      id: '99999999-9999-9999-9999-999999999992',
      blogId: blogs[0].id,
      userId: users.learner.id,
      content: 'This post helped me stay consistent. Thanks!'
    },
  });

  await prisma.bookmark.create({
    data: {
      id: '99999999-9999-9999-9999-999999999993',
      blogId: blogs[0].id,
      userId: users.learner.id,
    },
  });

  await prisma.follow.create({
    data: {
      id: '99999999-9999-9999-9999-999999999994',
      followerId: users.learner.id,
      followingId: users.author.id,
    },
  });

  await prisma.xpEvent.createMany({
    data: [
      {
        id: '12121212-1212-1212-1212-121212121211',
        userId: users.learner.id,
        eventType: 'daily_login',
        xpAmount: 5,
        description: 'Logged in today.',
      },
    ],
  });

  console.log('Seed complete.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
