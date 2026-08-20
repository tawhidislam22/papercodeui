import { PrismaClient, Difficulty, BlockType } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log('Seeding real-world lessons...');
    // Ensure Javascript language exists
    let jsLanguage = await prisma.language.findUnique({ where: { slug: 'javascript' } });
    if (!jsLanguage) {
        jsLanguage = await prisma.language.create({
            data: {
                name: 'JavaScript',
                slug: 'javascript',
                icon: 'SiJavascript',
                color: '#F7DF1E',
                description: 'The language of the web.',
                isActive: true,
                sortOrder: 1,
            }
        });
    }
    // Ensure Python language exists
    let pyLanguage = await prisma.language.findUnique({ where: { slug: 'python' } });
    if (!pyLanguage) {
        pyLanguage = await prisma.language.create({
            data: {
                name: 'Python',
                slug: 'python',
                icon: 'SiPython',
                color: '#3776AB',
                description: 'Data science, AI, and scripting.',
                isActive: true,
                sortOrder: 2,
            }
        });
    }
    // Real-world Lesson 1: Build a To-Do List CLI in Python
    const pyLesson = await prisma.lesson.create({
        data: {
            languageId: pyLanguage.id,
            title: 'Real-World Python: CLI To-Do App',
            slug: 'real-world-python-cli-todo',
            description: 'Learn how to handle standard input, loops, and state management by building a terminal-based To-Do list manager from scratch.',
            difficulty: Difficulty.INTERMEDIATE,
            xpReward: 150,
            estimatedMinutes: 20,
            sortOrder: 10,
            isPublished: true,
            chapters: {
                create: [
                    {
                        title: '1. Project Setup & State',
                        description: 'Learn how to store tasks in memory using lists and dictionaries.',
                        sortOrder: 0,
                        estimatedMinutes: 5,
                        xpReward: 30,
                        isPublished: true,
                        blocks: {
                            create: [
                                {
                                    type: BlockType.THEORY,
                                    title: 'State Management in Python',
                                    content: 'In any application, "State" is the data that changes over time. For our To-Do CLI, our state is simply a list of tasks.\n\n```python\n# Our simple state\ntasks = []\n\ndef add_task(title):\n    tasks.append({"title": title, "done": False})\n```\n\nLists are perfect for ordered collections like this.',
                                    sortOrder: 0,
                                },
                                {
                                    type: BlockType.CODING,
                                    title: 'Implement the Task Store',
                                    sortOrder: 1,
                                    coding: {
                                        create: {
                                            question: 'Write a program that initializes an empty list called `tasks`. Create a function `add_task(title)` that appends a dictionary with `title` and `done: False`. Then call `add_task("Buy milk")` and print the `tasks` list.',
                                            starterCode: 'tasks = []\n\ndef add_task(title):\n    # Your code here\n    pass\n\n# Call it and print',
                                            expectedOutput: "[{'title': 'Buy milk', 'done': False}]",
                                            language: 'python'
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    {
                        title: '2. Handling User Input',
                        description: 'Create the interactive loop to accept commands from the user.',
                        sortOrder: 1,
                        estimatedMinutes: 10,
                        xpReward: 50,
                        isPublished: true,
                        blocks: {
                            create: [
                                {
                                    type: BlockType.THEORY,
                                    title: 'The Infinite Loop (REPL)',
                                    content: 'CLI applications run in a REPL loop (Read, Evaluate, Print, Loop). In Python, we achieve this using an infinite `while True:` loop and the `input()` function.\n\n```python\nwhile True:\n    cmd = input("Command: ")\n    if cmd == "quit":\n        break\n```',
                                    sortOrder: 0,
                                },
                                {
                                    type: BlockType.CODING,
                                    title: 'Build the REPL',
                                    sortOrder: 1,
                                    coding: {
                                        create: {
                                            question: 'Write a program that loops indefinitely. Inside the loop, it should read input. If the input is "add", print "Adding task". If the input is "quit", print "Goodbye!" and break the loop. (Test this using the stdin input box!)',
                                            starterCode: 'while True:\n    cmd = input()\n    # Your code here\n',
                                            expectedOutput: "Adding task\nGoodbye!",
                                            language: 'python'
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });
    // Real-world Lesson 2: Array Manipulation (JavaScript Shopping Cart)
    const jsLesson = await prisma.lesson.create({
        data: {
            languageId: jsLanguage.id,
            title: 'JS Arrays: Shopping Cart Logic',
            slug: 'js-arrays-shopping-cart',
            description: 'Master JavaScript array methods (map, filter, reduce) by implementing the core logic of an e-commerce shopping cart.',
            difficulty: Difficulty.INTERMEDIATE,
            xpReward: 200,
            estimatedMinutes: 25,
            sortOrder: 11,
            isPublished: true,
            chapters: {
                create: [
                    {
                        title: '1. Calculating Totals with Reduce',
                        description: 'Use the reduce method to calculate the total price of all items in the cart.',
                        sortOrder: 0,
                        estimatedMinutes: 10,
                        xpReward: 50,
                        isPublished: true,
                        blocks: {
                            create: [
                                {
                                    type: BlockType.THEORY,
                                    title: 'The Power of Reduce',
                                    content: '`Array.prototype.reduce()` is the most powerful array method. It allows you to boil down an array of items into a single value, like a sum.\n\n```javascript\nconst numbers = [1, 2, 3];\nconst sum = numbers.reduce((acc, curr) => acc + curr, 0);\n```',
                                    sortOrder: 0,
                                },
                                {
                                    type: BlockType.CODING,
                                    title: 'Calculate Cart Total',
                                    sortOrder: 1,
                                    coding: {
                                        create: {
                                            question: 'Given an array of cart items, use `reduce` to calculate the total cost (price * quantity). Print the final total.',
                                            starterCode: 'const cart = [\n  { id: 1, price: 15, quantity: 2 },\n  { id: 2, price: 30, quantity: 1 }\n];\n\n// Calculate total using reduce',
                                            expectedOutput: "60",
                                            language: 'javascript'
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    {
                        title: '2. Filtering Out of Stock',
                        description: 'Remove out-of-stock items before checkout.',
                        sortOrder: 1,
                        estimatedMinutes: 5,
                        xpReward: 30,
                        isPublished: true,
                        blocks: {
                            create: [
                                {
                                    type: BlockType.MCQ,
                                    title: 'Array.filter() Basics',
                                    sortOrder: 0,
                                    mcq: {
                                        create: {
                                            question: 'What does the callback function of Array.filter() need to return?',
                                            options: ['A new transformed object', 'A boolean (true/false)', 'The original array', 'Nothing (undefined)'],
                                            correctIndex: 1,
                                            explanation: 'The filter callback must return a boolean. If it returns true, the element is kept. If false, it is removed.'
                                        }
                                    }
                                },
                                {
                                    type: BlockType.CODING,
                                    title: 'Clean the Cart',
                                    sortOrder: 1,
                                    coding: {
                                        create: {
                                            question: 'Write a program that filters out the items where `inStock` is false, and prints the IDs of the remaining items. Ensure each ID is on its own line.',
                                            starterCode: 'const items = [\n  { id: "A", inStock: true },\n  { id: "B", inStock: false },\n  { id: "C", inStock: true }\n];\n\n// Filter and print',
                                            expectedOutput: "A\nC",
                                            language: 'javascript'
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });
    console.log('Real-world lessons seeded successfully!');
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
