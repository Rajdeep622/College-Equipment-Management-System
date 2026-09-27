/**
 * College Event & Equipment Management System - Master Data Store
 */

const USERS = [
    { 
        id: "24102C0043", 
        password: "Rajdeep@123", 
        name: "Rajdeep Patel",
        role: "Student",
        email: "rajdeep.patel@campus.edu",
        department: "Computer Science & Engineering",
        semester: "6th Semester",
        phone: "+91 98765 43210",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
        joinedDate: "August 2024"
    },
    { 
        id: "24102C0044", 
        password: "Student@123", 
        name: "Prem Tarange",
        role: "Student",
        email: "prem.tarange@campus.edu",
        department: "Information Technology",
        semester: "4th Semester",
        phone: "+91 98765 43211",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250",
        joinedDate: "August 2024"
    },
    { 
        id: "24102C0054", 
        password: "Campus@123", 
        name: "Ali Mirza",
        role: "Student",
        email: "ali.mirza@campus.edu",
        department: "Electronics & Communication",
        semester: "6th Semester",
        phone: "+91 98765 43212",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
        joinedDate: "August 2024"
    },
    {
        id: "ORG-2024-001",
        password: "Organizer@123",
        name: "Dr. A. Sharma (Organizer)",
        role: "Organizer",
        email: "organizer@campus.edu",
        department: "Faculty Coordinator - Events",
        semester: "Faculty Staff",
        phone: "+91 98765 00000",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250",
        joinedDate: "January 2020"
    }
];

const INITIAL_DATA = {
    users: USERS,
    events: [
        {
            id: "EVT-101",
            title: "Annual Hackathon 2026: Code-A-Thon",
            category: "Technical",
            date: "2026-08-20",
            time: "09:00 AM - 06:00 PM",
            venue: "Main Auditorium & Computing Center",
            organizer: "Computer Engineering Society",
            image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=500",
            description: "24-Hour National level coding competition showcasing AI, WebDev, and IoT solutions.",
            seatsAvailable: 45
        },
        {
            id: "EVT-102",
            title: "Techno-Cultural Fest: Symphony 2026",
            category: "Cultural",
            date: "2026-08-25",
            time: "05:00 PM - 10:00 PM",
            venue: "Open Air Amphitheatre",
            organizer: "Cultural Club",
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=500",
            description: "Inter-college music, dance, fashion show, and battle of the bands.",
            seatsAvailable: 120
        },
        {
            id: "EVT-103",
            title: "Web Development & Cloud Computing Workshop",
            category: "Workshops",
            date: "2026-08-15",
            time: "10:00 AM - 02:00 PM",
            venue: "Seminar Hall 2",
            organizer: "IEEE Student Branch",
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=500",
            description: "Hands-on masterclass on modern frontend architectures and cloud deployment.",
            seatsAvailable: 28
        },
        {
            id: "EVT-104",
            title: "Inter-Department Football Championship",
            category: "Sports",
            date: "2026-08-18",
            time: "03:30 PM - 07:00 PM",
            venue: "University Sports Complex",
            organizer: "Sports Board",
            image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=500",
            description: "Annual knockout football tournament across all engineering departments.",
            seatsAvailable: 16
        }
    ],

    registeredEvents: [
        {
            id: "REG-EVT-901",
            userId: "24102C0043",
            eventId: "EVT-101",
            eventName: "Annual Hackathon 2026: Code-A-Thon",
            date: "2026-08-20",
            venue: "Main Auditorium",
            passType: "Regular Participant Pass",
            status: "Confirmed"
        },
        {
            id: "REG-EVT-902",
            userId: "24102C0043",
            eventId: "EVT-103",
            eventName: "Web Development & Cloud Computing Workshop",
            date: "2026-08-15",
            venue: "Seminar Hall 2",
            passType: "VIP Delegate Pass",
            status: "Confirmed"
        }
    ],

    equipment: [
        {
            id: "EQ-001",
            name: "Textbook",
            category: "Academic",
            quantity: 45,
            available: 38,
            maxDays: 14,
            image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=500",
            description: "Advanced Data Structures & Algorithms (8th Edition). Essential reference for CSE core course.",
            location: "Main Library - Section B2"
        },
        {
            id: "EQ-002",
            name: "Scientific Calculator",
            category: "Academic",
            quantity: 30,
            available: 22,
            maxDays: 7,
            image: "https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48b?auto=format&fit=crop&q=80&w=500",
            description: "Casio FX-991EX ClassWiz with matrix and polynomial solver capabilities.",
            location: "Academic Block - Lab 102"
        },
        {
            id: "EQ-003",
            name: "Lab Coat",
            category: "Lab Tools",
            quantity: 50,
            available: 41,
            maxDays: 30,
            image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=500",
            description: "100% Cotton anti-static white laboratory coat with press-stud fastings.",
            location: "Chemistry Store Room"
        },
        {
            id: "EQ-004",
            name: "Safety Goggles",
            category: "Lab Tools",
            quantity: 60,
            available: 54,
            maxDays: 30,
            image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=500",
            description: "Polycarbonate clear anti-scratch safety eyewear, fits over standard glasses.",
            location: "Chemistry Store Room"
        },
        {
            id: "EQ-005",
            name: "Multimeter",
            category: "Electronics",
            quantity: 25,
            available: 15,
            maxDays: 5,
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=500",
            description: "True-RMS digital multimeter with auto-ranging, temperature, and continuity test functions.",
            location: "EE Lab - Rack 4"
        },
        {
            id: "EQ-006",
            name: "Arduino Kit",
            category: "Electronics",
            quantity: 20,
            available: 12,
            maxDays: 7,
            image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=500",
            description: "Arduino UNO Rev3 Starter Pack complete with sensors, jumper wires, LEDs, and servos.",
            location: "Robotics Workshop"
        },
        {
            id: "EQ-007",
            name: "Breadboard Kit",
            category: "Electronics",
            quantity: 35,
            available: 29,
            maxDays: 10,
            image: "https://images.unsplash.com/photo-1608564697071-ddf911d81370?auto=format&fit=crop&q=80&w=500",
            description: "Solderless breadboard kit with 830 tie-points and 65-piece wire jumper set.",
            location: "Hardware Design Lab"
        },
        {
            id: "EQ-008",
            name: "Football",
            category: "Sports",
            quantity: 15,
            available: 8,
            maxDays: 3,
            image: "https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&q=80&w=500",
            description: "Size 5 Match Grade Synthetic Leather Football, FIFA Quality standard.",
            location: "Sports Complex Room 3"
        },
        {
            id: "EQ-009",
            name: "Cricket Bat",
            category: "Sports",
            quantity: 12,
            available: 6,
            maxDays: 3,
            image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=500",
            description: "English Willow Grade 1 short handle cricket bat with extra protective toe guard.",
            location: "Sports Complex Room 1"
        },
        {
            id: "EQ-010",
            name: "Microphone",
            category: "Audio/Visual",
            quantity: 10,
            available: 7,
            maxDays: 2,
            image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=500",
            description: "Shure SM58 Cardioid Dynamic Vocal Microphone with XLR cable and desk tripod.",
            location: "Auditorium Control Room"
        }
    ],

    issuedItems: [
        {
            id: "ISS-901",
            userId: "24102C0043",
            equipmentId: "EQ-005",
            equipmentName: "Multimeter",
            category: "Electronics",
            issueDate: "2026-07-28",
            dueDate: "2026-08-03",
            returnDate: null,
            status: "Overdue",
            daysLate: 3,
            finePerDay: 50,
            penaltyAmount: 150,
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=500"
        },
        {
            id: "ISS-904",
            userId: "24102C0043",
            equipmentId: "EQ-006",
            equipmentName: "Arduino Kit",
            category: "Electronics",
            issueDate: "2026-08-01",
            dueDate: "2026-08-08",
            returnDate: null,
            status: "Issued",
            daysLate: 0,
            finePerDay: 50,
            penaltyAmount: 0,
            image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=500"
        }
    ],

    pendingRequests: [
        {
            id: "REQ-104",
            userId: "24102C0043",
            equipmentId: "EQ-001",
            equipmentName: "Textbook",
            category: "Academic",
            requestDate: "2026-08-05",
            durationDays: 14,
            expectedReturnDate: "2026-08-19",
            purpose: "Exam Preparation for CS-302",
            status: "Pending Approval"
        }
    ]
};
