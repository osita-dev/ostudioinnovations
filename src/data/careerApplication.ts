// ============================================================
// O Studio Innovations — Content Creator Application
// Mirrors the official application form: 20 questions across
// 6 sections. Question text and option ordering live here so
// the page component stays focused on layout and behaviour.
// ============================================================

/** Hero / intro copy shown before the form (spec: "Form Description"). */
export const formDescription = [
  "O Studio Innovations is inviting creative individuals to collaborate with us on exciting content creation and video production projects.",
  "We are interested in people who enjoy bringing ideas to life through video recording, editing, storytelling, scriptwriting, and creative concept development.",
  "Whether you are a beginner, a self-taught creative, a student, or an experienced content creator, you are welcome to apply. You do not need a degree, professional certificate, or expensive equipment to get started.",
  "What matters to us is your creativity, willingness to learn, ability to think differently, and interest in creating meaningful content.",
  "You don't have to be an expert. Bring your ideas, your passion, and your willingness to grow. Let's create something meaningful together.",
  "Please complete this form honestly and share any examples of your work or creative ideas that can help us understand your strengths.",
];

// --- Question options -------------------------------

/** Q5 — checkboxes */
export const creativeInterests = [
  "Video recording and shooting",
  "Video editing",
  "Storytelling and scriptwriting",
  "Developing content ideas and creative concepts",
  "On-camera presentation or acting",
  "Behind-the-scenes production",
  "Other",
];

/** Q6 — multiple choice */
export const experienceLevels = [
  "I am a beginner and eager to learn.",
  "I have practised or created some content on my own.",
  "I regularly create or edit videos.",
  "I have worked on content creation or production projects.",
  "I have professional experience in content creation.",
];

/** Q7 — checkboxes */
export const equipmentOptions = [
  "Smartphone for video recording",
  "Digital camera or other recording equipment",
  "Mobile video editing apps",
  "Computer-based video editing software",
  "Audio recording equipment or microphones",
  "Lighting equipment",
  "Other tools or equipment",
  "I do not currently have equipment, but I am interested in contributing.",
];

/** Q8 — multiple choice */
export const createdBeforeOptions = [
  "Yes, I have created content independently.",
  "Yes, I have contributed to someone else's project.",
  "I have practised but have not published any content.",
  "Not yet, but I have creative ideas I would like to explore.",
];

/** Q13 — multiple choice */
export const collaborationTypes = [
  "Collaborating on individual content projects",
  "Participating in video shoots and production activities",
  "Working on video editing and storytelling",
  "Brainstorming and developing creative ideas",
  "Learning through hands-on collaboration",
  "Open to different types of content projects",
];

/** Q14 — multiple choice */
export const localAvailabilityOptions = [
  "Yes, I am available.",
  "Sometimes, depending on the schedule.",
  "I prefer remote collaboration only.",
  "I would like to discuss the arrangements.",
];

/** Q15 — multiple choice */
export const scheduleOptions = [
  "Weekdays",
  "Weekends",
  "Evenings only",
  "Flexible, depending on the project",
  "Other arrangements",
];

/** Q18 — multiple choice */
export const practicalTaskOptions = [
  "Yes, I would be happy to.",
  "Yes, provided the task and expectations are explained.",
  "I would like more information before deciding.",
];

/** Q19 — applicant declaration, both statements required */
export const declarationStatements = [
  "I confirm that the information provided in this application is accurate to the best of my knowledge.",
  "I confirm that any work samples I submit are my own or that I have permission to share them.",
];

// --- Wizard structure --------------------------------

/**
 * Wizard sections — one per section of the official form.
 * `short` doubles as the stepper label; `title`/`purpose` are
 * shown above the current section's questions.
 */
export const applicationSections = [
  {
    short: "Personal",
    title: "Section 1 — Personal Information",
    purpose: "To understand who you are and how we can contact you.",
  },
  {
    short: "Interests",
    title: "Section 2 — Your Creative Interests",
    purpose: "To discover your interests, strengths, and preferred area of contribution.",
  },
  {
    short: "Portfolio",
    title: "Section 3 — Your Creative Portfolio",
    purpose: "To understand what you can do, what you have explored, and how you approach creative work.",
  },
  {
    short: "Collaboration",
    title: "Section 4 — Collaboration and Availability",
    purpose: "To understand how you would like to contribute to our projects.",
  },
  {
    short: "Challenge",
    title: "Section 5 — Your Creative Challenge",
    purpose:
      "To give applicants an opportunity to demonstrate initiative and creative thinking, regardless of their experience level.",
  },
  {
    short: "Confirmation",
    title: "Section 6 — Final Confirmation",
    purpose: "Review your answers, confirm your declaration, and send your application.",
  },
] as const;
