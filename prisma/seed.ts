import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "KerbSide2024!";

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log("Seeding database...");

  const passwordHash = await hashPassword(DEFAULT_PASSWORD);

  // Create admin users
  const admins = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@kerbside.co.uk" },
      update: {},
      create: {
        email: "admin@kerbside.co.uk",
        passwordHash,
        name: "Platform Admin",
        role: "ADMIN",
      },
    }),
    prisma.user.upsert({
      where: { email: "ops@kerbside.co.uk" },
      update: {},
      create: {
        email: "ops@kerbside.co.uk",
        passwordHash,
        name: "Operations Manager",
        role: "ADMIN",
      },
    }),
    prisma.user.upsert({
      where: { email: "support@kerbside.co.uk" },
      update: {},
      create: {
        email: "support@kerbside.co.uk",
        passwordHash,
        name: "Support Admin",
        role: "ADMIN",
      },
    }),
  ]);

  console.log(`Created ${admins.length} admin users`);

  // Create 10 instructors with varied profiles
  const instructorData = [
    {
      email: "sarah.jones@email.com",
      name: "Sarah Jones",
      phone: "07700900001",
      profile: {
        adiNumber: "123456",
        bio: "Calm and encouraging instructor with 10 years experience. Specialising in nervous drivers.",
        specialisms: ["Nervous Drivers", "Motorway", "Pass Plus"],
        teachingStyle: "PATIENT" as const,
        languages: ["English"],
        carType: "MANUAL" as const,
        gender: "FEMALE" as const,
        anxietyFriendly: true,
        passRate: 0.92,
        hourlyRate: 38,
        coveragePostcodes: ["SW1", "SW3", "SW5", "SW7"],
      },
    },
    {
      email: "imran.khan@email.com",
      name: "Imran Khan",
      phone: "07700900002",
      profile: {
        adiNumber: "234567",
        bio: "Intensive course specialist. Get test-ready in 2 weeks with my proven method.",
        specialisms: ["Intensive Course", "Theory Support"],
        teachingStyle: "INTENSIVE" as const,
        languages: ["English", "Urdu", "Punjabi"],
        carType: "MANUAL" as const,
        gender: "MALE" as const,
        anxietyFriendly: false,
        passRate: 0.88,
        hourlyRate: 35,
        coveragePostcodes: ["E1", "E2", "E3", "E14"],
      },
    },
    {
      email: "anna.kowalski@email.com",
      name: "Anna Kowalski",
      phone: "07700900003",
      profile: {
        adiNumber: "345678",
        bio: "Patient and structured approach. Fluent in Polish and English.",
        specialisms: ["Nervous Drivers", "Refresher"],
        teachingStyle: "STRUCTURED" as const,
        languages: ["English", "Polish"],
        carType: "AUTOMATIC" as const,
        gender: "FEMALE" as const,
        anxietyFriendly: true,
        passRate: 0.85,
        hourlyRate: 32,
        coveragePostcodes: ["N1", "N4", "N5", "N7"],
      },
    },
    {
      email: "david.williams@email.com",
      name: "David Williams",
      phone: "07700900004",
      profile: {
        adiNumber: "456789",
        bio: "Relaxed teaching style that puts students at ease. Dual-control manual and automatic cars available.",
        specialisms: ["Automatic Only", "Pass Plus", "Motorway"],
        teachingStyle: "RELAXED" as const,
        languages: ["English"],
        carType: "BOTH" as const,
        gender: "MALE" as const,
        anxietyFriendly: false,
        passRate: 0.82,
        hourlyRate: 40,
        coveragePostcodes: ["W1", "W2", "W8", "W11"],
      },
    },
    {
      email: "fatima.ahmed@email.com",
      name: "Fatima Ahmed",
      phone: "07700900005",
      profile: {
        adiNumber: "567890",
        bio: "Female instructor specialising in learners who need extra patience and understanding.",
        specialisms: ["Nervous Drivers", "Theory Support", "Refresher"],
        teachingStyle: "PATIENT" as const,
        languages: ["English", "Arabic", "Urdu"],
        carType: "AUTOMATIC" as const,
        gender: "FEMALE" as const,
        anxietyFriendly: true,
        passRate: 0.90,
        hourlyRate: 36,
        coveragePostcodes: ["SE1", "SE5", "SE11", "SE17"],
      },
    },
    {
      email: "james.murphy@email.com",
      name: "James Murphy",
      phone: "07700900006",
      profile: {
        adiNumber: "678901",
        bio: "Adaptive instructor who tailors lessons to your individual needs and learning pace.",
        specialisms: ["Intensive Course", "Motorway", "Pass Plus", "Refresher"],
        teachingStyle: "ADAPTIVE" as const,
        languages: ["English"],
        carType: "MANUAL" as const,
        gender: "MALE" as const,
        anxietyFriendly: false,
        passRate: 0.87,
        hourlyRate: 42,
        coveragePostcodes: ["NW1", "NW3", "NW5", "NW6"],
      },
    },
    {
      email: "priya.patel@email.com",
      name: "Priya Patel",
      phone: "07700900007",
      profile: {
        adiNumber: "789012",
        bio: "Structured lessons with clear progression. Great first-time pass rate.",
        specialisms: ["Theory Support", "Intensive Course"],
        teachingStyle: "STRUCTURED" as const,
        languages: ["English", "Punjabi"],
        carType: "MANUAL" as const,
        gender: "FEMALE" as const,
        anxietyFriendly: false,
        passRate: 0.93,
        hourlyRate: 45,
        coveragePostcodes: ["CR0", "CR2", "CR4", "CR5"],
      },
    },
    {
      email: "carlos.garcia@email.com",
      name: "Carlos Garcia",
      phone: "07700900008",
      profile: {
        adiNumber: "890123",
        bio: "Bilingual instructor offering lessons in English and Spanish. Relaxed approach.",
        specialisms: ["Refresher", "Automatic Only"],
        teachingStyle: "RELAXED" as const,
        languages: ["English", "Spanish"],
        carType: "AUTOMATIC" as const,
        gender: "MALE" as const,
        anxietyFriendly: true,
        passRate: 0.78,
        hourlyRate: 30,
        coveragePostcodes: ["BR1", "BR2", "BR3", "BR5"],
      },
    },
    {
      email: "helen.thompson@email.com",
      name: "Helen Thompson",
      phone: "07700900009",
      profile: {
        adiNumber: "901234",
        bio: "20 years experience. Calm, patient, and extremely thorough preparation for test day.",
        specialisms: ["Nervous Drivers", "Pass Plus", "Motorway"],
        teachingStyle: "PATIENT" as const,
        languages: ["English"],
        carType: "BOTH" as const,
        gender: "FEMALE" as const,
        anxietyFriendly: true,
        passRate: 0.95,
        hourlyRate: 44,
        coveragePostcodes: ["RM1", "RM2", "RM3", "RM7"],
      },
    },
    {
      email: "mark.davies@email.com",
      name: "Mark Davies",
      phone: "07700900010",
      profile: {
        adiNumber: "012345",
        bio: "Intensive course specialist. From zero to test in as little as one week.",
        specialisms: ["Intensive Course", "Theory Support", "Motorway"],
        teachingStyle: "INTENSIVE" as const,
        languages: ["English"],
        carType: "MANUAL" as const,
        gender: "MALE" as const,
        anxietyFriendly: false,
        passRate: 0.70,
        hourlyRate: 28,
        coveragePostcodes: ["DA1", "DA2", "DA5", "DA6"],
      },
    },
  ];

  const instructorUsers = [];
  const instructorProfiles = [];

  for (const data of instructorData) {
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        email: data.email,
        passwordHash,
        name: data.name,
        phone: data.phone,
        role: "INSTRUCTOR",
      },
    });
    instructorUsers.push(user);

    const profile = await prisma.instructorProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        adiNumber: data.profile.adiNumber,
        bio: data.profile.bio,
        specialisms: data.profile.specialisms,
        teachingStyle: data.profile.teachingStyle,
        languages: data.profile.languages,
        carType: data.profile.carType,
        gender: data.profile.gender,
        anxietyFriendly: data.profile.anxietyFriendly,
        passRate: data.profile.passRate,
        hourlyRate: data.profile.hourlyRate,
        coveragePostcodes: data.profile.coveragePostcodes,
      },
    });
    instructorProfiles.push(profile);
  }

  console.log(`Created ${instructorProfiles.length} instructor profiles`);

  // Create 10 students with varied preferences
  const studentData = [
    {
      email: "emily.clark@email.com",
      name: "Emily Clark",
      profile: {
        postcode: "SW1A 2AA",
        preferredGender: "FEMALE" as const,
        preferredLanguage: "English",
        preferredTeachingStyle: "PATIENT" as const,
        preferredCarType: "MANUAL" as const,
        anxietyFriendly: true,
        goalTimeline: "3 months",
        availabilityPattern: "weekday_mornings",
      },
    },
    {
      email: "ali.hassan@email.com",
      name: "Ali Hassan",
      profile: {
        postcode: "E1 6AN",
        preferredGender: "MALE" as const,
        preferredLanguage: "Urdu",
        preferredTeachingStyle: "INTENSIVE" as const,
        preferredCarType: "MANUAL" as const,
        anxietyFriendly: false,
        goalTimeline: "2 weeks",
        availabilityPattern: "weekday_all",
      },
    },
    {
      email: "marta.nowak@email.com",
      name: "Marta Nowak",
      profile: {
        postcode: "N1 9GU",
        preferredGender: "FEMALE" as const,
        preferredLanguage: "Polish",
        preferredTeachingStyle: "STRUCTURED" as const,
        preferredCarType: "AUTOMATIC" as const,
        anxietyFriendly: true,
        goalTimeline: "6 months",
        availabilityPattern: "weekend_all",
      },
    },
    {
      email: "tom.wilson@email.com",
      name: "Tom Wilson",
      profile: {
        postcode: "W1D 3AF",
        preferredGender: "NO_PREFERENCE" as const,
        preferredLanguage: "English",
        preferredTeachingStyle: "RELAXED" as const,
        preferredCarType: "BOTH" as const,
        anxietyFriendly: false,
        goalTimeline: "2 months",
        availabilityPattern: "weekday_evenings",
      },
    },
    {
      email: "zainab.ali@email.com",
      name: "Zainab Ali",
      profile: {
        postcode: "SE1 7PB",
        preferredGender: "FEMALE" as const,
        preferredLanguage: "Arabic",
        preferredTeachingStyle: "PATIENT" as const,
        preferredCarType: "AUTOMATIC" as const,
        anxietyFriendly: true,
        goalTimeline: "4 months",
        availabilityPattern: "weekday_mornings",
      },
    },
    {
      email: "jack.brown@email.com",
      name: "Jack Brown",
      profile: {
        postcode: "NW1 4NR",
        preferredGender: "NO_PREFERENCE" as const,
        preferredLanguage: "English",
        preferredTeachingStyle: "ADAPTIVE" as const,
        preferredCarType: "MANUAL" as const,
        anxietyFriendly: false,
        goalTimeline: "1 month",
        availabilityPattern: "weekend_mornings",
      },
    },
    {
      email: "sofia.martinez@email.com",
      name: "Sofia Martinez",
      profile: {
        postcode: "BR1 1LU",
        preferredGender: "NO_PREFERENCE" as const,
        preferredLanguage: "Spanish",
        preferredTeachingStyle: "RELAXED" as const,
        preferredCarType: "AUTOMATIC" as const,
        anxietyFriendly: false,
        goalTimeline: "3 months",
        availabilityPattern: "weekday_afternoons",
      },
    },
    {
      email: "ryan.taylor@email.com",
      name: "Ryan Taylor",
      profile: {
        postcode: "CR0 2AP",
        preferredGender: "NO_PREFERENCE" as const,
        preferredLanguage: "English",
        preferredTeachingStyle: "STRUCTURED" as const,
        preferredCarType: "MANUAL" as const,
        anxietyFriendly: false,
        goalTimeline: "6 weeks",
        availabilityPattern: "weekday_all",
      },
    },
    {
      email: "amira.begum@email.com",
      name: "Amira Begum",
      profile: {
        postcode: "RM1 3AD",
        preferredGender: "FEMALE" as const,
        preferredLanguage: "English",
        preferredTeachingStyle: "PATIENT" as const,
        preferredCarType: "BOTH" as const,
        anxietyFriendly: true,
        goalTimeline: "5 months",
        availabilityPattern: "weekend_all",
      },
    },
    {
      email: "liam.davis@email.com",
      name: "Liam Davis",
      profile: {
        postcode: "DA1 2EH",
        preferredGender: "MALE" as const,
        preferredLanguage: "English",
        preferredTeachingStyle: "INTENSIVE" as const,
        preferredCarType: "MANUAL" as const,
        anxietyFriendly: false,
        goalTimeline: "2 weeks",
        availabilityPattern: "weekday_all",
      },
    },
  ];

  const studentUsers = [];
  const studentProfiles = [];

  for (const data of studentData) {
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: "STUDENT",
      },
    });
    studentUsers.push(user);

    const profile = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        postcode: data.profile.postcode,
        preferredGender: data.profile.preferredGender,
        preferredLanguage: data.profile.preferredLanguage,
        preferredTeachingStyle: data.profile.preferredTeachingStyle,
        preferredCarType: data.profile.preferredCarType,
        anxietyFriendly: data.profile.anxietyFriendly,
        goalTimeline: data.profile.goalTimeline,
        availabilityPattern: data.profile.availabilityPattern,
      },
    });
    studentProfiles.push(profile);
  }

  console.log(`Created ${studentProfiles.length} student profiles`);

  // Create 20 availability slots across instructors
  const availabilitySlots = [
    { instructorIdx: 0, dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
    { instructorIdx: 0, dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
    { instructorIdx: 0, dayOfWeek: 3, startTime: "09:00", endTime: "13:00" },
    { instructorIdx: 1, dayOfWeek: 1, startTime: "08:00", endTime: "18:00" },
    { instructorIdx: 1, dayOfWeek: 2, startTime: "08:00", endTime: "18:00" },
    { instructorIdx: 1, dayOfWeek: 3, startTime: "08:00", endTime: "18:00" },
    { instructorIdx: 1, dayOfWeek: 4, startTime: "08:00", endTime: "18:00" },
    { instructorIdx: 2, dayOfWeek: 2, startTime: "10:00", endTime: "16:00" },
    { instructorIdx: 2, dayOfWeek: 4, startTime: "10:00", endTime: "16:00" },
    { instructorIdx: 3, dayOfWeek: 1, startTime: "07:00", endTime: "15:00" },
    { instructorIdx: 3, dayOfWeek: 3, startTime: "07:00", endTime: "15:00" },
    { instructorIdx: 3, dayOfWeek: 5, startTime: "07:00", endTime: "15:00" },
    { instructorIdx: 4, dayOfWeek: 0, startTime: "09:00", endTime: "14:00" },
    { instructorIdx: 4, dayOfWeek: 6, startTime: "09:00", endTime: "14:00" },
    { instructorIdx: 5, dayOfWeek: 1, startTime: "09:00", endTime: "18:00" },
    { instructorIdx: 5, dayOfWeek: 2, startTime: "09:00", endTime: "18:00" },
    { instructorIdx: 6, dayOfWeek: 3, startTime: "08:00", endTime: "16:00" },
    { instructorIdx: 7, dayOfWeek: 4, startTime: "14:00", endTime: "20:00" },
    { instructorIdx: 8, dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
    { instructorIdx: 9, dayOfWeek: 6, startTime: "08:00", endTime: "16:00" },
  ];

  for (const slot of availabilitySlots) {
    await prisma.availability.create({
      data: {
        instructorId: instructorProfiles[slot.instructorIdx].id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isRecurring: true,
      },
    });
  }

  console.log(`Created ${availabilitySlots.length} availability slots`);

  // Create 15 bookings in various statuses
  const now = new Date();
  const bookingsData = [
    { studentIdx: 0, instructorIdx: 0, daysOffset: 3, duration: 60, status: "PENDING" as const },
    { studentIdx: 0, instructorIdx: 0, daysOffset: 7, duration: 90, status: "CONFIRMED" as const },
    { studentIdx: 1, instructorIdx: 1, daysOffset: 2, duration: 120, status: "CONFIRMED" as const },
    { studentIdx: 1, instructorIdx: 1, daysOffset: -7, duration: 60, status: "COMPLETED" as const },
    { studentIdx: 2, instructorIdx: 2, daysOffset: 5, duration: 60, status: "PENDING" as const },
    { studentIdx: 2, instructorIdx: 2, daysOffset: -3, duration: 60, status: "COMPLETED" as const },
    { studentIdx: 3, instructorIdx: 3, daysOffset: 1, duration: 90, status: "CONFIRMED" as const },
    { studentIdx: 3, instructorIdx: 3, daysOffset: -14, duration: 60, status: "CANCELLED" as const },
    { studentIdx: 4, instructorIdx: 4, daysOffset: 4, duration: 60, status: "PENDING" as const },
    { studentIdx: 4, instructorIdx: 4, daysOffset: -5, duration: 60, status: "COMPLETED" as const },
    { studentIdx: 5, instructorIdx: 5, daysOffset: 6, duration: 120, status: "CONFIRMED" as const },
    { studentIdx: 6, instructorIdx: 7, daysOffset: -1, duration: 60, status: "COMPLETED" as const },
    { studentIdx: 7, instructorIdx: 6, daysOffset: 10, duration: 60, status: "PENDING" as const },
    { studentIdx: 8, instructorIdx: 8, daysOffset: -10, duration: 90, status: "COMPLETED" as const },
    { studentIdx: 9, instructorIdx: 9, daysOffset: 2, duration: 120, status: "CONFIRMED" as const },
  ];

  const bookings: any[] = [];
  for (const data of bookingsData) {
    const dateTime = new Date(now.getTime() + data.daysOffset * 86400000);
    const hourlyRate = instructorData[data.instructorIdx].profile.hourlyRate;
    const amount = (hourlyRate * data.duration) / 60;
    const commission = amount * 0.15;

    const booking = await prisma.booking.create({
      data: {
        studentId: studentProfiles[data.studentIdx].id,
        instructorId: instructorProfiles[data.instructorIdx].id,
        dateTime,
        durationMinutes: data.duration,
        status: data.status,
        amount,
        commission,
        notes: data.status === "PENDING" ? "Looking forward to the lesson!" : undefined,
      },
    });
    bookings.push(booking);
  }

  console.log(`Created ${bookings.length} bookings`);

  // Create 8 reviews with realistic comments (only for completed bookings)
  const completedBookings = bookings.filter((_, idx) =>
    bookingsData[idx].status === "COMPLETED"
  );

  const reviewComments = [
    { rating: 5, comment: "Fantastic lesson! Sarah was incredibly patient and I finally mastered parallel parking." },
    { rating: 4, comment: "Good intensive session. Covered a lot of ground. Would have liked more time on roundabouts." },
    { rating: 5, comment: "Anna is brilliant. Really helped with my confidence. Highly recommended!" },
    { rating: 4, comment: "Very helpful refresher lesson. David made me feel at ease straightaway." },
    { rating: 5, comment: "Fatima is amazing with nervous learners. I actually enjoyed driving for the first time!" },
    { rating: 3, comment: "Lesson was okay. Felt a bit rushed at times but covered the basics well." },
    { rating: 5, comment: "Helen is the best instructor I have ever had. So thorough and encouraging." },
    { rating: 4, comment: "Great motorway lesson. Felt much more confident on dual carriageways afterwards." },
  ];

  for (let i = 0; i < Math.min(completedBookings.length, reviewComments.length); i++) {
    const bookingIdx = bookingsData.findIndex(
      (d, idx) => d.status === "COMPLETED" && bookings[idx].id === completedBookings[i].id
    );

    await prisma.review.create({
      data: {
        bookingId: completedBookings[i].id,
        studentId: studentProfiles[bookingsData[bookingIdx].studentIdx].id,
        instructorId: instructorProfiles[bookingsData[bookingIdx].instructorIdx].id,
        rating: reviewComments[i].rating,
        comment: reviewComments[i].comment,
      },
    });
  }

  console.log(`Created ${Math.min(completedBookings.length, reviewComments.length)} reviews`);

  // Create 20 progress entries
  const skills = [
    "Cockpit drill", "Moving off", "Stopping", "Gear changing",
    "Steering", "Junctions", "Roundabouts", "Parallel parking",
    "Bay parking", "Emergency stop", "Hill starts", "Dual carriageway",
    "Independent driving", "Mirrors", "Signalling", "Road positioning",
    "Speed management", "Meeting traffic", "Overtaking", "Pedestrian crossings",
  ];

  for (let i = 0; i < 20; i++) {
    const studentIdx = i % studentProfiles.length;
    const instructorIdx = i % instructorProfiles.length;

    await prisma.progress.create({
      data: {
        studentId: studentProfiles[studentIdx].id,
        instructorId: instructorProfiles[instructorIdx].id,
        skillName: skills[i],
        level: Math.min(5, Math.floor(Math.random() * 4) + 2),
        notes: i % 3 === 0 ? "Good progress, keep practising" : undefined,
        date: new Date(now.getTime() - (20 - i) * 86400000),
      },
    });
  }

  console.log("Created 20 progress entries");

  // Create 10 messages
  const messageContents = [
    "Hi, I would like to book a lesson for next week. Are you available Tuesday morning?",
    "Of course! I have 9am and 10:30am available on Tuesday. Which works better for you?",
    "9am would be perfect. See you then!",
    "Great, booked in. Remember to bring your provisional licence!",
    "Hi, just wanted to say thank you for today's lesson. Really feel like I'm improving.",
    "You are doing brilliantly! Keep up the practice between lessons.",
    "Can we focus on roundabouts next lesson? I still find them confusing.",
    "Absolutely, we will spend the full session on roundabouts and approaches.",
    "Running 5 minutes late, sorry! Traffic on the high street.",
    "No worries, I will wait. See you shortly.",
  ];

  for (let i = 0; i < 10; i++) {
    const isFromStudent = i % 2 === 0;
    const studentIdx = Math.floor(i / 4) % studentUsers.length;
    const instructorIdx = Math.floor(i / 4) % instructorUsers.length;

    await prisma.message.create({
      data: {
        senderId: isFromStudent
          ? studentUsers[studentIdx].id
          : instructorUsers[instructorIdx].id,
        receiverId: isFromStudent
          ? instructorUsers[instructorIdx].id
          : studentUsers[studentIdx].id,
        content: messageContents[i],
        read: i < 6,
        bookingId: i < 4 ? bookings[0]?.id : undefined,
      },
    });
  }

  console.log("Created 10 messages");
  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
