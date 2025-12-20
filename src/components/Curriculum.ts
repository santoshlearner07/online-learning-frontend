export interface Milestone {
    level: number;
    title: string;
    topics: string[];
    project: string;
}

export interface Technology {
    id: string;
    name: string;
    icon: string;
    levels: Milestone[];
}

export const curriculum: Technology[] = [
    {
        id: 'html-css',
        name: 'HTML & CSS',
        icon: '🌐',
        levels: [
            {
                level: 1,
                title: 'The Architect',
                topics: ['Structure (HTML5)', 'Semantic Tags', 'Typography', 'Links & Media', 'Box Model', 'Forms Basics', 'Positioning', 'Lists & Tables', 'Forms Basics', 'Colors', 'Basic Positioning', 'Milestone'],
                project: 'Biography Page'
            },
            {
                level: 2,
                title: 'The Designer',
                topics: ['Flexbox & Grid', 'Responsive Design', 'Transitions', 'CSS Variables', 'Animations', 'Z-Index', 'Advanced Selectors', 'Forms Advanced', 'Milestone'],
                project: 'Product Landing Page'
            }
        ]
    },
    {
        id: 'javascript',
        name: 'JavaScript',
        icon: '⌨️',
        levels: [
            {
                level: 1,
                title: 'The Interactive Coder',
                topics: ['Variables', 'Data Types', 'DOM Selection', 'Conditionals', 'Events', 'Arrow Functions', 'Intervals', 'Arrays', 'Functions', 'String Methods', 'Milestone'],
                project: 'Digital Clock'
            },
            {
                level: 2,
                title: 'The Web Developer',
                topics: ['Array Methods (.map, .filter)', 'Destructuring', 'Promises', 'Async/Await', 'Fetch API', 'Local Storage', 'Scope', 'Modules', 'Scope & Closures', 'Milestone'],
                project: 'Interactive Quiz App'
            }
        ]
    },
    {
        id: 'react',
        name: 'React.js',
        icon: '⚛️',
        levels: [
            {
                level: 1,
                title: 'The Component Creator',
                topics: ['JSX', 'Components', 'Props', 'useState', 'Mapping', 'Event Handling', 'Conditional Rendering', 'Fragment', 'Vite', 'Milestone'],
                project: 'Task Tracker'
            },
            {
                level: 2,
                title: 'The State Master',
                topics: ['useEffect', 'Custom Hooks', 'React Router', 'Zustand', 'MUI/Tailwind', 'Form Libraries', 'Milestone'],
                project: 'User Profile Dashboard'
            }
        ]
    },
    {
        id: 'python',
        name: 'Python',
        icon: '🐍',
        levels: [
            {
                level: 1,
                title: 'The Scripting Starter',
                topics: ['Variables', 'Input/Output', 'Arithmetic', 'If/Else', 'Lists', 'Loops', 'Functions', 'Modules', 'Milestone'],
                project: 'Number Guessing Game'
            },
            {
                level: 2,
                title: 'The Logic Builder',
                topics: ['Dictionaries', 'List Comprehension', 'Error Handling', 'File I/O', 'Classes & Objects', 'Inheritance', 'PIP', 'APIs', 'Decorators', 'Milestone'],
                project: 'Weather App with Live API'
            }
        ]
    },
    {
        id: 'sql',
        name: 'SQL (Relational Databases)',
        icon: '🗄️',
        levels: [
            {
                level: 1,
                title: 'The Data Organizer',
                topics: ['Databases', 'SELECT', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'Primary Keys', 'ORDER BY', 'Primary Keys', 'Milestone'],
                project: 'Customer Contact List'
            },
            {
                level: 2,
                title: 'The Data Scientist',
                topics: ['JOINS', 'Foreign Keys', 'Aggregate Functions', 'GROUP BY', 'HAVING', 'Subqueries', 'Constraints', 'Indexes', 'Transactions', 'Milestone'],
                project: 'Library Management System'
            }
        ]
    }
];