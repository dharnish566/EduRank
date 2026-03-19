export interface College {
  id: number;
  name: string;
  shortName?: string;

  // Classification
  type: "IIT" | "NIT" | "Deemed" | "State" | "Private";

  // Location
  city: string;
  state: string;
  location?: string;

  // Rankings & Scores
  rank?: number;
  nirfRank?: number | null;
  overallScore?: number;
  finalScore?: number;

  // NAAC
  naacGrade?: "A++" | "A+" | "A" | "B++" | "B+" | "B" | "C";
  naacScore?: number;
  naacAddress?: string;

  // Establishment
  established: number;

  // Placement
  placementPct?: number;

  // ✅ FIXED COURSES STRUCTURE
  courses: {
    course_code: string;
    course_name: string;
    avg_cutoff: number;
  }[];

  courseCount?: number;

  // Trend
  trend?: "up" | "down" | "stable";
  trendChange?: number;

  // Details
  about?: string;

  facilities?: {
    name: string;
    icon: string;
    description: string;
  }[];

  admissionInfo?: {
    process: string[];
    eligibility: string[];
    keyDates: {
      event: string;
      date: string;
    }[];
  };
}



export const COLLEGES: College[] = [
  {
    id: 99,
    name: "Bannari Amman Institute of Technology (Autonomous), Sathyamangalam, Erode District",
    shortName: "BIT Sathy",
    type: "Private",

    city: "Erode",
    state: "Tamil Nadu",
    location: "Rural",

    rank: 0,
    nirfRank: 100,
    overallScore: 75.43,
    finalScore: 53.4,

    naacGrade: "A+",
    naacScore: 3.36,
    naacAddress:
      "SATHY-BHAVANI STATE HIGHWAY, ALATHUKOMBAI POST, SATHYAMANGALAM ERODE DT. Sathyamangalam 638401",

    established: 1996,

    placementPct: 78.25,

    // ✅ COURSES (from your API)
    courses: [
      { course_code: "AG", course_name: "AGRICULTURAL ENGINEERING", avg_cutoff: 146 },
      { course_code: "BT", course_name: "BIO TECHNOLOGY", avg_cutoff: 149.75 },
      { course_code: "ME", course_name: "MECHANICAL ENGINEERING", avg_cutoff: 155.13 },
      { course_code: "MZ", course_name: "Mechatronics Engineering", avg_cutoff: 155.25 },
      { course_code: "EI", course_name: "ELECTRONICS AND INSTRUMENTATION ENGINEERING", avg_cutoff: 158.38 },
      { course_code: "EE", course_name: "ELECTRICAL AND ELECTRONICS ENGINEERING", avg_cutoff: 162.63 },
      { course_code: "AL", course_name: "Artificial Intelligence and Machine Learning", avg_cutoff: 166.5 },
      { course_code: "CB", course_name: "COMPUTER SCIENCE AND BUSSINESS SYSTEM", avg_cutoff: 167.75 },
      { course_code: "AD", course_name: "Artificial Intelligence and Data Science", avg_cutoff: 168 },
      { course_code: "EC", course_name: "ELECTRONICS AND COMMUNICATION ENGINEERING", avg_cutoff: 169.38 },
      { course_code: "IT", course_name: "INFORMATION TECHNOLOGY", avg_cutoff: 169.38 },
      { course_code: "CS", course_name: "COMPUTER SCIENCE AND ENGINEERING", avg_cutoff: 174.13 }
    ],

    courseCount: 12,

    trend: "up",
    trendChange: 2.3,

    about:
      "Bannari Amman Institute of Technology (BIT), Sathyamangalam is a reputed private engineering college in Tamil Nadu. Established in 1996, the institution is known for strong academics and consistent placements. The campus offers modern infrastructure and focuses on emerging technologies like AI, Data Science, and Biotechnology.",

    facilities: [
      {
        name: "Central Library",
        icon: "📚",
        description: "Extensive collection of books, journals, and digital resources."
      },
      {
        name: "Computer Labs",
        icon: "💻",
        description: "Modern labs with high-speed internet and latest tools."
      },
      {
        name: "Hostel",
        icon: "🏠",
        description: "Comfortable accommodation facilities for students."
      },
      {
        name: "Sports",
        icon: "🏏",
        description: "Indoor and outdoor sports facilities available."
      },
      {
        name: "Transport",
        icon: "🚌",
        description: "Bus services connecting nearby towns and cities."
      }
    ],

    admissionInfo: {
      process: [
        "Apply through TNEA counselling",
        "Fill course and college preferences",
        "Seat allotment based on cut-off",
        "Verify documents and confirm admission"
      ],
      eligibility: [
        "12th with PCM (Physics, Chemistry, Maths)",
        "Minimum marks as per TNEA norms",
        "Must participate in counselling"
      ],
      keyDates: [
        { event: "Application Start", date: "May 2024" },
        { event: "Rank List", date: "June 2024" },
        { event: "Counselling", date: "July 2024" },
        { event: "Classes Begin", date: "August 2024" }
      ]
    }
  },
  // {
  //   id: 2,
  //   rank: 2,
  //   name: "National Institute of Technology Tiruchirappalli",
  //   shortName: "NIT Trichy",
  //   type: "NIT",
  //   city: "Trichy",
  //   state: "Tamil Nadu",
  //   naacGrade: "A++",
  //   nirfRank: 8,
  //   overallScore: 93.8,
  //   placementPct: 95.1,
  //   avgPackageLPA: 18.6,
  //   highestPackageLPA: 85.0,
  //   courses: ["B.Tech", "M.Tech", "MBA", "M.Sc", "Ph.D"],
  //   established: 1964,
  //   trend: "up",
  //   trendChange: 2,
  //   about:
  //     "National Institute of Technology Tiruchirappalli (NIT Trichy), established in 1964, is one of the premier technical institutions in India under the Ministry of Education. Spread over 800 acres, the institute has consistently ranked among the top 10 engineering institutions in India and is widely recognised as the best NIT in the country.\n\nNIT Trichy is known for its outstanding placement record, strong alumni network, and a vibrant campus culture. The institute has produced leaders across industries including technology, finance, consulting, and public service. Its dedicated Career Development Cell ensures near-complete placement every year, with multinational giants visiting campus regularly.\n\nThe institute offers 13 undergraduate programmes, 25 postgraduate programmes, and doctoral programmes across all engineering disciplines. With state-of-the-art laboratories, a well-stocked central library, and active research centres, NIT Trichy provides a holistic academic environment that blends rigorous academics with practical exposure.",
  //   feeRange: { min: 65, max: 175 },
  //   placementTrend: [
  //     { year: 2020, pct: 88.5, avgLPA: 14.2 },
  //     { year: 2021, pct: 90.8, avgLPA: 15.6 },
  //     { year: 2022, pct: 92.4, avgLPA: 16.9 },
  //     { year: 2023, pct: 94.0, avgLPA: 17.8 },
  //     { year: 2024, pct: 95.1, avgLPA: 18.6 },
  //   ],
  //   salaryBands: [
  //     { label: "5–10 LPA", count: 45 },
  //     { label: "10–20 LPA", count: 210 },
  //     { label: "20–40 LPA", count: 165 },
  //     { label: "40–60 LPA", count: 62 },
  //     { label: "60–85 LPA", count: 28 },
  //     { label: "85+ LPA", count: 8 },
  //   ],
  //   topRecruiters: [
  //     { name: "Microsoft", role: "SDE", avgPackage: 40.0 },
  //     { name: "Amazon", role: "SDE", avgPackage: 32.0 },
  //     {
  //       name: "Texas Instruments",
  //       role: "Hardware Engineer",
  //       avgPackage: 22.0,
  //     },
  //     { name: "Samsung R&D", role: "Research Engineer", avgPackage: 20.0 },
  //     { name: "Infosys", role: "Systems Engineer", avgPackage: 8.0 },
  //     { name: "Zoho", role: "Software Engineer", avgPackage: 12.0 },
  //     { name: "Deloitte", role: "Analyst", avgPackage: 14.0 },
  //     { name: "Honeywell", role: "Process Engineer", avgPackage: 10.0 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Central Library",
  //       icon: "📚",
  //       description:
  //         "Over 1.5 lakh books, 8,000+ e-journals, and OPAC-enabled cataloguing system.",
  //     },
  //     {
  //       name: "Sports Complex",
  //       icon: "🏊",
  //       description:
  //         "Olympic swimming pool, 400m athletics track, basketball, volleyball, and badminton courts.",
  //     },
  //     {
  //       name: "Healthcare Centre",
  //       icon: "🏥",
  //       description:
  //         "24×7 medical facility with resident doctors, paramedics, and emergency ambulance service.",
  //     },
  //     {
  //       name: "Hostels",
  //       icon: "🏠",
  //       description:
  //         "12 hostels with AC and non-AC options, 24×7 Wi-Fi, dining facilities, and recreation areas.",
  //     },
  //     {
  //       name: "Innovation Centre",
  //       icon: "⚗️",
  //       description:
  //         "Interdisciplinary research hub with 3D printers, PCB fabrication, and robotics lab.",
  //     },
  //     {
  //       name: "Computing Centre",
  //       icon: "💻",
  //       description:
  //         "High-performance computing cluster and networked computer labs across all departments.",
  //     },
  //     {
  //       name: "Auditorium",
  //       icon: "🎭",
  //       description:
  //         "2,000-seat air-conditioned auditorium for cultural events, conferences, and seminars.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Qualify JEE Main with a competitive percentile score.",
  //       "Register for JoSAA counselling on the official portal.",
  //       "Fill in preferred NITs, programmes, and home state quota.",
  //       "Accept seat allotment and pay partial seat acceptance fee.",
  //       "Report to institute for physical verification of documents.",
  //       "Pay remaining fees and collect identity/library card.",
  //     ],
  //     eligibility: [
  //       "Minimum 75% in Class 12 with Physics, Chemistry, Mathematics (65% for SC/ST).",
  //       "Valid JEE Main score in the current academic year.",
  //       "Age: Born on or after October 1, 1999.",
  //       "State quota: 50% seats reserved for Tamil Nadu domicile students.",
  //     ],
  //     keyDates: [
  //       { event: "JEE Main Session 2 Exam", date: "Apr 4–15, 2024" },
  //       { event: "JoSAA Registration Opens", date: "Jun 10, 2024" },
  //       { event: "Round 1 Allotment", date: "Jun 20, 2024" },
  //       { event: "Seat Acceptance Deadline", date: "Jun 25, 2024" },
  //       { event: "Reporting & Verification", date: "Jul 1–8, 2024" },
  //       { event: "Academic Year Begins", date: "Jul 15, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 145000,
  //       seats: 110,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 145000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Mechanical Engineering",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 145000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Civil Engineering",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 145000,
  //       seats: 80,
  //     },
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "M.Tech",
  //       duration: "2 years",
  //       annualFee: 45000,
  //       seats: 30,
  //     },
  //     {
  //       name: "Power Electronics",
  //       degree: "M.Tech",
  //       duration: "2 years",
  //       annualFee: 45000,
  //       seats: 24,
  //     },
  //   ],
  // },
  // {
  //   id: 3,
  //   rank: 3,
  //   name: "Anna University",
  //   shortName: "Anna University",
  //   type: "State",
  //   city: "Chennai",
  //   state: "Tamil Nadu",
  //   naacGrade: "A+",
  //   nirfRank: 3,
  //   overallScore: 91.2,
  //   placementPct: 88.5,
  //   avgPackageLPA: 12.8,
  //   highestPackageLPA: 60.0,
  //   courses: ["B.E", "B.Tech", "M.Tech", "MBA", "M.E", "Ph.D"],
  //   established: 1978,
  //   trend: "stable",
  //   trendChange: 0,
  //   about:
  //     "Anna University, established in 1978, is a technical university in Chennai, Tamil Nadu named after Dr. C.N. Annadurai, the former Chief Minister of Tamil Nadu. It is one of the largest technical universities in the world, with over 600 affiliated colleges across Tamil Nadu enrolling nearly 4.5 lakh students.\n\nThe university's main campus in Guindy is known for its serene ambience, sprawling green grounds, and historic buildings. It is one of the oldest engineering institutions in Asia, with its constituent colleges tracing roots back to 1794. The university is renowned for its research output, industry collaborations, and the quality of its faculty.\n\nAnna University maintains a robust placement cell that facilitates recruitment across industries. The university regularly updates its curriculum in alignment with industry needs and conducts workshops, hackathons, and industry visits to ensure students remain competitive in the job market.",
  //   feeRange: { min: 20, max: 85 },
  //   placementTrend: [
  //     { year: 2020, pct: 82.1, avgLPA: 9.8 },
  //     { year: 2021, pct: 84.6, avgLPA: 10.4 },
  //     { year: 2022, pct: 86.3, avgLPA: 11.2 },
  //     { year: 2023, pct: 87.5, avgLPA: 12.1 },
  //     { year: 2024, pct: 88.5, avgLPA: 12.8 },
  //   ],
  //   salaryBands: [
  //     { label: "3–6 LPA", count: 125 },
  //     { label: "6–12 LPA", count: 280 },
  //     { label: "12–20 LPA", count: 145 },
  //     { label: "20–35 LPA", count: 62 },
  //     { label: "35–60 LPA", count: 24 },
  //     { label: "60+ LPA", count: 8 },
  //   ],
  //   topRecruiters: [
  //     { name: "Cognizant", role: "Technology Analyst", avgPackage: 7.5 },
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "Infosys", role: "Systems Engineer", avgPackage: 6.5 },
  //     { name: "Wipro", role: "Project Engineer", avgPackage: 6.0 },
  //     { name: "HCL", role: "Software Engineer", avgPackage: 6.0 },
  //     { name: "Zoho", role: "Software Engineer", avgPackage: 14.0 },
  //     { name: "Freshworks", role: "Associate Engineer", avgPackage: 12.0 },
  //     {
  //       name: "L&T Technology",
  //       role: "Graduate Engineer Trainee",
  //       avgPackage: 8.0,
  //     },
  //   ],
  //   facilities: [
  //     {
  //       name: "Central Library",
  //       icon: "📚",
  //       description:
  //         "One of the largest technical libraries in Tamil Nadu with 2 lakh+ books and digital repositories.",
  //     },
  //     {
  //       name: "Language Lab",
  //       icon: "🎙️",
  //       description:
  //         "Fully equipped digital language laboratory for communication and soft skills development.",
  //     },
  //     {
  //       name: "Sports Facilities",
  //       icon: "🏅",
  //       description:
  //         "Cricket ground, football field, basketball, volleyball courts, and an indoor badminton hall.",
  //     },
  //     {
  //       name: "Healthcare Centre",
  //       icon: "🏥",
  //       description:
  //         "On-campus medical centre with full-time doctors, counsellors, and first-aid facilities.",
  //     },
  //     {
  //       name: "Hostel Accommodation",
  //       icon: "🏠",
  //       description:
  //         "Separate hostels for men and women with 24×7 Wi-Fi, mess, and recreation facilities.",
  //     },
  //     {
  //       name: "Research Labs",
  //       icon: "🔬",
  //       description:
  //         "Advanced research labs for IoT, AI, renewable energy, and advanced materials.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Appear for TNEA (Tamil Nadu Engineering Admissions) counselling.",
  //       "Register on the TNEA official portal with Class 12 marks.",
  //       "Choose from the list of preferred colleges and programmes.",
  //       "Rank-based allotment through merit cum preference system.",
  //       "Report to the allotted college with original certificates.",
  //       "Pay the prescribed tuition and other fees to confirm admission.",
  //     ],
  //     eligibility: [
  //       "Passed Class 12 with Physics, Chemistry, and Mathematics.",
  //       "Minimum 50% aggregate in PCM subjects (45% for reserved categories).",
  //       "Must be a Tamil Nadu domicile or meet specific criteria for general quota.",
  //       "Age: No upper age limit for TNEA admissions.",
  //     ],
  //     keyDates: [
  //       { event: "TNEA Application Opens", date: "May 6, 2024" },
  //       { event: "Application Deadline", date: "Jun 5, 2024" },
  //       { event: "Random Number Generation", date: "Jun 15, 2024" },
  //       { event: "Rank Publication", date: "Jun 22, 2024" },
  //       { event: "Counselling Round 1", date: "Jul 4, 2024" },
  //       { event: "Classes Begin", date: "Aug 1, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 52000,
  //       seats: 160,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 52000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Information Technology",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 52000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Mechanical Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 52000,
  //       seats: 80,
  //     },
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "M.E",
  //       duration: "2 years",
  //       annualFee: 32000,
  //       seats: 40,
  //     },
  //     {
  //       name: "Business Administration",
  //       degree: "MBA",
  //       duration: "2 years",
  //       annualFee: 42000,
  //       seats: 60,
  //     },
  //   ],
  // },
  // {
  //   id: 4,
  //   rank: 4,
  //   name: "Amrita Vishwa Vidyapeetham",
  //   shortName: "Amrita University",
  //   type: "Deemed",
  //   city: "Coimbatore",
  //   state: "Tamil Nadu",
  //   naacGrade: "A++",
  //   nirfRank: 6,
  //   overallScore: 89.7,
  //   placementPct: 91.3,
  //   avgPackageLPA: 15.2,
  //   highestPackageLPA: 72.0,
  //   courses: ["B.Tech", "M.Tech", "MBA", "BCA", "MCA", "Ph.D"],
  //   established: 1994,
  //   trend: "up",
  //   trendChange: 3,
  //   about:
  //     "Amrita Vishwa Vidyapeetham, established in 1994, is a multi-campus, multi-disciplinary research university with its main campus in Coimbatore. It is among the few Indian universities to hold the NAAC A++ accreditation and is consistently ranked within the top 10 universities in India by NIRF. The university is founded on the vision of Sri Mata Amritanandamayi Devi ('Amma'), integrating spiritual values with academic excellence.\n\nThe university's Coimbatore campus is a sprawling 400-acre residential campus with lush greenery, modern infrastructure, and a peaceful academic environment. Amrita is recognised globally for its research initiatives in cybersecurity, healthcare technology, renewable energy, and disaster management, with active collaborations with institutions like MIT, Georgia Tech, and University of Florida.\n\nThe placement cell — AmritaCareers — ensures strong industry connections across IT, healthcare, FMCG, and core engineering sectors. The university regularly hosts TechFest, cultural festivals, and international workshops, providing students with a comprehensive campus experience.",
  //   feeRange: { min: 180, max: 380 },
  //   placementTrend: [
  //     { year: 2020, pct: 85.6, avgLPA: 11.4 },
  //     { year: 2021, pct: 87.4, avgLPA: 12.6 },
  //     { year: 2022, pct: 88.9, avgLPA: 13.8 },
  //     { year: 2023, pct: 90.1, avgLPA: 14.5 },
  //     { year: 2024, pct: 91.3, avgLPA: 15.2 },
  //   ],
  //   salaryBands: [
  //     { label: "5–10 LPA", count: 58 },
  //     { label: "10–20 LPA", count: 195 },
  //     { label: "20–35 LPA", count: 110 },
  //     { label: "35–50 LPA", count: 52 },
  //     { label: "50–72 LPA", count: 24 },
  //     { label: "72+ LPA", count: 6 },
  //   ],
  //   topRecruiters: [
  //     { name: "Amazon", role: "SDE / Cloud Engineer", avgPackage: 30.0 },
  //     { name: "VMware", role: "Software Engineer", avgPackage: 24.0 },
  //     { name: "Cisco", role: "Network Engineer", avgPackage: 22.0 },
  //     { name: "Bosch", role: "Embedded Engineer", avgPackage: 16.0 },
  //     { name: "PayPal", role: "SDE", avgPackage: 20.0 },
  //     { name: "Qualcomm", role: "DSP Engineer", avgPackage: 18.0 },
  //     { name: "TCS Research", role: "Researcher", avgPackage: 10.0 },
  //     { name: "Ericsson", role: "Telecom Engineer", avgPackage: 12.0 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Digital Library",
  //       icon: "📚",
  //       description:
  //         "5 lakh+ books, IEEE digital library, ACM library, and 24×7 e-resources access.",
  //     },
  //     {
  //       name: "Centre for Cybersecurity",
  //       icon: "🔐",
  //       description:
  //         "India's largest academic cybersecurity centre with offensive/defensive labs and CTF arena.",
  //     },
  //     {
  //       name: "Health Sciences Centre",
  //       icon: "🏥",
  //       description:
  //         "State-of-the-art health centre attached to Amrita Hospital, one of South Asia's best hospitals.",
  //     },
  //     {
  //       name: "Sports & Fitness",
  //       icon: "🏊",
  //       description:
  //         "Olympic pool, synthetic athletics track, indoor badminton, squash, and climbing wall.",
  //     },
  //     {
  //       name: "Residential Hostels",
  //       icon: "🏠",
  //       description:
  //         "All-residential campus with 14 hostels, gated security, 24×7 Wi-Fi and smart cafeteria.",
  //     },
  //     {
  //       name: "Amrita TBI",
  //       icon: "🚀",
  //       description:
  //         "Technology Business Incubator with 60+ active startups receiving mentoring and seed funding.",
  //     },
  //     {
  //       name: "Renewable Energy Lab",
  //       icon: "⚡",
  //       description:
  //         "Solar, wind, and hybrid energy research lab with live grid-connected test installations.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply through Amrita's official admissions portal or through JEE Main scores.",
  //       "Appear for Amrita Engineering Entrance Exam (AEEE) if not using JEE Main scores.",
  //       "Receive merit list ranking based on AEEE or JEE Main percentile.",
  //       "Participate in online counselling — choose programme and campus.",
  //       "Pay registration and seat acceptance fee to confirm the allotted seat.",
  //       "Report to campus with originals, pay full fees, and begin orientation.",
  //     ],
  //     eligibility: [
  //       "Class 12 with Physics, Chemistry, Mathematics (PCM) as mandatory subjects.",
  //       "Minimum 60% aggregate in PCM (55% for reserved categories).",
  //       "Minimum 60% marks in English in Class 12.",
  //       "Valid AEEE score or JEE Main percentile ≥ 60 for direct admission.",
  //     ],
  //     keyDates: [
  //       { event: "AEEE Registration Opens", date: "Nov 15, 2023" },
  //       { event: "AEEE Computer-Based Test", date: "Feb 28 – Mar 15, 2024" },
  //       { event: "Results Declaration", date: "Apr 10, 2024" },
  //       { event: "Counselling Round 1", date: "May 20, 2024" },
  //       { event: "Seat Confirmation Deadline", date: "Jun 5, 2024" },
  //       { event: "Classes Commence", date: "Jul 10, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 350000,
  //       seats: 300,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 295000,
  //       seats: 200,
  //     },
  //     {
  //       name: "Cybersecurity",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 360000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Mechanical Engineering",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 250000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "M.Tech",
  //       duration: "2 years",
  //       annualFee: 220000,
  //       seats: 60,
  //     },
  //     {
  //       name: "Business Administration",
  //       degree: "MBA",
  //       duration: "2 years",
  //       annualFee: 280000,
  //       seats: 80,
  //     },
  //   ],
  // },
  // {
  //   id: 5,
  //   rank: 5,
  //   name: "VIT University",
  //   shortName: "VIT Vellore",
  //   type: "Deemed",
  //   city: "Vellore",
  //   state: "Tamil Nadu",
  //   naacGrade: "A+",
  //   nirfRank: 11,
  //   overallScore: 88.4,
  //   placementPct: 90.8,
  //   avgPackageLPA: 14.6,
  //   highestPackageLPA: 67.0,
  //   courses: ["B.Tech", "M.Tech", "MBA", "BCA", "MCA", "Ph.D"],
  //   established: 1984,
  //   trend: "up",
  //   trendChange: 1,
  //   about:
  //     "Vellore Institute of Technology (VIT) was founded in 1984 as Vellore Engineering College by Dr. G. Viswanathan, and was granted deemed university status in 2001. Located in Vellore, Tamil Nadu, VIT is one of the most popular private technical universities in India, consistently drawing applications from over 2.5 lakh students each year for its VITEEE entrance exam.\n\nVIT is known for its strong industry-oriented curriculum, with over 30,000 students across its Vellore and Chennai campuses. The university has 96 undergraduate programmes, 55 postgraduate programmes, and 12 integrated programmes. VIT's FFCs (Faculty of Foreign Collaboration) model brings in faculty from top international universities, creating a global learning environment.\n\nThe university's placement record is outstanding, with Fortune 500 companies and top-tier startups visiting campus every year. VIT's Centre for International Affairs and Collaborations has inked MoUs with 225+ universities worldwide, offering students rich opportunities for exchange programmes, joint research, and dual degrees.",
  //   feeRange: { min: 195, max: 420 },
  //   placementTrend: [
  //     { year: 2020, pct: 83.2, avgLPA: 10.8 },
  //     { year: 2021, pct: 85.7, avgLPA: 11.9 },
  //     { year: 2022, pct: 87.9, avgLPA: 13.2 },
  //     { year: 2023, pct: 89.4, avgLPA: 14.0 },
  //     { year: 2024, pct: 90.8, avgLPA: 14.6 },
  //   ],
  //   salaryBands: [
  //     { label: "5–10 LPA", count: 92 },
  //     { label: "10–20 LPA", count: 340 },
  //     { label: "20–35 LPA", count: 180 },
  //     { label: "35–50 LPA", count: 68 },
  //     { label: "50–67 LPA", count: 30 },
  //     { label: "67+ LPA", count: 10 },
  //   ],
  //   topRecruiters: [
  //     { name: "Adobe", role: "SDE", avgPackage: 28.0 },
  //     { name: "Atlassian", role: "Software Engineer", avgPackage: 32.0 },
  //     { name: "Juspay", role: "SDE", avgPackage: 22.0 },
  //     { name: "Flipkart", role: "SDE", avgPackage: 24.0 },
  //     { name: "Capgemini", role: "Analyst", avgPackage: 7.5 },
  //     { name: "Accenture", role: "Associate", avgPackage: 6.8 },
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "Honeywell", role: "Embedded Engineer", avgPackage: 12.0 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Anna Centenary Library",
  //       icon: "📚",
  //       description:
  //         "8-storey digital library with 1.5 lakh+ books, 45,000 e-books, and reading gallery.",
  //     },
  //     {
  //       name: "Sports Stadium",
  //       icon: "🏟️",
  //       description:
  //         "International-standard cricket stadium, athletics track, and 14 different sport courts.",
  //     },
  //     {
  //       name: "Healthcare Centre",
  //       icon: "🏥",
  //       description:
  //         "Full-service hospital with 24×7 emergency care, dental clinic, and mental health support.",
  //     },
  //     {
  //       name: "14 Hostels",
  //       icon: "🏠",
  //       description:
  //         "Air-conditioned hostels with high-speed internet, food courts, and 24×7 security.",
  //     },
  //     {
  //       name: "TechHub Lab",
  //       icon: "💻",
  //       description:
  //         "Largest student-run tech incubation space in Tamil Nadu with 80+ active projects.",
  //     },
  //     {
  //       name: "GRE/GMAT Centre",
  //       icon: "🎓",
  //       description:
  //         "Dedicated coaching and test preparation centre for international higher education.",
  //     },
  //     {
  //       name: "Convention Centre",
  //       icon: "🎭",
  //       description:
  //         "5,000-seat convention centre for TEDx events, national conferences, and cultural fests.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply for VITEEE (VIT Engineering Entrance Exam) on the official portal.",
  //       "Take the computer-based VITEEE exam at any of the 130+ test centres pan-India.",
  //       "Receive rank based on VITEEE performance (online result).",
  //       "Participate in online counselling and choose preferred programmes.",
  //       "Accept seat by paying seat acceptance fee within the deadline.",
  //       "Report for document verification and complete onboarding process.",
  //     ],
  //     eligibility: [
  //       "Class 12 with Physics, Chemistry, and Mathematics / Biology.",
  //       "Minimum 60% aggregate in Physics, Chemistry, and Maths in Class 12.",
  //       "Students appearing in Class 12 board exams are also eligible to apply.",
  //       "No upper age limit; must have passed Class 12 before admission.",
  //     ],
  //     keyDates: [
  //       { event: "VITEEE Application Opens", date: "Nov 1, 2023" },
  //       { event: "VITEEE Exam (Phase 1)", date: "Apr 19–30, 2024" },
  //       { event: "Result Declaration", date: "May 8, 2024" },
  //       { event: "Online Counselling", date: "May 15–28, 2024" },
  //       { event: "Reporting Deadline", date: "Jun 30, 2024" },
  //       { event: "Semester Begins", date: "Jul 8, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 420000,
  //       seats: 1800,
  //     },
  //     {
  //       name: "AI & Machine Learning",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 440000,
  //       seats: 600,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 380000,
  //       seats: 900,
  //     },
  //     {
  //       name: "Mechanical Engineering",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 320000,
  //       seats: 600,
  //     },
  //     {
  //       name: "Data Science",
  //       degree: "M.Tech",
  //       duration: "2 years",
  //       annualFee: 280000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Business Administration",
  //       degree: "MBA",
  //       duration: "2 years",
  //       annualFee: 350000,
  //       seats: 200,
  //     },
  //   ],
  // },
  // // Colleges 6–20 with minimal but sensible placeholders
  // {
  //   id: 6,
  //   rank: 6,
  //   name: "PSG College of Technology",
  //   shortName: "PSG Tech",
  //   type: "Private",
  //   city: "Coimbatore",
  //   state: "Tamil Nadu",
  //   naacGrade: "A+",
  //   nirfRank: 15,
  //   overallScore: 87.8,
  //   placementPct: 89.4,
  //   avgPackageLPA: 13.2,
  //   highestPackageLPA: 55.0,
  //   courses: ["B.E", "B.Tech", "M.E", "M.Tech", "MBA", "MCA"],
  //   established: 1951,
  //   trend: "stable",
  //   trendChange: 0,
  //   about:
  //     "PSG College of Technology, founded in 1951 by PSG & Sons' Charities, is one of the oldest and most respected engineering colleges in South India. Located in Coimbatore, the college is known for its industry-linked curriculum, excellent placement record, and strong alumni network across manufacturing, IT, and design sectors.\n\nThe college is an autonomous institution affiliated with Anna University and approved by AICTE. It consistently ranks among the top private engineering colleges in Tamil Nadu and has produced several notable alumni in engineering and technology.\n\nPSG Tech is particularly known for its integration with the PSG Industrial Institute next door, giving students direct industry exposure through live projects and internships.",
  //   feeRange: { min: 120, max: 280 },
  //   placementTrend: [
  //     { year: 2020, pct: 83.5, avgLPA: 9.8 },
  //     { year: 2021, pct: 85.2, avgLPA: 10.6 },
  //     { year: 2022, pct: 87.0, avgLPA: 11.8 },
  //     { year: 2023, pct: 88.3, avgLPA: 12.5 },
  //     { year: 2024, pct: 89.4, avgLPA: 13.2 },
  //   ],
  //   salaryBands: [
  //     { label: "4–8 LPA", count: 80 },
  //     { label: "8–15 LPA", count: 200 },
  //     { label: "15–25 LPA", count: 120 },
  //     { label: "25–40 LPA", count: 55 },
  //     { label: "40–55 LPA", count: 18 },
  //     { label: "55+ LPA", count: 5 },
  //   ],
  //   topRecruiters: [
  //     { name: "L&T", role: "Graduate Engineer Trainee", avgPackage: 9.0 },
  //     { name: "Caterpillar", role: "Design Engineer", avgPackage: 14.0 },
  //     {
  //       name: "Delphi Technologies",
  //       role: "Systems Engineer",
  //       avgPackage: 12.0,
  //     },
  //     { name: "Cognizant", role: "Technology Analyst", avgPackage: 7.5 },
  //     { name: "Wipro", role: "Project Engineer", avgPackage: 6.5 },
  //     { name: "GE", role: "Associate Engineer", avgPackage: 10.0 },
  //     { name: "Bosch", role: "Embedded Engineer", avgPackage: 11.0 },
  //     { name: "Infosys", role: "Systems Engineer", avgPackage: 6.5 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Central Library",
  //       icon: "📚",
  //       description:
  //         "Well-stocked library with 1 lakh+ books, journals, and digital resources.",
  //     },
  //     {
  //       name: "Sports Facilities",
  //       icon: "🏅",
  //       description:
  //         "Multiple courts for cricket, football, basketball, and indoor games.",
  //     },
  //     {
  //       name: "Healthcare Centre",
  //       icon: "🏥",
  //       description: "On-campus dispensary with full-time doctors.",
  //     },
  //     {
  //       name: "Hostels",
  //       icon: "🏠",
  //       description: "Separate hostels for men and women with Wi-Fi and mess.",
  //     },
  //     {
  //       name: "Design Studio",
  //       icon: "🎨",
  //       description:
  //         "Modern design studio for product design and innovation projects.",
  //     },
  //     {
  //       name: "Innovation Lab",
  //       icon: "⚗️",
  //       description:
  //         "Fully equipped lab for research and prototype development.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply through TNEA for TNEA-quota seats or directly for NRI/Management quota.",
  //       "Rank-based allotment via TNEA counselling.",
  //       "Report to college with required documents.",
  //       "Complete admission formalities and fee payment.",
  //     ],
  //     eligibility: [
  //       "Passed Class 12 with Physics, Chemistry, Mathematics.",
  //       "Minimum 50% aggregate in PCM subjects.",
  //       "TNEA rank for government quota seats.",
  //     ],
  //     keyDates: [
  //       { event: "TNEA Application Opens", date: "May 6, 2024" },
  //       { event: "Counselling Round 1", date: "Jul 4, 2024" },
  //       { event: "Management Quota Applications", date: "Jun 15, 2024" },
  //       { event: "Classes Begin", date: "Aug 1, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 145000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 140000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Mechanical Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 130000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "M.E",
  //       duration: "2 years",
  //       annualFee: 85000,
  //       seats: 30,
  //     },
  //     {
  //       name: "Business Administration",
  //       degree: "MBA",
  //       duration: "2 years",
  //       annualFee: 95000,
  //       seats: 60,
  //     },
  //   ],
  // },
  // {
  //   id: 7,
  //   rank: 7,
  //   name: "SRM Institute of Science and Technology",
  //   shortName: "SRM Institute",
  //   type: "Deemed",
  //   city: "Chennai",
  //   state: "Tamil Nadu",
  //   naacGrade: "A+",
  //   nirfRank: 20,
  //   overallScore: 86.3,
  //   placementPct: 87.6,
  //   avgPackageLPA: 12.9,
  //   highestPackageLPA: 58.0,
  //   courses: ["B.Tech", "M.Tech", "MBA", "BCA", "MCA", "Ph.D"],
  //   established: 1985,
  //   trend: "up",
  //   trendChange: 2,
  //   about:
  //     "SRM Institute of Science and Technology (SRMIST), established in 1985, is one of the top-ranked universities in India. Located in Kattankulathur, near Chennai, SRMIST has grown into a multi-campus institution with campuses across four states. The university is well-known for its broad spectrum of academic programmes, active research output, and a large, diverse student community from across India and abroad.",
  //   feeRange: { min: 200, max: 420 },
  //   placementTrend: [
  //     { year: 2020, pct: 81.2, avgLPA: 9.4 },
  //     { year: 2021, pct: 83.5, avgLPA: 10.4 },
  //     { year: 2022, pct: 85.0, avgLPA: 11.5 },
  //     { year: 2023, pct: 86.3, avgLPA: 12.2 },
  //     { year: 2024, pct: 87.6, avgLPA: 12.9 },
  //   ],
  //   salaryBands: [
  //     { label: "4–8 LPA", count: 120 },
  //     { label: "8–15 LPA", count: 280 },
  //     { label: "15–25 LPA", count: 160 },
  //     { label: "25–40 LPA", count: 65 },
  //     { label: "40–58 LPA", count: 22 },
  //     { label: "58+ LPA", count: 5 },
  //   ],
  //   topRecruiters: [
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "Infosys", role: "Technology Analyst", avgPackage: 6.5 },
  //     { name: "Cognizant", role: "Associate", avgPackage: 7.5 },
  //     { name: "Amazon", role: "SDE", avgPackage: 22.0 },
  //     { name: "Wipro", role: "Project Engineer", avgPackage: 6.5 },
  //     { name: "Samsung", role: "Software Engineer", avgPackage: 14.0 },
  //     { name: "Ford", role: "Design Engineer", avgPackage: 10.0 },
  //     { name: "L&T", role: "Graduate Engineer", avgPackage: 8.5 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Library",
  //       icon: "📚",
  //       description:
  //         "2 lakh+ books, 12,000 e-journals, and dedicated digital learning terminals.",
  //     },
  //     {
  //       name: "Sports Complex",
  //       icon: "🏅",
  //       description:
  //         "Multi-sport facility including cricket, football, basketball, and swimming.",
  //     },
  //     {
  //       name: "Medical Centre",
  //       icon: "🏥",
  //       description:
  //         "24×7 medical care with resident doctors and ambulance services.",
  //     },
  //     {
  //       name: "Hostels",
  //       icon: "🏠",
  //       description:
  //         "Separate hostels for men and women with all modern amenities.",
  //     },
  //     {
  //       name: "Innovation Hub",
  //       icon: "🚀",
  //       description:
  //         "Startup incubation centre with mentoring and funding support.",
  //     },
  //     {
  //       name: "Research Centres",
  //       icon: "🔬",
  //       description:
  //         "Advanced labs for AI, biotech, and advanced materials research.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply through SRMJEEE (SRM Joint Engineering Entrance Exam).",
  //       "Appear for online computer-based test.",
  //       "Participate in counselling based on SRMJEEE rank.",
  //       "Report to campus with documents and complete admission.",
  //     ],
  //     eligibility: [
  //       "Class 12 with Physics, Chemistry, and Mathematics.",
  //       "Minimum 60% aggregate in PCM.",
  //       "Valid SRMJEEE or JEE Main score.",
  //     ],
  //     keyDates: [
  //       { event: "SRMJEEE Registration Opens", date: "Dec 1, 2023" },
  //       { event: "SRMJEEE Exam", date: "Apr 19–30, 2024" },
  //       { event: "Results", date: "May 10, 2024" },
  //       { event: "Counselling", date: "May 20 – Jun 10, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 420000,
  //       seats: 600,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 360000,
  //       seats: 300,
  //     },
  //     {
  //       name: "Mechanical Engineering",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 300000,
  //       seats: 300,
  //     },
  //     {
  //       name: "Business Administration",
  //       degree: "MBA",
  //       duration: "2 years",
  //       annualFee: 280000,
  //       seats: 120,
  //     },
  //   ],
  // },
  // {
  //   id: 8,
  //   rank: 8,
  //   name: "SSN College of Engineering",
  //   shortName: "SSN College",
  //   type: "Private",
  //   city: "Chennai",
  //   state: "Tamil Nadu",
  //   naacGrade: "A+",
  //   nirfRank: 28,
  //   overallScore: 85.4,
  //   placementPct: 86.2,
  //   avgPackageLPA: 11.8,
  //   highestPackageLPA: 50.0,
  //   courses: ["B.E", "B.Tech", "M.E", "M.Tech", "MBA"],
  //   established: 1996,
  //   trend: "stable",
  //   trendChange: 0,
  //   about:
  //     "SSN College of Engineering, established in 1996, is a premier private engineering college in Chennai, affiliated with Anna University. Founded by Padma Vibhushan Dr. Shiv Nadar, the college is known for its academic excellence, modern infrastructure, and outstanding placement record. SSN offers a scholarship-rich environment, attracting meritorious students from across the state.",
  //   feeRange: { min: 110, max: 250 },
  //   placementTrend: [
  //     { year: 2020, pct: 80.5, avgLPA: 8.9 },
  //     { year: 2021, pct: 82.4, avgLPA: 9.7 },
  //     { year: 2022, pct: 83.9, avgLPA: 10.6 },
  //     { year: 2023, pct: 85.1, avgLPA: 11.2 },
  //     { year: 2024, pct: 86.2, avgLPA: 11.8 },
  //   ],
  //   salaryBands: [
  //     { label: "4–8 LPA", count: 95 },
  //     { label: "8–15 LPA", count: 220 },
  //     { label: "15–25 LPA", count: 100 },
  //     { label: "25–40 LPA", count: 45 },
  //     { label: "40–50 LPA", count: 15 },
  //     { label: "50+ LPA", count: 4 },
  //   ],
  //   topRecruiters: [
  //     { name: "HCL", role: "Technology Consultant", avgPackage: 8.5 },
  //     { name: "Oracle", role: "Applications Engineer", avgPackage: 14.0 },
  //     { name: "Zoho", role: "Software Engineer", avgPackage: 12.0 },
  //     { name: "Cognizant", role: "Technology Analyst", avgPackage: 7.5 },
  //     { name: "Samsung", role: "Software Developer", avgPackage: 11.0 },
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "Infosys", role: "Digital Specialist", avgPackage: 6.5 },
  //     { name: "HP", role: "Embedded Engineer", avgPackage: 9.0 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Library",
  //       icon: "📚",
  //       description:
  //         "Well-equipped library with e-resources and dedicated research section.",
  //     },
  //     {
  //       name: "Sports Ground",
  //       icon: "🏅",
  //       description: "Cricket, football, basketball, and tennis facilities.",
  //     },
  //     {
  //       name: "Medical Centre",
  //       icon: "🏥",
  //       description: "On-campus health centre with full-time doctor.",
  //     },
  //     {
  //       name: "Hostels",
  //       icon: "🏠",
  //       description: "AC and non-AC hostel options with mess and Wi-Fi.",
  //     },
  //     {
  //       name: "Research Labs",
  //       icon: "🔬",
  //       description:
  //         "Advanced labs for AI, machine learning, and embedded systems.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply through TNEA for government quota seats.",
  //       "Management quota applications directly to the college.",
  //       "Document verification and fee payment on allotment.",
  //     ],
  //     eligibility: [
  //       "Class 12 with Physics, Chemistry, Mathematics.",
  //       "Minimum 50% aggregate in PCM subjects.",
  //     ],
  //     keyDates: [
  //       { event: "TNEA Counselling", date: "Jul 4, 2024" },
  //       { event: "Management Quota Deadline", date: "Jul 15, 2024" },
  //       { event: "Classes Begin", date: "Aug 1, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 150000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 140000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Information Technology",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 145000,
  //       seats: 60,
  //     },
  //     {
  //       name: "Computer Science",
  //       degree: "M.E",
  //       duration: "2 years",
  //       annualFee: 95000,
  //       seats: 18,
  //     },
  //   ],
  // },
  // {
  //   id: 9,
  //   rank: 9,
  //   name: "SASTRA University",
  //   shortName: "SASTRA",
  //   type: "Deemed",
  //   city: "Thanjavur",
  //   state: "Tamil Nadu",
  //   naacGrade: "A+",
  //   nirfRank: 32,
  //   overallScore: 84.1,
  //   placementPct: 85.0,
  //   avgPackageLPA: 11.4,
  //   highestPackageLPA: 48.0,
  //   courses: ["B.Tech", "M.Tech", "MBA", "BCA", "MCA", "Ph.D"],
  //   established: 1984,
  //   trend: "up",
  //   trendChange: 1,
  //   about:
  //     "SASTRA Deemed University, established in 1984, is located in Thanjavur, Tamil Nadu. Recognised as a deemed university in 2001, SASTRA has become one of the most sought-after engineering institutions in South India. The university has a distinctive residential campus environment and is known for producing high-quality engineers with strong fundamentals and placement outcomes.",
  //   feeRange: { min: 165, max: 320 },
  //   placementTrend: [
  //     { year: 2020, pct: 79.8, avgLPA: 8.4 },
  //     { year: 2021, pct: 81.6, avgLPA: 9.2 },
  //     { year: 2022, pct: 83.0, avgLPA: 10.1 },
  //     { year: 2023, pct: 84.2, avgLPA: 10.8 },
  //     { year: 2024, pct: 85.0, avgLPA: 11.4 },
  //   ],
  //   salaryBands: [
  //     { label: "4–8 LPA", count: 110 },
  //     { label: "8–15 LPA", count: 195 },
  //     { label: "15–25 LPA", count: 85 },
  //     { label: "25–35 LPA", count: 40 },
  //     { label: "35–48 LPA", count: 14 },
  //     { label: "48+ LPA", count: 4 },
  //   ],
  //   topRecruiters: [
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "Wipro", role: "Project Engineer", avgPackage: 6.5 },
  //     { name: "Infosys", role: "Technology Analyst", avgPackage: 6.5 },
  //     { name: "Zoho", role: "Software Engineer", avgPackage: 12.0 },
  //     { name: "Hexaware", role: "Associate", avgPackage: 5.5 },
  //     { name: "L&T Infotech", role: "Analyst", avgPackage: 7.0 },
  //     { name: "Mindtree", role: "Software Engineer", avgPackage: 7.0 },
  //     { name: "Mphasis", role: "Associate Engineer", avgPackage: 6.0 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Library",
  //       icon: "📚",
  //       description:
  //         "Extensive collection of books, journals, and digital resources.",
  //     },
  //     {
  //       name: "Sports",
  //       icon: "🏅",
  //       description: "Indoor and outdoor sports facilities for students.",
  //     },
  //     {
  //       name: "Medical Centre",
  //       icon: "🏥",
  //       description: "24×7 health centre with medical professionals.",
  //     },
  //     {
  //       name: "Hostels",
  //       icon: "🏠",
  //       description: "Residential campus with hostels for all students.",
  //     },
  //     {
  //       name: "Research Labs",
  //       icon: "🔬",
  //       description: "Modern labs for engineering and science research.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply through SASTRA's official admissions portal.",
  //       "Appear for the SASTRA admissions process or use JEE Main scores.",
  //       "Counselling based on merit and preference.",
  //       "Document verification and fee payment.",
  //     ],
  //     eligibility: [
  //       "Class 12 with Physics, Chemistry, Mathematics.",
  //       "Minimum 60% in PCM.",
  //       "Valid JEE Main or SASTRA entrance score.",
  //     ],
  //     keyDates: [
  //       { event: "Application Opens", date: "Jan 15, 2024" },
  //       { event: "Exam / Merit Evaluation", date: "Apr 20, 2024" },
  //       { event: "Counselling", date: "May 25 – Jun 15, 2024" },
  //       { event: "Classes Begin", date: "Jul 20, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 280000,
  //       seats: 360,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 250000,
  //       seats: 180,
  //     },
  //     {
  //       name: "Mechanical Engineering",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 225000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Business Administration",
  //       degree: "MBA",
  //       duration: "2 years",
  //       annualFee: 195000,
  //       seats: 60,
  //     },
  //   ],
  // },
  // {
  //   id: 10,
  //   rank: 10,
  //   name: "College of Engineering, Guindy",
  //   shortName: "CEG Chennai",
  //   type: "State",
  //   city: "Chennai",
  //   state: "Tamil Nadu",
  //   naacGrade: "A+",
  //   nirfRank: 38,
  //   overallScore: 83.6,
  //   placementPct: 84.7,
  //   avgPackageLPA: 10.9,
  //   highestPackageLPA: 46.0,
  //   courses: ["B.E", "B.Tech", "M.E", "M.Tech", "MBA"],
  //   established: 1794,
  //   trend: "stable",
  //   trendChange: 0,
  //   about:
  //     "College of Engineering, Guindy (CEG), established in 1794, is one of the oldest engineering colleges in Asia and a constituent college of Anna University. Located in the heart of Chennai, CEG has a rich legacy of producing distinguished engineers and leaders. The college is known for its strong fundamentals, government-subsidised fees, and an illustrious alumni network spanning top corporations worldwide.",
  //   feeRange: { min: 18, max: 55 },
  //   placementTrend: [
  //     { year: 2020, pct: 78.5, avgLPA: 8.0 },
  //     { year: 2021, pct: 80.2, avgLPA: 8.8 },
  //     { year: 2022, pct: 82.0, avgLPA: 9.5 },
  //     { year: 2023, pct: 83.4, avgLPA: 10.2 },
  //     { year: 2024, pct: 84.7, avgLPA: 10.9 },
  //   ],
  //   salaryBands: [
  //     { label: "3–6 LPA", count: 80 },
  //     { label: "6–12 LPA", count: 220 },
  //     { label: "12–20 LPA", count: 110 },
  //     { label: "20–35 LPA", count: 55 },
  //     { label: "35–46 LPA", count: 18 },
  //     { label: "46+ LPA", count: 5 },
  //   ],
  //   topRecruiters: [
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "Infosys", role: "Technology Analyst", avgPackage: 6.5 },
  //     { name: "Cognizant", role: "Analyst", avgPackage: 7.5 },
  //     { name: "L&T", role: "Graduate Engineer", avgPackage: 8.5 },
  //     { name: "Honeywell", role: "Process Engineer", avgPackage: 10.0 },
  //     { name: "Bosch", role: "Embedded Engineer", avgPackage: 11.0 },
  //     { name: "HCL", role: "Software Engineer", avgPackage: 8.0 },
  //     { name: "Zoho", role: "Software Engineer", avgPackage: 12.0 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Library",
  //       icon: "📚",
  //       description:
  //         "Historic library with extensive technical and general collections.",
  //     },
  //     {
  //       name: "Sports Complex",
  //       icon: "🏅",
  //       description: "Cricket, football, basketball, and tennis facilities.",
  //     },
  //     {
  //       name: "Medical Centre",
  //       icon: "🏥",
  //       description: "On-campus health services for students and staff.",
  //     },
  //     {
  //       name: "Hostels",
  //       icon: "🏠",
  //       description: "Government-subsidised hostel accommodation with mess.",
  //     },
  //     {
  //       name: "Research Labs",
  //       icon: "🔬",
  //       description:
  //         "Well-equipped labs for engineering and applied science research.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply through TNEA counselling for all B.E/B.Tech seats.",
  //       "Rank-based merit allotment through TNEA.",
  //       "Report with original documents and complete admission process.",
  //     ],
  //     eligibility: [
  //       "Passed Class 12 with Physics, Chemistry, Mathematics.",
  //       "Minimum 50% aggregate in PCM.",
  //       "Must have valid TNEA rank.",
  //     ],
  //     keyDates: [
  //       { event: "TNEA Application Opens", date: "May 6, 2024" },
  //       { event: "TNEA Counselling", date: "Jul 4, 2024" },
  //       { event: "Classes Begin", date: "Aug 1, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 50000,
  //       seats: 80,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 50000,
  //       seats: 80,
  //     },
  //     {
  //       name: "Mechanical Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 48000,
  //       seats: 80,
  //     },
  //     {
  //       name: "Civil Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 48000,
  //       seats: 60,
  //     },
  //   ],
  // },
  // {
  //   id: 11,
  //   rank: 11,
  //   name: "Thiagarajar College of Engineering",
  //   shortName: "TCE Madurai",
  //   type: "Private",
  //   city: "Madurai",
  //   state: "Tamil Nadu",
  //   naacGrade: "A+",
  //   nirfRank: 44,
  //   overallScore: 82.3,
  //   placementPct: 83.5,
  //   avgPackageLPA: 10.4,
  //   highestPackageLPA: 42.0,
  //   courses: ["B.E", "B.Tech", "M.E", "M.Tech"],
  //   established: 1957,
  //   trend: "up",
  //   trendChange: 2,
  //   about:
  //     "Thiagarajar College of Engineering (TCE) in Madurai is a well-established private engineering college founded in 1957. Affiliated with Anna University, TCE has a strong reputation for academic excellence and is known for its dedicated faculty and rigorous curriculum.",
  //   feeRange: { min: 95, max: 200 },
  //   placementTrend: [
  //     { year: 2020, pct: 77.0, avgLPA: 7.8 },
  //     { year: 2021, pct: 79.2, avgLPA: 8.5 },
  //     { year: 2022, pct: 80.8, avgLPA: 9.2 },
  //     { year: 2023, pct: 82.1, avgLPA: 9.8 },
  //     { year: 2024, pct: 83.5, avgLPA: 10.4 },
  //   ],
  //   salaryBands: [
  //     { label: "3–6 LPA", count: 70 },
  //     { label: "6–12 LPA", count: 180 },
  //     { label: "12–22 LPA", count: 90 },
  //     { label: "22–35 LPA", count: 35 },
  //     { label: "35–42 LPA", count: 12 },
  //     { label: "42+ LPA", count: 3 },
  //   ],
  //   topRecruiters: [
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "Wipro", role: "Project Engineer", avgPackage: 6.5 },
  //     { name: "Infosys", role: "Technology Analyst", avgPackage: 6.5 },
  //     { name: "L&T", role: "Graduate Engineer", avgPackage: 8.5 },
  //     { name: "Cognizant", role: "Analyst", avgPackage: 7.5 },
  //     { name: "HCL", role: "Software Engineer", avgPackage: 8.0 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Library",
  //       icon: "📚",
  //       description: "Comprehensive library with books and digital resources.",
  //     },
  //     {
  //       name: "Sports",
  //       icon: "🏅",
  //       description: "Multi-sport facilities for students.",
  //     },
  //     {
  //       name: "Medical Centre",
  //       icon: "🏥",
  //       description: "On-campus health services.",
  //     },
  //     {
  //       name: "Hostels",
  //       icon: "🏠",
  //       description: "Hostel accommodation with mess facilities.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply via TNEA counselling.",
  //       "Document verification.",
  //       "Fee payment and admission confirmation.",
  //     ],
  //     eligibility: [
  //       "Class 12 with PCM.",
  //       "Minimum 50% in PCM.",
  //       "TNEA rank required.",
  //     ],
  //     keyDates: [
  //       { event: "TNEA Counselling", date: "Jul 4, 2024" },
  //       { event: "Classes Begin", date: "Aug 1, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 120000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 115000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Mechanical Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 110000,
  //       seats: 120,
  //     },
  //   ],
  // },
  // {
  //   id: 12,
  //   rank: 12,
  //   name: "Coimbatore Institute of Technology",
  //   shortName: "CIT Coimbatore",
  //   type: "Private",
  //   city: "Coimbatore",
  //   state: "Tamil Nadu",
  //   naacGrade: "A",
  //   nirfRank: 42,
  //   overallScore: 82.1,
  //   placementPct: 82.8,
  //   avgPackageLPA: 10.2,
  //   highestPackageLPA: 40.0,
  //   courses: ["B.E", "B.Tech", "M.E", "M.Tech", "MBA"],
  //   established: 1956,
  //   trend: "down",
  //   trendChange: -1,
  //   about:
  //     "Coimbatore Institute of Technology (CIT), established in 1956, is one of the oldest engineering colleges in Coimbatore. Known for its strong engineering foundation and practical training approach, CIT has a distinguished alumni network in manufacturing and IT sectors.",
  //   feeRange: { min: 85, max: 185 },
  //   placementTrend: [
  //     { year: 2020, pct: 78.2, avgLPA: 7.9 },
  //     { year: 2021, pct: 79.8, avgLPA: 8.5 },
  //     { year: 2022, pct: 81.0, avgLPA: 9.2 },
  //     { year: 2023, pct: 82.0, avgLPA: 9.8 },
  //     { year: 2024, pct: 82.8, avgLPA: 10.2 },
  //   ],
  //   salaryBands: [
  //     { label: "3–6 LPA", count: 75 },
  //     { label: "6–12 LPA", count: 165 },
  //     { label: "12–20 LPA", count: 80 },
  //     { label: "20–32 LPA", count: 30 },
  //     { label: "32–40 LPA", count: 10 },
  //     { label: "40+ LPA", count: 2 },
  //   ],
  //   topRecruiters: [
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "L&T", role: "Graduate Engineer", avgPackage: 8.5 },
  //     { name: "Wipro", role: "Project Engineer", avgPackage: 6.5 },
  //     { name: "Infosys", role: "Technology Analyst", avgPackage: 6.5 },
  //     { name: "HCL", role: "Software Engineer", avgPackage: 8.0 },
  //     { name: "Cognizant", role: "Analyst", avgPackage: 7.5 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Library",
  //       icon: "📚",
  //       description: "Library with extensive books and technical journals.",
  //     },
  //     {
  //       name: "Sports",
  //       icon: "🏅",
  //       description: "Various sports facilities for students.",
  //     },
  //     {
  //       name: "Medical Centre",
  //       icon: "🏥",
  //       description: "Health centre on campus.",
  //     },
  //     {
  //       name: "Hostels",
  //       icon: "🏠",
  //       description: "Hostel accommodation for students.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply via TNEA counselling.",
  //       "Document verification.",
  //       "Fee payment.",
  //     ],
  //     eligibility: [
  //       "Class 12 with PCM.",
  //       "Minimum 50% aggregate.",
  //       "TNEA rank.",
  //     ],
  //     keyDates: [
  //       { event: "TNEA Counselling", date: "Jul 4, 2024" },
  //       { event: "Classes Begin", date: "Aug 1, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 110000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 105000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Mechanical Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 100000,
  //       seats: 120,
  //     },
  //   ],
  // },
  // {
  //   id: 13,
  //   rank: 13,
  //   name: "Kongu Engineering College",
  //   shortName: "KEC Erode",
  //   type: "Private",
  //   city: "Erode",
  //   state: "Tamil Nadu",
  //   naacGrade: "A",
  //   nirfRank: 56,
  //   overallScore: 80.7,
  //   placementPct: 81.4,
  //   avgPackageLPA: 9.8,
  //   highestPackageLPA: 38.0,
  //   courses: ["B.E", "B.Tech", "M.E", "MBA"],
  //   established: 1983,
  //   trend: "up",
  //   trendChange: 1,
  //   about:
  //     "Kongu Engineering College (KEC), founded in 1983, is an autonomous institution affiliated with Anna University, located in Erode. KEC has a strong tradition of producing industry-ready engineers and is known for its consistent placement record and industry partnerships in the Coimbatore-Erode manufacturing belt.",
  //   feeRange: { min: 80, max: 165 },
  //   placementTrend: [
  //     { year: 2020, pct: 75.8, avgLPA: 7.2 },
  //     { year: 2021, pct: 77.5, avgLPA: 7.9 },
  //     { year: 2022, pct: 79.2, avgLPA: 8.6 },
  //     { year: 2023, pct: 80.4, avgLPA: 9.2 },
  //     { year: 2024, pct: 81.4, avgLPA: 9.8 },
  //   ],
  //   salaryBands: [
  //     { label: "3–6 LPA", count: 85 },
  //     { label: "6–12 LPA", count: 150 },
  //     { label: "12–20 LPA", count: 65 },
  //     { label: "20–30 LPA", count: 25 },
  //     { label: "30–38 LPA", count: 8 },
  //     { label: "38+ LPA", count: 2 },
  //   ],
  //   topRecruiters: [
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "L&T", role: "Graduate Engineer", avgPackage: 8.5 },
  //     { name: "Wipro", role: "Project Engineer", avgPackage: 6.5 },
  //     { name: "Infosys", role: "Technology Analyst", avgPackage: 6.5 },
  //     { name: "Cognizant", role: "Analyst", avgPackage: 7.5 },
  //     { name: "HCL", role: "Software Engineer", avgPackage: 8.0 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Library",
  //       icon: "📚",
  //       description: "Library with technical books and e-resources.",
  //     },
  //     { name: "Sports", icon: "🏅", description: "Multi-sport facilities." },
  //     {
  //       name: "Medical Centre",
  //       icon: "🏥",
  //       description: "On-campus health centre.",
  //     },
  //     {
  //       name: "Hostels",
  //       icon: "🏠",
  //       description: "Hostel facilities for students.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply via TNEA counselling.",
  //       "Document verification.",
  //       "Fee payment.",
  //     ],
  //     eligibility: [
  //       "Class 12 with PCM.",
  //       "Minimum 50% aggregate.",
  //       "TNEA rank.",
  //     ],
  //     keyDates: [
  //       { event: "TNEA Counselling", date: "Jul 4, 2024" },
  //       { event: "Classes Begin", date: "Aug 1, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 105000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 100000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Mechanical Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 95000,
  //       seats: 120,
  //     },
  //   ],
  // },
  // {
  //   id: 14,
  //   rank: 14,
  //   name: "Kumaraguru College of Technology",
  //   shortName: "KCT Coimbatore",
  //   type: "Private",
  //   city: "Coimbatore",
  //   state: "Tamil Nadu",
  //   naacGrade: "A",
  //   nirfRank: 58,
  //   overallScore: 80.2,
  //   placementPct: 80.9,
  //   avgPackageLPA: 9.6,
  //   highestPackageLPA: 36.0,
  //   courses: ["B.E", "B.Tech", "M.E", "MBA", "MCA"],
  //   established: 1984,
  //   trend: "stable",
  //   trendChange: 0,
  //   about:
  //     "Kumaraguru College of Technology (KCT), established in 1984, is a leading private engineering college in Coimbatore. KCT is known for its industry-focused curriculum, entrepreneurship culture, and consistent student outcomes across engineering and management disciplines.",
  //   feeRange: { min: 82, max: 170 },
  //   placementTrend: [
  //     { year: 2020, pct: 75.5, avgLPA: 7.1 },
  //     { year: 2021, pct: 77.0, avgLPA: 7.8 },
  //     { year: 2022, pct: 78.6, avgLPA: 8.5 },
  //     { year: 2023, pct: 80.0, avgLPA: 9.1 },
  //     { year: 2024, pct: 80.9, avgLPA: 9.6 },
  //   ],
  //   salaryBands: [
  //     { label: "3–6 LPA", count: 88 },
  //     { label: "6–12 LPA", count: 145 },
  //     { label: "12–20 LPA", count: 62 },
  //     { label: "20–30 LPA", count: 24 },
  //     { label: "30–36 LPA", count: 8 },
  //     { label: "36+ LPA", count: 2 },
  //   ],
  //   topRecruiters: [
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "Wipro", role: "Project Engineer", avgPackage: 6.5 },
  //     { name: "Infosys", role: "Technology Analyst", avgPackage: 6.5 },
  //     { name: "Cognizant", role: "Analyst", avgPackage: 7.5 },
  //     { name: "L&T", role: "Graduate Engineer", avgPackage: 8.5 },
  //     { name: "HCL", role: "Software Engineer", avgPackage: 8.0 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Library",
  //       icon: "📚",
  //       description: "Library with books and digital resources.",
  //     },
  //     {
  //       name: "Sports",
  //       icon: "🏅",
  //       description: "Sports facilities on campus.",
  //     },
  //     {
  //       name: "Medical Centre",
  //       icon: "🏥",
  //       description: "Health services on campus.",
  //     },
  //     {
  //       name: "Hostels",
  //       icon: "🏠",
  //       description: "Hostel accommodation available.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply via TNEA counselling.",
  //       "Document verification.",
  //       "Fee payment.",
  //     ],
  //     eligibility: [
  //       "Class 12 with PCM.",
  //       "Minimum 50% aggregate.",
  //       "TNEA rank.",
  //     ],
  //     keyDates: [
  //       { event: "TNEA Counselling", date: "Jul 4, 2024" },
  //       { event: "Classes Begin", date: "Aug 1, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 108000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 105000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Business Administration",
  //       degree: "MBA",
  //       duration: "2 years",
  //       annualFee: 75000,
  //       seats: 60,
  //     },
  //   ],
  // },
  // {
  //   id: 15,
  //   rank: 15,
  //   name: "Bannari Amman Institute of Technology",
  //   shortName: "BIT Sathyamangalam",
  //   type: "Private",
  //   city: "Erode",
  //   state: "Tamil Nadu",
  //   naacGrade: "A",
  //   nirfRank: 63,
  //   overallScore: 79.4,
  //   placementPct: 80.1,
  //   avgPackageLPA: 9.2,
  //   highestPackageLPA: 34.0,
  //   courses: ["B.E", "B.Tech", "M.E", "MBA"],
  //   established: 1996,
  //   trend: "up",
  //   trendChange: 2,
  //   about:
  //     "Bannari Amman Institute of Technology (BIT), established in 1996, is situated in the picturesque town of Sathyamangalam in Erode district. BIT is an autonomous institution affiliated with Anna University, recognized for its well-structured programmes and steady improvement in student placements.",
  //   feeRange: { min: 78, max: 160 },
  //   placementTrend: [
  //     { year: 2020, pct: 74.0, avgLPA: 6.8 },
  //     { year: 2021, pct: 76.2, avgLPA: 7.4 },
  //     { year: 2022, pct: 78.0, avgLPA: 8.1 },
  //     { year: 2023, pct: 79.2, avgLPA: 8.7 },
  //     { year: 2024, pct: 80.1, avgLPA: 9.2 },
  //   ],
  //   salaryBands: [
  //     { label: "3–6 LPA", count: 90 },
  //     { label: "6–12 LPA", count: 140 },
  //     { label: "12–20 LPA", count: 55 },
  //     { label: "20–28 LPA", count: 20 },
  //     { label: "28–34 LPA", count: 7 },
  //     { label: "34+ LPA", count: 2 },
  //   ],
  //   topRecruiters: [
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "Wipro", role: "Project Engineer", avgPackage: 6.5 },
  //     { name: "Infosys", role: "Technology Analyst", avgPackage: 6.5 },
  //     { name: "Cognizant", role: "Analyst", avgPackage: 7.5 },
  //     { name: "L&T", role: "Graduate Engineer", avgPackage: 8.5 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Library",
  //       icon: "📚",
  //       description: "Library with technical books and journals.",
  //     },
  //     {
  //       name: "Sports",
  //       icon: "🏅",
  //       description: "Sports facilities available.",
  //     },
  //     {
  //       name: "Medical Centre",
  //       icon: "🏥",
  //       description: "On-campus health services.",
  //     },
  //     {
  //       name: "Hostels",
  //       icon: "🏠",
  //       description: "Hostel accommodation for students.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply via TNEA counselling.",
  //       "Document verification.",
  //       "Fee payment.",
  //     ],
  //     eligibility: [
  //       "Class 12 with PCM.",
  //       "Minimum 50% aggregate.",
  //       "TNEA rank.",
  //     ],
  //     keyDates: [
  //       { event: "TNEA Counselling", date: "Jul 4, 2024" },
  //       { event: "Classes Begin", date: "Aug 1, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 102000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 100000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Mechanical Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 95000,
  //       seats: 120,
  //     },
  //   ],
  // },
  // {
  //   id: 16,
  //   rank: 16,
  //   name: "Sri Krishna College of Engineering",
  //   shortName: "SKCE Coimbatore",
  //   type: "Private",
  //   city: "Coimbatore",
  //   state: "Tamil Nadu",
  //   naacGrade: "A",
  //   nirfRank: 71,
  //   overallScore: 78.1,
  //   placementPct: 79.3,
  //   avgPackageLPA: 8.8,
  //   highestPackageLPA: 32.0,
  //   courses: ["B.E", "B.Tech", "M.E", "MBA"],
  //   established: 2002,
  //   trend: "stable",
  //   trendChange: 0,
  //   about:
  //     "Sri Krishna College of Engineering and Technology (SKCET), established in 2002, is a NAAC 'A' accredited institution in Coimbatore. The college has rapidly grown into a comprehensive engineering institution with strong industry connections in the Coimbatore industrial corridor.",
  //   feeRange: { min: 75, max: 155 },
  //   placementTrend: [
  //     { year: 2020, pct: 73.5, avgLPA: 6.5 },
  //     { year: 2021, pct: 75.8, avgLPA: 7.2 },
  //     { year: 2022, pct: 77.2, avgLPA: 7.9 },
  //     { year: 2023, pct: 78.4, avgLPA: 8.4 },
  //     { year: 2024, pct: 79.3, avgLPA: 8.8 },
  //   ],
  //   salaryBands: [
  //     { label: "3–6 LPA", count: 95 },
  //     { label: "6–12 LPA", count: 130 },
  //     { label: "12–20 LPA", count: 50 },
  //     { label: "20–28 LPA", count: 18 },
  //     { label: "28–32 LPA", count: 6 },
  //     { label: "32+ LPA", count: 1 },
  //   ],
  //   topRecruiters: [
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "Wipro", role: "Project Engineer", avgPackage: 6.5 },
  //     { name: "Infosys", role: "Technology Analyst", avgPackage: 6.5 },
  //     { name: "L&T", role: "Graduate Engineer", avgPackage: 8.5 },
  //     { name: "HCL", role: "Software Engineer", avgPackage: 8.0 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Library",
  //       icon: "📚",
  //       description: "Library with books and digital access.",
  //     },
  //     {
  //       name: "Sports",
  //       icon: "🏅",
  //       description: "Sports facilities on campus.",
  //     },
  //     {
  //       name: "Medical Centre",
  //       icon: "🏥",
  //       description: "Health centre for students.",
  //     },
  //     {
  //       name: "Hostels",
  //       icon: "🏠",
  //       description: "Hostel facilities available.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply via TNEA counselling.",
  //       "Document verification.",
  //       "Fee payment.",
  //     ],
  //     eligibility: [
  //       "Class 12 with PCM.",
  //       "Minimum 50% aggregate.",
  //       "TNEA rank.",
  //     ],
  //     keyDates: [
  //       { event: "TNEA Counselling", date: "Jul 4, 2024" },
  //       { event: "Classes Begin", date: "Aug 1, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 98000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 95000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Mechanical Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 90000,
  //       seats: 120,
  //     },
  //   ],
  // },
  // {
  //   id: 17,
  //   rank: 17,
  //   name: "Hindustan Institute of Technology and Science",
  //   shortName: "Hindustan Institute",
  //   type: "Deemed",
  //   city: "Chennai",
  //   state: "Tamil Nadu",
  //   naacGrade: "A",
  //   nirfRank: 76,
  //   overallScore: 77.3,
  //   placementPct: 78.6,
  //   avgPackageLPA: 8.5,
  //   highestPackageLPA: 30.0,
  //   courses: ["B.Tech", "M.Tech", "MBA", "BCA", "MCA"],
  //   established: 1985,
  //   trend: "down",
  //   trendChange: -1,
  //   about:
  //     "Hindustan Institute of Technology and Science (HITS), established in 1985, is a deemed university in Chennai known for its aeronautical and aerospace engineering programmes. The institute has strong industry linkages in the aviation sector and offers a diverse range of engineering and management programmes.",
  //   feeRange: { min: 140, max: 300 },
  //   placementTrend: [
  //     { year: 2020, pct: 73.2, avgLPA: 6.4 },
  //     { year: 2021, pct: 74.8, avgLPA: 7.0 },
  //     { year: 2022, pct: 76.2, avgLPA: 7.6 },
  //     { year: 2023, pct: 77.5, avgLPA: 8.1 },
  //     { year: 2024, pct: 78.6, avgLPA: 8.5 },
  //   ],
  //   salaryBands: [
  //     { label: "3–6 LPA", count: 88 },
  //     { label: "6–12 LPA", count: 125 },
  //     { label: "12–20 LPA", count: 48 },
  //     { label: "20–25 LPA", count: 15 },
  //     { label: "25–30 LPA", count: 5 },
  //     { label: "30+ LPA", count: 1 },
  //   ],
  //   topRecruiters: [
  //     { name: "Air India", role: "Engineer", avgPackage: 7.5 },
  //     { name: "HAL", role: "Technical Officer", avgPackage: 8.0 },
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "Infosys", role: "Technology Analyst", avgPackage: 6.5 },
  //     { name: "Wipro", role: "Project Engineer", avgPackage: 6.5 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Library",
  //       icon: "📚",
  //       description: "Library with books and digital resources.",
  //     },
  //     {
  //       name: "Aeronautics Lab",
  //       icon: "✈️",
  //       description: "Specialised lab for aeronautical engineering studies.",
  //     },
  //     {
  //       name: "Medical Centre",
  //       icon: "🏥",
  //       description: "Health services on campus.",
  //     },
  //     {
  //       name: "Hostels",
  //       icon: "🏠",
  //       description: "Hostel accommodation available.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply online through official portal.",
  //       "Merit-based counselling.",
  //       "Document verification.",
  //       "Fee payment.",
  //     ],
  //     eligibility: [
  //       "Class 12 with PCM.",
  //       "Minimum 55% aggregate.",
  //       "Entrance exam or JEE Main score.",
  //     ],
  //     keyDates: [
  //       { event: "Applications Open", date: "Jan 15, 2024" },
  //       { event: "Counselling", date: "Jun 1, 2024" },
  //       { event: "Classes Begin", date: "Jul 15, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 180000,
  //       seats: 180,
  //     },
  //     {
  //       name: "Aeronautical Engineering",
  //       degree: "B.Tech",
  //       duration: "4 years",
  //       annualFee: 195000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Business Administration",
  //       degree: "MBA",
  //       duration: "2 years",
  //       annualFee: 145000,
  //       seats: 60,
  //     },
  //   ],
  // },
  // {
  //   id: 18,
  //   rank: 18,
  //   name: "Karpagam Academy of Higher Education",
  //   shortName: "Karpagam Academy",
  //   type: "Deemed",
  //   city: "Coimbatore",
  //   state: "Tamil Nadu",
  //   naacGrade: "A",
  //   nirfRank: 82,
  //   overallScore: 76.8,
  //   placementPct: 77.4,
  //   avgPackageLPA: 8.2,
  //   highestPackageLPA: 28.0,
  //   courses: ["B.E", "B.Tech", "M.E", "MBA", "BCA"],
  //   established: 1999,
  //   trend: "up",
  //   trendChange: 1,
  //   about:
  //     "Karpagam Academy of Higher Education (KAHE), established in 1999, is a deemed university in Coimbatore offering a wide range of professional programmes. The university is recognised for its research initiatives and multi-disciplinary approach to education.",
  //   feeRange: { min: 120, max: 250 },
  //   placementTrend: [
  //     { year: 2020, pct: 71.8, avgLPA: 6.2 },
  //     { year: 2021, pct: 73.4, avgLPA: 6.8 },
  //     { year: 2022, pct: 74.9, avgLPA: 7.4 },
  //     { year: 2023, pct: 76.2, avgLPA: 7.8 },
  //     { year: 2024, pct: 77.4, avgLPA: 8.2 },
  //   ],
  //   salaryBands: [
  //     { label: "3–6 LPA", count: 95 },
  //     { label: "6–12 LPA", count: 118 },
  //     { label: "12–18 LPA", count: 40 },
  //     { label: "18–24 LPA", count: 14 },
  //     { label: "24–28 LPA", count: 4 },
  //     { label: "28+ LPA", count: 1 },
  //   ],
  //   topRecruiters: [
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "Wipro", role: "Project Engineer", avgPackage: 6.5 },
  //     { name: "Infosys", role: "Technology Analyst", avgPackage: 6.5 },
  //     { name: "L&T", role: "Graduate Engineer", avgPackage: 8.5 },
  //     { name: "HCL", role: "Software Engineer", avgPackage: 8.0 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Library",
  //       icon: "📚",
  //       description: "Library with books and e-resources.",
  //     },
  //     {
  //       name: "Sports",
  //       icon: "🏅",
  //       description: "Sports facilities on campus.",
  //     },
  //     {
  //       name: "Medical Centre",
  //       icon: "🏥",
  //       description: "Health services for students.",
  //     },
  //     { name: "Hostels", icon: "🏠", description: "Hostel accommodation." },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply through official portal.",
  //       "Merit-based counselling.",
  //       "Fee payment.",
  //     ],
  //     eligibility: [
  //       "Class 12 with relevant subjects.",
  //       "Minimum 50% aggregate.",
  //       "Entrance exam for some programmes.",
  //     ],
  //     keyDates: [
  //       { event: "Applications Open", date: "Feb 1, 2024" },
  //       { event: "Counselling", date: "Jun 5, 2024" },
  //       { event: "Classes Begin", date: "Jul 18, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 150000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 145000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Business Administration",
  //       degree: "MBA",
  //       duration: "2 years",
  //       annualFee: 110000,
  //       seats: 60,
  //     },
  //   ],
  // },
  // {
  //   id: 19,
  //   rank: 19,
  //   name: "Pondicherry Engineering College",
  //   shortName: "PEC Puducherry",
  //   type: "State",
  //   city: "Puducherry",
  //   state: "Puducherry",
  //   naacGrade: "B++",
  //   nirfRank: 89,
  //   overallScore: 75.2,
  //   placementPct: 76.1,
  //   avgPackageLPA: 7.9,
  //   highestPackageLPA: 26.0,
  //   courses: ["B.E", "B.Tech", "M.E", "M.Tech"],
  //   established: 1984,
  //   trend: "stable",
  //   trendChange: 0,
  //   about:
  //     "Pondicherry Engineering College (PEC), established in 1984, is a government engineering college in Puducherry offering quality technical education at subsidised fees. PEC is affiliated with Pondicherry University and is known for its government-sponsored seats, diverse student body, and good placement support.",
  //   feeRange: { min: 18, max: 50 },
  //   placementTrend: [
  //     { year: 2020, pct: 70.2, avgLPA: 5.9 },
  //     { year: 2021, pct: 72.0, avgLPA: 6.4 },
  //     { year: 2022, pct: 73.5, avgLPA: 7.0 },
  //     { year: 2023, pct: 75.0, avgLPA: 7.5 },
  //     { year: 2024, pct: 76.1, avgLPA: 7.9 },
  //   ],
  //   salaryBands: [
  //     { label: "3–6 LPA", count: 100 },
  //     { label: "6–12 LPA", count: 115 },
  //     { label: "12–18 LPA", count: 38 },
  //     { label: "18–22 LPA", count: 12 },
  //     { label: "22–26 LPA", count: 4 },
  //     { label: "26+ LPA", count: 1 },
  //   ],
  //   topRecruiters: [
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "Wipro", role: "Project Engineer", avgPackage: 6.5 },
  //     { name: "Infosys", role: "Technology Analyst", avgPackage: 6.5 },
  //     { name: "L&T", role: "Graduate Engineer", avgPackage: 8.5 },
  //     { name: "Cognizant", role: "Analyst", avgPackage: 7.5 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Library",
  //       icon: "📚",
  //       description: "Library with books and technical resources.",
  //     },
  //     {
  //       name: "Sports",
  //       icon: "🏅",
  //       description: "Sports and recreation facilities.",
  //     },
  //     {
  //       name: "Medical Centre",
  //       icon: "🏥",
  //       description: "Health centre on campus.",
  //     },
  //     {
  //       name: "Hostels",
  //       icon: "🏠",
  //       description: "Government-subsidised hostel accommodation.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply through Pondicherry admission process.",
  //       "Merit-based selection.",
  //       "Document verification.",
  //       "Fee payment.",
  //     ],
  //     eligibility: [
  //       "Class 12 with PCM.",
  //       "Minimum 50% aggregate.",
  //       "Puducherry domicile or merit category.",
  //     ],
  //     keyDates: [
  //       { event: "Application Opens", date: "May 1, 2024" },
  //       { event: "Counselling", date: "Jul 1, 2024" },
  //       { event: "Classes Begin", date: "Aug 1, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 45000,
  //       seats: 60,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 45000,
  //       seats: 60,
  //     },
  //     {
  //       name: "Mechanical Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 42000,
  //       seats: 60,
  //     },
  //   ],
  // },
  // {
  //   id: 20,
  //   rank: 20,
  //   name: "REC (Regional Engineering College) Chennai",
  //   shortName: "REC Chennai",
  //   type: "Private",
  //   city: "Chennai",
  //   state: "Tamil Nadu",
  //   naacGrade: "B++",
  //   nirfRank: 95,
  //   overallScore: 74.5,
  //   placementPct: 75.3,
  //   avgPackageLPA: 7.6,
  //   highestPackageLPA: 24.0,
  //   courses: ["B.E", "B.Tech", "M.E", "MBA"],
  //   established: 2001,
  //   trend: "down",
  //   trendChange: -2,
  //   about:
  //     "REC Chennai, established in 2001, is a private engineering college affiliated with Anna University. The college offers a range of engineering and management programmes and has been steadily building its placement infrastructure and alumni network over the past decade.",
  //   feeRange: { min: 70, max: 148 },
  //   placementTrend: [
  //     { year: 2020, pct: 69.5, avgLPA: 5.6 },
  //     { year: 2021, pct: 71.2, avgLPA: 6.1 },
  //     { year: 2022, pct: 72.8, avgLPA: 6.7 },
  //     { year: 2023, pct: 74.0, avgLPA: 7.2 },
  //     { year: 2024, pct: 75.3, avgLPA: 7.6 },
  //   ],
  //   salaryBands: [
  //     { label: "3–6 LPA", count: 105 },
  //     { label: "6–12 LPA", count: 105 },
  //     { label: "12–18 LPA", count: 30 },
  //     { label: "18–22 LPA", count: 10 },
  //     { label: "22–24 LPA", count: 3 },
  //     { label: "24+ LPA", count: 1 },
  //   ],
  //   topRecruiters: [
  //     { name: "TCS", role: "Systems Engineer", avgPackage: 7.0 },
  //     { name: "Wipro", role: "Project Engineer", avgPackage: 6.5 },
  //     { name: "Infosys", role: "Technology Analyst", avgPackage: 6.5 },
  //     { name: "Cognizant", role: "Analyst", avgPackage: 7.5 },
  //     { name: "HCL", role: "Software Engineer", avgPackage: 8.0 },
  //   ],
  //   facilities: [
  //     {
  //       name: "Library",
  //       icon: "📚",
  //       description: "Library with books and digital resources.",
  //     },
  //     {
  //       name: "Sports",
  //       icon: "🏅",
  //       description: "Sports facilities for students.",
  //     },
  //     {
  //       name: "Medical Centre",
  //       icon: "🏥",
  //       description: "Health services on campus.",
  //     },
  //     {
  //       name: "Hostels",
  //       icon: "🏠",
  //       description: "Hostel accommodation available.",
  //     },
  //   ],
  //   admissionInfo: {
  //     process: [
  //       "Apply via TNEA counselling.",
  //       "Document verification.",
  //       "Fee payment.",
  //     ],
  //     eligibility: [
  //       "Class 12 with PCM.",
  //       "Minimum 50% aggregate.",
  //       "TNEA rank.",
  //     ],
  //     keyDates: [
  //       { event: "TNEA Counselling", date: "Jul 4, 2024" },
  //       { event: "Classes Begin", date: "Aug 1, 2024" },
  //     ],
  //   },
  //   coursesDetailed: [
  //     {
  //       name: "Computer Science & Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 92000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Electronics & Communication",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 90000,
  //       seats: 120,
  //     },
  //     {
  //       name: "Mechanical Engineering",
  //       degree: "B.E",
  //       duration: "4 years",
  //       annualFee: 88000,
  //       seats: 120,
  //     },
  //   ],
  // },
];
