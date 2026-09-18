import { User, Course, Lesson, UserProgress, AuditLogItem, PlatformSettings, TrainerPermission, Certificate } from '../types';

export const initialUsers: User[] = [
  {
    id: 'usr_student_1',
    name: 'Alex Kimani',
    email: 'alex.kimani@fusionedutech.com',
    role: 'student',
    status: 'approved',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Junior Software Fellow',
    bio: 'Learning Python and Data Analytics to build impactful software solutions in Nairobi.',
    joinedDate: '2026-08-14'
  },
  {
    id: 'usr_trainer_1',
    name: 'Dr. Sarah Wanjiku',
    email: 'dr.sarah@fusionedutech.com',
    role: 'trainer',
    status: 'approved',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Technical Trainer & Data Scientist',
    bio: 'PhD in Computer Science with 10+ years coaching Python, algorithms, and applied machine learning.',
    joinedDate: '2026-06-01'
  },
  {
    id: 'usr_admin_1',
    name: 'Jane Omondi',
    email: 'jane.omondi@fusionedutech.com',
    role: 'admin',
    status: 'approved',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'Head of Learning Operations (Super Admin)',
    bio: 'Overseeing curriculum delivery, student accreditation, and platform excellence at Fusion EduTech.',
    joinedDate: '2026-05-15'
  },
  {
    id: 'usr_pending_1',
    name: 'Brian Mwangi',
    email: 'brian.m@example.com',
    role: 'student',
    status: 'approved',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Cyber Defense Fellow',
    bio: 'Interested in Ethical Hacking and Cyber Defense fundamentals.',
    joinedDate: '2026-09-17'
  },
  {
    id: 'usr_pending_2',
    name: 'Fatima Hassan',
    email: 'fatima.h@example.com',
    role: 'student',
    status: 'approved',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Digital Marketing Fellow',
    bio: 'Aspiring social media strategist and digital marketer.',
    joinedDate: '2026-09-18'
  }
];

export const initialCourses: Course[] = [
  {
    id: 'crs_python',
    slug: 'python-programming',
    title: 'Python Programming Essentials',
    subject: 'Python',
    level: 'Foundation',
    difficulty: 'Beginner',
    description: 'Master foundational computer programming with modern Python 3. From syntax and variables to control structures, functions, and core data collections.',
    duration: '4 Weeks (16 Hours)',
    trainerId: 'usr_trainer_1',
    trainerName: 'Dr. Sarah Wanjiku',
    trainerTitle: 'Lead Technical Trainer',
    topics: ['Syntax', 'Variables', 'Control Flow', 'Functions', 'Data Structures', 'Algorithms'],
    published: true,
    certificateEnabled: true,
    quizzesEnabled: true,
    enrolledCount: 142,
    completionRate: 78
  },
  {
    id: 'crs_data_foundation',
    slug: 'data-analytics-foundation',
    title: 'Data Analytics: Foundation',
    subject: 'Data Analytics',
    level: 'Foundation',
    difficulty: 'Beginner',
    description: 'Build intuition for data exploration, summary metrics, tabular data structures, and storytelling using Python data fundamentals.',
    duration: '3 Weeks (12 Hours)',
    trainerId: 'usr_trainer_1',
    trainerName: 'Dr. Sarah Wanjiku',
    trainerTitle: 'Lead Technical Trainer',
    topics: ['Tabular Data', 'Descriptive Stats', 'Data Exploration', 'Python for Data'],
    published: true,
    certificateEnabled: true,
    quizzesEnabled: true,
    enrolledCount: 96,
    completionRate: 64
  },
  {
    id: 'crs_data_intermediate',
    slug: 'data-analytics-intermediate',
    title: 'Data Analytics: Intermediate',
    subject: 'Data Analytics',
    level: 'Intermediate',
    difficulty: 'Intermediate',
    description: 'Deep dive into exploratory data analysis (EDA), cleaning real-world dirty datasets, outlier management, and feature transformations.',
    duration: '4 Weeks (18 Hours)',
    trainerId: 'usr_trainer_1',
    trainerName: 'Dr. Sarah Wanjiku',
    trainerTitle: 'Lead Technical Trainer',
    topics: ['EDA', 'Data Cleaning', 'Aggregation', 'Missing Value Imputation'],
    published: true,
    certificateEnabled: true,
    quizzesEnabled: true,
    enrolledCount: 58,
    completionRate: 52
  },
  {
    id: 'crs_data_advanced',
    slug: 'data-analytics-advanced',
    title: 'Data Analytics: Advanced',
    subject: 'Data Analytics',
    level: 'Advanced',
    difficulty: 'Advanced',
    description: 'Formulate predictive regression and classification pipelines, automated statistical validation, and business insight delivery.',
    duration: '5 Weeks (22 Hours)',
    trainerId: 'usr_trainer_1',
    trainerName: 'Dr. Sarah Wanjiku',
    trainerTitle: 'Lead Technical Trainer',
    topics: ['Predictive Pipelines', 'Statistical Inference', 'Automated Workflows', 'Business Metrics'],
    published: false,
    certificateEnabled: true,
    quizzesEnabled: true,
    enrolledCount: 24,
    completionRate: 35
  },
  {
    id: 'crs_ethical_hacking',
    slug: 'ethical-hacking-fundamentals',
    title: 'Ethical Hacking & Cyber Defense',
    subject: 'Ethical Hacking',
    level: 'Foundation',
    difficulty: 'Intermediate',
    description: 'Understand defensive security principles, reconnaissance methodologies, network ports, vulnerability scanning, and ethical penetration practices.',
    duration: '6 Weeks (24 Hours)',
    trainerId: 'usr_trainer_1',
    trainerName: 'Dr. Sarah Wanjiku',
    trainerTitle: 'Lead Technical Trainer',
    topics: ['Network Protocols', 'Reconnaissance', 'Vulnerability Assessment', 'Security Hardening'],
    published: true,
    certificateEnabled: true,
    quizzesEnabled: true,
    enrolledCount: 88,
    completionRate: 61
  },
  {
    id: 'crs_social_media',
    slug: 'social-media-management',
    title: 'Social Media Management & Growth',
    subject: 'Social Media Management',
    level: 'Foundation',
    difficulty: 'Beginner',
    description: 'Learn strategic channel architecture, editorial content calendars, campaign performance tracking, and conversion optimization.',
    duration: '3 Weeks (10 Hours)',
    trainerId: 'usr_trainer_1',
    trainerName: 'Dr. Sarah Wanjiku',
    trainerTitle: 'Lead Technical Trainer',
    topics: ['Content Calendar', 'Audience Analytics', 'Brand Voice', 'Engagement Optimization'],
    published: true,
    certificateEnabled: true,
    quizzesEnabled: true,
    enrolledCount: 110,
    completionRate: 82
  }
];

export const initialLessons: Lesson[] = [
  // 4 Live Production Python Lessons
  {
    id: 'lsn_py_1',
    courseId: 'crs_python',
    order: 1,
    title: 'Python Basics & Variables',
    description: 'Understand Python syntax, printing output, dynamic typing, variable assignments, and basic arithmetic.',
    duration: '45 mins',
    difficulty: 'Beginner',
    topics: ['print()', 'Variables', 'Data Types', 'Arithmetic'],
    published: true,
    created_by: 'usr_trainer_1',
    contentBlocks: [
      {
        id: 'blk_py_1_1',
        order: 1,
        type: 'text',
        title: 'Introduction to Python & Variables',
        content: `### Welcome to Python Programming

Python is one of the most popular, human-readable programming languages in the world. At Fusion EduTech, we emphasize practical application from day one.

In Python, you do not need to explicitly declare variable types. Python dynamically identifies types at runtime:
- **Integers**: Whole numbers like \`42\` or \`-7\`
- **Floats**: Decimal numbers like \`3.1415\`
- **Strings**: Text surrounded by quotes like \`"Nairobi"\` or \`'Fusion'\`
- **Booleans**: \`True\` or \`False\`

Let's look at variable assignment:
\`\`\`python
student_name = "Alex Kimani"
course_code = "PY101"
enrolled = True
completed_modules = 3
\`\`\`
`
      },
      {
        id: 'blk_py_1_2',
        order: 2,
        type: 'code_playground',
        title: 'Interactive Code Playground: Running Python',
        content: `# Try running this code! Modify the variables and click "Run Code"
student_name = "Alex Kimani"
hours_studied = 12
target_hours = 20
hours_remaining = target_hours - hours_studied

print("Welcome to Fusion EduTech,", student_name)
print("Hours completed:", hours_studied)
print("Hours remaining to complete goal:", hours_remaining)
`,
        playgroundLanguage: 'python',
        expectedOutput: 'Welcome to Fusion EduTech, Alex Kimani\nHours completed: 12\nHours remaining to complete goal: 8'
      },
      {
        id: 'blk_py_1_3',
        order: 3,
        type: 'text',
        title: 'String Formatting with f-strings',
        content: `### Formatted String Literals (f-strings)

Modern Python uses **f-strings** to evaluate expressions directly within strings. Prefix your string with \`f\` and place expressions in curly braces:

\`\`\`python
score = 95
total = 100
percentage = (score / total) * 100
print(f"Final Grade: {percentage:.1f}%")
\`\`\`
`
      }
    ],
    exercises: [
      {
        id: 'ex_py_1_1',
        lessonId: 'lsn_py_1',
        order: 1,
        question: 'Which of the following represents a valid variable assignment in Python?',
        type: 'multiple_choice',
        options: [
          'let x = 10',
          'int x = 10;',
          'x = 10',
          'var x := 10'
        ],
        correctAnswer: 'x = 10',
        explanation: 'Python uses simple assignment syntax: variable_name = value. Type declarations and keywords like let or var are not used.',
        points: 10
      },
      {
        id: 'ex_py_1_2',
        lessonId: 'lsn_py_1',
        order: 2,
        question: 'In Python, variable names are case-sensitive. Is `score` the same variable as `Score`?',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Python is strictly case-sensitive. `score`, `Score`, and `SCORE` are three completely separate variable identifiers.',
        points: 10
      }
    ]
  },
  {
    id: 'lsn_py_2',
    courseId: 'crs_python',
    order: 2,
    title: 'Control Structures & Conditionals',
    description: 'Learn boolean logic, if-elif-else branch decisions, for-loops, while-loops, and iteration control.',
    duration: '50 mins',
    difficulty: 'Beginner',
    topics: ['if/elif/else', 'for loop', 'while loop', 'Comparison Operators'],
    published: true,
    created_by: 'usr_trainer_1',
    contentBlocks: [
      {
        id: 'blk_py_2_1',
        order: 1,
        type: 'text',
        title: 'Decision Making with if/elif/else',
        content: `### Branching Logic in Python

Control structures allow programs to make decisions based on dynamic conditions. 
Python uses **clean indentation** (4 spaces) rather than curly braces to define blocks of code:

\`\`\`python
score = 82

if score >= 80:
    grade = "Distinction"
elif score >= 60:
    grade = "Credit"
elif score >= 40:
    grade = "Pass"
else:
    grade = "Referral"
\`\`\`
`
      },
      {
        id: 'blk_py_2_2',
        order: 2,
        type: 'code_playground',
        title: 'Interactive Code Playground: Loops & Iteration',
        content: `# Iterating with for loops and range
topics = ["Variables", "Control Flow", "Functions", "Data Structures"]

print("Fusion EduTech Python Syllabus:")
for index, topic in enumerate(topics, start=1):
    print(f"Module {index}: {topic}")

total_sum = 0
for n in range(1, 6):
    total_sum += n
print("Sum of numbers 1 to 5 is:", total_sum)
`,
        playgroundLanguage: 'python'
      }
    ],
    exercises: [
      {
        id: 'ex_py_2_1',
        lessonId: 'lsn_py_2',
        order: 1,
        question: 'What keyword is used in Python to test multiple conditions after an initial `if`?',
        type: 'multiple_choice',
        options: ['else if', 'elseif', 'elif', 'otherwise'],
        correctAnswer: 'elif',
        explanation: 'Python condenses `else if` into the concise keyword `elif`.',
        points: 10
      }
    ]
  },
  {
    id: 'lsn_py_3',
    courseId: 'crs_python',
    order: 3,
    title: 'Functions and Modules',
    description: 'Encapsulate reusable logic with functions, default parameters, return statements, and module imports.',
    duration: '60 mins',
    difficulty: 'Intermediate',
    topics: ['def keyword', 'Arguments', 'return', 'import math'],
    published: true,
    created_by: 'usr_trainer_1',
    contentBlocks: [
      {
        id: 'blk_py_3_1',
        order: 1,
        type: 'text',
        title: 'Defining Functions in Python',
        content: `### Reusable Logic with Functions

Functions allow you to write clean, modular, and maintainable code. In Python, you define a function using the \`def\` keyword:

\`\`\`python
def calculate_grade(points, total_possible=100):
    ratio = points / total_possible
    return round(ratio * 100, 1)
\`\`\`
`
      },
      {
        id: 'blk_py_3_2',
        order: 2,
        type: 'code_playground',
        title: 'Interactive Playground: Writing Custom Functions',
        content: `def format_student_badge(name, course, score):
    status = "Pass" if score >= 70 else "Review Needed"
    return f"Student: {name} | Course: {course} | Score: {score}% | Status: {status}"

result1 = format_student_badge("Alex Kimani", "Python Basics", 92)
result2 = format_student_badge("Brian Mwangi", "Cyber Defense", 68)

print(result1)
print(result2)
`,
        playgroundLanguage: 'python'
      }
    ],
    exercises: [
      {
        id: 'ex_py_3_1',
        lessonId: 'lsn_py_3',
        order: 1,
        question: 'What keyword is used to send a calculated value back from a function to its caller?',
        type: 'multiple_choice',
        options: ['yield', 'send', 'return', 'output'],
        correctAnswer: 'return',
        explanation: 'The `return` statement exits a function and passes back the specified value to the caller.',
        points: 10
      }
    ]
  },
  {
    id: 'lsn_py_4',
    courseId: 'crs_python',
    order: 4,
    title: 'Data Structures: Lists, Dictionaries & Tuples',
    description: 'Work with Python collection types: mutable lists, key-value dictionaries, immutable tuples, and sets.',
    duration: '60 mins',
    difficulty: 'Intermediate',
    topics: ['Lists []', 'Dicts {}', 'Tuples ()', 'Sets {}'],
    published: true,
    created_by: 'usr_trainer_1',
    contentBlocks: [
      {
        id: 'blk_py_4_1',
        order: 1,
        type: 'text',
        title: 'Python Built-in Collection Types',
        content: `### Lists, Dictionaries, Tuples, and Sets

Choosing the right collection type is essential for clean code:
- **Lists \`[...]\`**: Ordered, mutable, indexed by integer.
- **Dictionaries \`{key: val}\`**: Key-value mappings, fast lookups.
- **Tuples \`(...)\`**: Ordered, immutable (cannot be modified after creation).
- **Sets \`{...}\`**: Unordered collection of unique items.
`
      },
      {
        id: 'blk_py_4_2',
        order: 2,
        type: 'code_playground',
        title: 'Interactive Playground: Working with Collections',
        content: `# Storing learner records in a list of dictionaries
students = [
    {"name": "Alex", "score": 88},
    {"name": "Faith", "score": 94},
    {"name": "Kevin", "score": 76}
]

# Calculate class average
total = 0
for s in students:
    print(f"Learner {s['name']}: {s['score']}/100")
    total += s['score']

avg = total / len(students)
print("Class Average:", round(avg, 2))
`,
        playgroundLanguage: 'python'
      }
    ],
    exercises: [
      {
        id: 'ex_py_4_1',
        lessonId: 'lsn_py_4',
        order: 1,
        question: 'Which of the following data structures in Python is immutable (cannot be changed after creation)?',
        type: 'multiple_choice',
        options: ['List', 'Dictionary', 'Tuple', 'Set'],
        correctAnswer: 'Tuple',
        explanation: 'Tuples are defined using parentheses `()` and their items cannot be reassigned or modified once instantiated.',
        points: 10
      }
    ]
  },

  // 5 Sourced Dev Lessons (Section 2)
  {
    id: 'lsn_da_foundation',
    courseId: 'crs_data_foundation',
    order: 1,
    title: 'Core Data Concepts & Tabular Metrics',
    description: 'Foundations of quantitative analysis: rows, columns, data types, mean, median, standard deviation.',
    duration: '50 mins',
    difficulty: 'Beginner',
    topics: ['Data Types', 'Descriptive Stats', 'Mean/Median', 'Variance'],
    published: true,
    created_by: 'usr_trainer_1',
    contentBlocks: [
      {
        id: 'blk_da_1',
        order: 1,
        type: 'text',
        title: 'Understanding Tabular Data',
        content: `### Foundations of Data Analytics

Tabular datasets structure observations in rows and features in columns. Before any machine learning or dashboarding, an analyst must compute descriptive statistics to understand distribution spreads and central tendencies.`
      },
      {
        id: 'blk_da_2',
        order: 2,
        type: 'code_playground',
        title: 'Playground: Computing Central Tendencies',
        content: `revenues = [12000, 14500, 9800, 15200, 11400, 21000]
total_rev = sum(revenues)
avg_rev = total_rev / len(revenues)

print("Total Revenue: $", total_rev)
print("Average Monthly Revenue: $", round(avg_rev, 2))
print("Max Month: $", max(revenues))
print("Min Month: $", min(revenues))
`,
        playgroundLanguage: 'python'
      }
    ],
    exercises: [
      {
        id: 'ex_da_1',
        lessonId: 'lsn_da_foundation',
        order: 1,
        question: 'Which measure of central tendency is least sensitive to extreme outliers?',
        type: 'multiple_choice',
        options: ['Mean', 'Median', 'Mode', 'Range'],
        correctAnswer: 'Median',
        explanation: 'The median divides sorted observations in half and is unaffected by extreme skewness or outliers.',
        points: 10
      }
    ]
  },
  {
    id: 'lsn_da_intermediate',
    courseId: 'crs_data_intermediate',
    order: 1,
    title: 'Exploratory Data Analysis & Cleaning',
    description: 'Identify dirty data, handle missing values, filter anomalies, and normalize distributions.',
    duration: '55 mins',
    difficulty: 'Intermediate',
    topics: ['Missing Values', 'Outliers', 'Filtering', 'Normalization'],
    published: true,
    created_by: 'usr_trainer_1',
    contentBlocks: [
      {
        id: 'blk_da_int_1',
        order: 1,
        type: 'text',
        title: 'The Data Cleaning Pipeline',
        content: `Real-world data is dirty. Up to 80% of an analyst's time is spent identifying missing fields, inconsistent encodings, and anomalous values.`
      }
    ],
    exercises: [
      {
        id: 'ex_da_int_1',
        lessonId: 'lsn_da_intermediate',
        order: 1,
        question: 'What is the risk of dropping all rows that contain missing values (dropna)?',
        type: 'multiple_choice',
        options: [
          'It increases model complexity',
          'It can introduce selection bias and cause substantial data loss',
          'It changes column data types automatically',
          'It duplicates remaining records'
        ],
        correctAnswer: 'It can introduce selection bias and cause substantial data loss',
        explanation: 'Indiscriminately dropping rows with any missing value can discard valuable observations and skew the dataset.',
        points: 10
      }
    ]
  },
  {
    id: 'lsn_da_advanced',
    courseId: 'crs_data_advanced',
    order: 1,
    title: 'Predictive Modeling & Pipelines',
    description: 'Feature engineering, train/test split principles, evaluation metrics, and automated reporting.',
    duration: '65 mins',
    difficulty: 'Advanced',
    topics: ['Train/Test Split', 'MSE/RMSE', 'Overfitting', 'Model Inference'],
    published: false,
    created_by: 'usr_trainer_1',
    contentBlocks: [
      {
        id: 'blk_da_adv_1',
        order: 1,
        type: 'text',
        title: 'Generalization and Evaluation',
        content: `Evaluating models on unseen testing data ensures that our statistical patterns generalize beyond training samples.`
      }
    ],
    exercises: []
  },
  {
    id: 'lsn_cyber_defense',
    courseId: 'crs_ethical_hacking',
    order: 1,
    title: 'Reconnaissance & Network Defense',
    description: 'Principles of ethical hacking, TCP/IP fundamentals, port scanning methodologies, and defense-in-depth.',
    duration: '60 mins',
    difficulty: 'Intermediate',
    topics: ['Reconnaissance', 'Nmap basics', 'Port Protocols', 'Defensive Hardening'],
    published: true,
    created_by: 'usr_trainer_1',
    contentBlocks: [
      {
        id: 'blk_sec_1',
        order: 1,
        type: 'text',
        title: 'Passive vs. Active Reconnaissance',
        content: `### Reconnaissance Fundamentals

Ethical penetration testing begins with passive and active reconnaissance to map target network surfaces.
- **Passive Reconnaissance**: Gathering intelligence without directly sending packets to target servers (WHOIS, DNS records, public OSINT).
- **Active Reconnaissance**: Direct interaction with target networks (ping sweeps, port scanning).
`
      }
    ],
    exercises: [
      {
        id: 'ex_sec_1',
        lessonId: 'lsn_cyber_defense',
        order: 1,
        question: 'Which standard protocol runs on port 443 by default?',
        type: 'multiple_choice',
        options: ['SSH', 'HTTP', 'HTTPS', 'FTP'],
        correctAnswer: 'HTTPS',
        explanation: 'Port 443 is the standard default port for encrypted HTTPS traffic over TLS/SSL.',
        points: 10
      }
    ]
  },
  {
    id: 'lsn_social_media',
    courseId: 'crs_social_media',
    order: 1,
    title: 'Content Strategy & Performance Metrics',
    description: 'Audience persona mapping, editorial calendars, engagement metrics, and ROI optimization.',
    duration: '40 mins',
    difficulty: 'Beginner',
    topics: ['Audience Persona', 'Reach vs Impressions', 'Engagement Rate', 'Content Funnel'],
    published: true,
    created_by: 'usr_trainer_1',
    contentBlocks: [
      {
        id: 'blk_sm_1',
        order: 1,
        type: 'text',
        title: 'Engagement vs. Reach',
        content: `### Key Social Media Metrics

Understanding the difference between vanity metrics and capability metrics:
- **Impressions**: Total number of times content is displayed on a screen.
- **Reach**: Total number of unique individuals who viewed your content.
- **Engagement Rate**: Total interactions (clicks, shares, comments, saves) divided by reach.
`
      }
    ],
    exercises: [
      {
        id: 'ex_sm_1',
        lessonId: 'lsn_social_media',
        order: 1,
        question: 'If a post is viewed 5,000 times by 2,500 unique users, what is the total Reach?',
        type: 'multiple_choice',
        options: ['5,000', '2,500', '7,500', '2.0'],
        correctAnswer: '2,500',
        explanation: 'Reach is strictly the count of unique individual viewers, which in this case is 2,500.',
        points: 10
      }
    ]
  }
];

export const initialProgress: UserProgress[] = [
  {
    id: 'prog_1',
    userId: 'usr_student_1',
    courseId: 'crs_python',
    lessonId: 'lsn_py_1',
    completed: true,
    score: 100,
    lastVisitedAt: '2026-09-17 16:30',
    completedAt: '2026-09-17 16:30'
  },
  {
    id: 'prog_2',
    userId: 'usr_student_1',
    courseId: 'crs_python',
    lessonId: 'lsn_py_2',
    completed: true,
    score: 90,
    lastVisitedAt: '2026-09-18 01:15',
    completedAt: '2026-09-18 01:15'
  },
  {
    id: 'prog_3',
    userId: 'usr_student_1',
    courseId: 'crs_python',
    lessonId: 'lsn_py_3',
    completed: false,
    score: 0,
    lastVisitedAt: '2026-09-18 02:20'
  }
];

export const initialTrainerPermissions: TrainerPermission[] = [
  {
    trainerId: 'usr_trainer_1',
    courseIds: ['crs_python', 'crs_data_foundation', 'crs_data_intermediate', 'crs_data_advanced', 'crs_ethical_hacking', 'crs_social_media'],
    lessonIds: ['lsn_py_1', 'lsn_py_2', 'lsn_py_3', 'lsn_py_4', 'lsn_da_foundation', 'lsn_da_intermediate', 'lsn_da_advanced', 'lsn_cyber_defense', 'lsn_social_media']
  }
];

export const initialAuditLogs: AuditLogItem[] = [
  {
    id: 'log_1',
    actorId: 'usr_admin_1',
    actorName: 'Jane Omondi',
    actorRole: 'admin',
    action: 'Published Course',
    targetType: 'course',
    targetName: 'Python Programming Essentials',
    timestamp: '2026-08-15 09:30',
    details: 'Course status updated to live in public catalog'
  },
  {
    id: 'log_2',
    actorId: 'usr_admin_1',
    actorName: 'Jane Omondi',
    actorRole: 'admin',
    action: 'Changed User Role',
    targetType: 'user',
    targetName: 'Dr. Sarah Wanjiku',
    timestamp: '2026-08-20 14:15',
    details: 'Promoted role to lead trainer with curriculum publishing rights'
  },
  {
    id: 'log_3',
    actorId: 'usr_admin_1',
    actorName: 'Jane Omondi',
    actorRole: 'admin',
    action: 'Suspended User',
    targetType: 'user',
    targetName: 'John Doe (test.abusive@example.com)',
    timestamp: '2026-08-25 11:00',
    details: 'Account suspended for policy violation during lab assessment'
  }
];

export const initialCertificates: Certificate[] = [
  {
    id: 'cert_1',
    certificateNumber: 'FUSION-PY-2026-94812',
    credentialId: 'FUS-CRED-2026-94812',
    userId: 'usr_student_1',
    userName: 'Alex Kimani',
    courseId: 'crs_python',
    courseTitle: 'Python Programming Essentials',
    courseLevel: 'Foundation',
    issueDate: '2026-09-18',
    verificationHash: '94812a8f7c11b0e4',
    noteText: 'Demonstrated practical mastery of Python syntax, data structures, and interactive algorithmic problem solving.',
    trainerSignatureName: 'Dr. Sarah Wanjiku',
    trainerSignatureTitle: 'Lead Technical Instructor'
  }
];

export const initialSettings: PlatformSettings = {
  siteName: 'Fusion EduTech',
  tagline: 'We turn knowledge into capability',
  supportEmail: 'support@fusionedutech.com',
  autoApproveStudents: false,
  allowSignups: true,
  tutorModel: 'gemini-3.8-flash',
  certificateSignatureName: 'Dr. Sarah Wanjiku & Jane Omondi',
  certificateSignatureTitle: 'Academic Director & Operations Lead'
};
