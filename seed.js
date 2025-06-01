require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Submission = require('./models/Submission');

const MONGO_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🌱 Connected to MongoDB Atlas");

    // Clear existing data
    await User.deleteMany();
    await Quiz.deleteMany();
    await Submission.deleteMany();
    console.log("🧹 Cleared existing collections");

    // Hash passwords
    const hashed1 = await bcrypt.hash('password123', 10);
    const hashed2 = await bcrypt.hash('password456', 10);

    // Create users
    const users = await User.insertMany([
      { username: 'alice', email: 'alice@example.com', passwordHash: hashed1 },
      { username: 'bob', email: 'bob@example.com', passwordHash: hashed2 },
    ]);
    console.log(`👤 Users inserted: ${users.length}`);

    // Create quizzes
    const quizzes = await Quiz.insertMany([
  {
    title: 'Anti-Doping Awareness',
    description: 'Test your knowledge about anti-doping rules, substances, and ethics.',
    questions: [{
      question: 'Which of the following is an example of a method prohibited in anti-doping?',
      options: ['Blood doping', 'Wearing performance gear', 'Listening to music while training', 'Daily supplements'],
      correctAnswerIndex: 0,
    },
    {
      question: 'What does “strict liability” mean in anti-doping?',
      options: ['Only the coach is responsible', 'Athletes are responsible for what is in their body', 'No rules apply', 'Teams are punished, not individuals'],
      correctAnswerIndex: 1,
    },
    {
      question: 'Which of the following is a consequence of doping?',
      options: ['Increased fan support', 'Permanent Olympic ban', 'Medal upgrades', 'Better job offers'],
      correctAnswerIndex: 1,
    },
    {
      question: 'How can athletes check if a substance is banned?',
      options: ['Guess based on instinct', 'Ask a friend', 'Use a verified online database or consult sports authority', 'Assume it is allowed'],
      correctAnswerIndex: 2,
    },
    {
      question: 'Why is it important to promote clean sport?',
      options: ['To maintain fair competition', 'To protect athlete health', 'To uphold the integrity of sport', 'All of the above'],
      correctAnswerIndex: 3,
    }]
  },
  {
    title: 'Substances and Prohibited Methods',
    description: 'Understand what substances and methods are banned in sports.',
    questions: [
      {
        question: 'Which of these is a prohibited method in anti-doping?',
        options: ['Blood transfusion to enhance performance', 'Wearing high-tech shoes', 'Stretching before a game', 'Drinking water'],
        correctAnswerIndex: 0,
      }
    ]
  },
  {
    title: 'Health Risks of Doping',
    description: 'Learn about the health risks associated with performance-enhancing drugs.',
    questions: [
      {
        question: 'What is a common side effect of anabolic steroid abuse?',
        options: ['Improved immunity', 'Liver damage', 'Hair growth', 'Lower cholesterol'],
        correctAnswerIndex: 1,
      }
    ]
  },
  {
    title: 'Testing Procedures',
    description: 'Explore how doping tests are conducted and when they occur.',
    questions: [
      {
        question: 'When can anti-doping tests be conducted?',
        options: ['Only during events', 'Only in the off-season', 'At any time, including out-of-competition', 'Only during training'],
        correctAnswerIndex: 2,
      }
    ]
  },
  {
    title: 'Therapeutic Use Exemptions (TUEs)',
    description: 'Understand the process and purpose of a TUE.',
    questions: [
      {
        question: 'What does a TUE allow an athlete to do?',
        options: ['Skip doping tests', 'Use a banned substance for a legitimate medical condition', 'Compete in banned events', 'Avoid penalties'],
        correctAnswerIndex: 1,
      }
    ]
  },
  {
    title: 'Athletes’ Responsibilities',
    description: 'Know your rights and responsibilities as an athlete.',
    questions: [
      {
        question: 'Who is responsible for ensuring that no banned substances enter an athlete’s body?',
        options: ['Coach', 'Doctor', 'Athlete', 'Team manager'],
        correctAnswerIndex: 2,
      }
    ]
  },
  {
    title: 'History of Anti-Doping',
    description: 'Trace the history and evolution of anti-doping regulations.',
    questions: [
      {
        question: 'When was the World Anti-Doping Agency (WADA) established?',
        options: ['1985', '1999', '2005', '2012'],
        correctAnswerIndex: 1,
      }
    ]
  },
  {
    title: 'Doping Cases in Sports',
    description: 'Famous doping cases and what we can learn from them.',
    questions: [
      {
        question: 'Which cyclist was stripped of seven Tour de France titles due to doping?',
        options: ['Chris Froome', 'Lance Armstrong', 'Jan Ullrich', 'Eddy Merckx'],
        correctAnswerIndex: 1,
      }
    ]
  },
  {
    title: 'Clean Sport Advocacy',
    description: 'Why is clean sport essential and how to support it?',
    questions: [
      {
        question: 'What is one way to promote clean sport?',
        options: ['Encourage shortcuts', 'Educate athletes on banned substances', 'Ignore violations', 'Support black market supplements'],
        correctAnswerIndex: 1,
      }
    ]
  },
  {
    title: 'Anti-Doping and Youth Sports',
    description: 'Educating young athletes about ethical practices.',
    questions: [
      {
        question: 'Why is it important to talk to young athletes about doping?',
        options: ['To improve their diet', 'To encourage risk-taking', 'To promote early awareness and ethical behavior', 'To scare them'],
        correctAnswerIndex: 2,
      }
    ]
  },
  {
    title: 'Anti-Doping Rules & Violations',
    description: 'Familiarize yourself with violations and penalties.',
    questions: [
      {
        question: 'What happens when an athlete is found guilty of doping?',
        options: ['They are promoted', 'They face potential bans, loss of medals, and reputational damage', 'They are rewarded', 'They get a warning only'],
        correctAnswerIndex: 1,
      }
    ]
  },
]);
console.log(`🧠 Quizzes inserted: ${quizzes.length}`);

    // Create submissions
    const submissions = await Submission.insertMany([
      {
        user: users[0]._id,
        quiz: quizzes[0]._id,
        score: 2,
        totalQuestions: 2,
        answers: [0, 1],
      },
      {
        user: users[1]._id,
        quiz: quizzes[0]._id,
        score: 1,
        totalQuestions: 2,
        answers: [2, 1],
      },
      {
        user: users[0]._id,
        quiz: quizzes[1]._id,
        score: 2,
        totalQuestions: 2,
        answers: [0, 0],
      },
    ]);
    console.log(`📝 Submissions inserted: ${submissions.length}`);

    console.log("✅ Seeding complete");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seed();
