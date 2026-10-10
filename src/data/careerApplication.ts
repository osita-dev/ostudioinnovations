// ============================================================
// O Studio Innovations — Content Creator Application
// Question text and option ordering live here so the page
// component stays focused on layout and behaviour.
// ============================================================

export const creativeInterests = [
  "Video recording and shooting",
  "Video editing",
  "Storytelling and scriptwriting",
  "Developing content ideas and concepts",
  "On-camera presentation or acting",
  "Other",
];

export const experienceLevels = [
  "I'm a beginner and eager to learn.",
  "I've practised or created some content.",
  "I regularly create or edit videos.",
  "I have experience working on content projects.",
];

export const equipmentOptions = [
  "Smartphone for recording",
  "Camera",
  "Video editing apps on my phone",
  "Video editing software on a computer",
  "Other tools or equipment",
  "I don't have equipment yet, but I'm interested in contributing.",
];

export const createdBeforeOptions = [
  "Yes",
  "Not yet, but I have ideas I'd like to explore.",
];

export const collaborationTypes = [
  "Collaborating on individual content projects",
  "Joining video shoots and production activities",
  "Working on video editing and storytelling",
  "Developing ideas with other creatives",
  "Open to different types of content projects",
];



/** Wizard steps — titles double as the stepper labels. */
export const applicationSteps = [
  "About You",
  "Creative Interests",
  "Show Your Creativity",
  "Collaboration",
  "Review",
] as const;

/** Reassurance shown above the form. */
export const applicationHighlights = [

  {
    title: "Experienced Creators",
    description:
      "If you've shipped content before, we want to see it — tell us what you've made.",
  },
  {
    title: "Students and self-taught",
    description:
      "Students and self-taught creatives apply on equal footing. Skill and ideas matter here.",
  },
];