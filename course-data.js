/*
 * Compliance Route 101 — course content
 * ------------------------------------------------------------------
 * Built from the "Sample Course Script: Compliance 101".
 * PRODUCTION NOTE: the scenario, terminology, policies, reporting
 * channels and assessment answers must be reviewed and approved by
 * PRCI subject-matter experts before release.
 */
window.COURSE = {
  title: "Compliance Route 101",
  tagline: "Making responsible decisions at work",
  duration: "≈ 90 minutes",
  passMark: 0.8,
  levels: [
    { min: 0,    title: "Trainee Navigator" },
    { min: 250,  title: "Route Scout" },
    { min: 600,  title: "Checkpoint Specialist" },
    { min: 1000, title: "Compliance Pathfinder" },
    { min: 1400, title: "Integrity Guide" }
  ],

  modules: [
    /* ───────────────────────────── MODULE 1 ───────────────────────────── */
    {
      id: 1, icon: "flag", title: "Welcome & Orientation", short: "Start",
      minutes: 5, district: "Trailhead",
      badge: { id: "trailhead", name: "Trailhead Ready", icon: "flag" },
      screens: [
        {
          type: "intro", icon: "map",
          title: "Welcome to Compliance Route 101",
          subtitle: "Making responsible decisions at work",
          body: "In this course, you’ll explore how compliance connects to everyday decisions, how to recognize a potential concern, and where to turn for guidance. You’ll work through a practical scenario and complete short knowledge checks along the way.",
          narration: "Welcome to Compliance 101. In this course, you’ll explore how compliance connects to everyday decisions, how to recognize a potential concern, and where to turn for guidance. You’ll work through a practical scenario and complete short knowledge checks along the way."
        },
        {
          type: "objectives", icon: "target",
          title: "Your destinations on this route",
          lead: "By the end of this course, you will be able to… Select each signpost to reveal it.",
          narration: "As you move through the course, focus on how these principles apply to your role and your organization’s policies. The goal is to help you recognize when a situation needs attention and know how to respond.",
          points: 10,
          items: [
            { icon: "compass",  title: "Explain",   text: "Explain compliance fundamentals and how a compliance program supports responsible organizational practices." },
            { icon: "search",   title: "Recognize", text: "Recognize potential compliance concerns in common workplace situations." },
            { icon: "signpost", title: "Choose",    text: "Apply a basic decision-making process and choose an appropriate next step when a concern arises." },
            { icon: "megaphone",title: "Identify",  text: "Identify where to seek guidance and the appropriate channels for reporting concerns." }
          ]
        },
        {
          type: "howto", icon: "navigation",
          title: "How the route works",
          narration: "Each module is a checkpoint on your map. Complete a checkpoint to unlock the next stretch of road. Earn route points, collect badges and level up as you go.",
          items: [
            { icon: "mapPin", title: "Checkpoints", text: "Each module is a stop on the map. Finish one to unlock the next stretch of the route." },
            { icon: "star",   title: "Route Points", text: "Earn points for sound decisions, accuracy and speed. Points raise your navigator level." },
            { icon: "award",  title: "Badges", text: "Each completed checkpoint awards a badge for your Route Passport." },
            { icon: "fuel",   title: "Fuel", text: "In the Final Route Challenge, wrong turns cost fuel. Keep your tank above empty to finish strong." }
          ]
        }
      ]
    },

    /* ───────────────────────────── MODULE 2 ───────────────────────────── */
    {
      id: 2, icon: "compass", title: "Compliance Fundamentals", short: "Fundamentals",
      minutes: 12, district: "Foundation Quarter",
      badge: { id: "foundation", name: "Foundation Builder", icon: "compass" },
      screens: [
        {
          type: "pillars", icon: "compass",
          title: "What does compliance mean?",
          lead: "Compliance supports responsible, consistent decisions. Flip each card to explore the four building blocks.",
          narration: "Compliance helps an organization carry out its responsibilities in a consistent and accountable way. Policies and procedures provide guidance, while employees help put that guidance into practice. When something is unclear, asking questions early can help prevent a concern from becoming more serious.",
          points: 10,
          cards: [
            { icon: "book",       title: "Policies",       back: "The organization’s approved expectations — the “what” and the “why” behind responsible conduct." },
            { icon: "listChecks", title: "Procedures",     back: "The step-by-step process for carrying out a policy consistently — the “how”." },
            { icon: "help",       title: "Guidance",       back: "Support from managers and designated contacts when a situation isn’t clear-cut." },
            { icon: "scale",      title: "Accountability", back: "Each person owns their decisions, follows the approved process and documents as directed." }
          ]
        },
        {
          type: "intro", icon: "shield",
          title: "Why a compliance program matters",
          body: "A compliance program gives everyone the same map. It helps the organization meet its responsibilities, treat people and partners fairly, protect its reputation, and catch issues early — while they are still small and easier to resolve.",
          bullets: [
            { icon: "check",  text: "Consistent decisions across teams and locations" },
            { icon: "eye",    text: "Early visibility into questions and concerns" },
            { icon: "shield", text: "Protection for employees, partners and the organization" },
            { icon: "users",  text: "A shared culture of accountability and trust" }
          ],
          narration: "A compliance program gives everyone the same map. It helps the organization meet its responsibilities, protect its reputation and catch issues early, while they are still small and easier to resolve."
        },
        {
          type: "match", icon: "compass",
          title: "Road-sign match",
          lead: "Select a building block, then select the road sign that describes it.",
          narration: "Let's check your bearings. Match each building block of compliance to its description.",
          points: 15,
          pairs: [
            { icon: "book",       term: "Policies",       def: "Approved expectations for conduct" },
            { icon: "listChecks", term: "Procedures",     def: "Step-by-step way to carry out an expectation" },
            { icon: "help",       term: "Guidance",       def: "Support when a situation is unclear" },
            { icon: "scale",      term: "Accountability", def: "Owning decisions and documenting as directed" }
          ]
        }
      ]
    },

    /* ───────────────────────────── MODULE 3 ───────────────────────────── */
    {
      id: 3, icon: "users", title: "Roles, Responsibilities & Policies", short: "Roles",
      minutes: 12, district: "Policy Plaza",
      badge: { id: "roles", name: "Team Navigator", icon: "users" },
      screens: [
        {
          type: "channels", icon: "users",
          title: "Everyone has a role on the route",
          lead: "Compliance isn’t one department’s job. Select each role to see how it contributes.",
          narration: "Compliance works when everyone plays their part. Employees, managers, the compliance function and leadership each have a role in keeping decisions consistent and accountable.",
          points: 10,
          items: [
            { icon: "user",      title: "Employees",  text: "Know the policies that apply to your role, follow approved procedures, ask questions early and raise concerns through appropriate channels." },
            { icon: "userCheck", title: "Managers",   text: "Model expected behavior, help their teams understand procedures, respond to questions and escalate concerns as directed." },
            { icon: "shield",    title: "Compliance Function", text: "Maintains the program, provides guidance and training, and manages concerns through the approved process." },
            { icon: "building",  title: "Leadership", text: "Sets the tone at the top, supports the program with resources and holds the organization accountable." }
          ]
        },
        {
          type: "sort", icon: "users",
          title: "Who owns this stop?",
          lead: "Drag (or tap) each responsibility to the role it best describes.",
          narration: "Now sort each responsibility to the role that owns it.",
          points: 20,
          bins: [
            { id: "emp", label: "Employees",  icon: "user" },
            { id: "mgr", label: "Managers",   icon: "userCheck" },
            { id: "cmp", label: "Compliance Function", icon: "shield" },
            { id: "lead", label: "Leadership", icon: "building" }
          ],
          items: [
            { text: "Follow the approved procedure for your daily tasks", bin: "emp" },
            { text: "Ask a question when a request seems unclear", bin: "emp" },
            { text: "Help the team understand how a procedure applies", bin: "mgr" },
            { text: "Escalate a concern raised by a team member as directed", bin: "mgr" },
            { text: "Provide compliance training and guidance", bin: "cmp" },
            { text: "Manage reported concerns through the approved process", bin: "cmp" },
            { text: "Set the tone at the top and model integrity", bin: "lead" },
            { text: "Provide resources that support the program", bin: "lead" }
          ]
        },
        {
          type: "choice", icon: "book",
          title: "Checkpoint: finding the right policy",
          scenario: { icon: "book", label: "Situation", text: "You’re asked to complete a task you haven’t done before, and you aren’t sure which policy applies." },
          question: "What is the best first move?",
          narration: "You’re asked to complete a new task and you aren’t sure which policy applies. What's your best first move?",
          points: 20,
          options: [
            { text: "Use the approach a coworker used last year.", correct: false },
            { text: "Locate the applicable policy or procedure, and ask your manager or the designated contact if it’s still unclear.", correct: true },
            { text: "Skip the task until someone else notices it.", correct: false }
          ],
          feedback: {
            correct: "Exactly. Policies and procedures are your map — and your manager or designated contact can help you read it.",
            incorrect: "Not quite. Past practice may be outdated and avoiding the task doesn’t resolve it. Start with the applicable policy and ask for guidance if it’s unclear."
          }
        }
      ]
    },

    /* ───────────────────────────── MODULE 4 ───────────────────────────── */
    {
      id: 4, icon: "alert", title: "Recognizing Potential Concerns", short: "Red Flags",
      minutes: 15, district: "Watchtower Ridge",
      badge: { id: "spotter", name: "Red Flag Spotter", icon: "eye" },
      screens: [
        {
          type: "intro", icon: "alert",
          title: "Warning signs on the road",
          body: "A potential concern isn’t always obvious. Often it shows up as a small detour from the normal process. You don’t need to prove anything — you just need to notice, pause and check.",
          bullets: [
            { icon: "clock",    text: "Pressure to rush or skip a step — “just approve it today”" },
            { icon: "fileText", text: "Missing, incomplete or “to-follow-later” documentation" },
            { icon: "split",    text: "Requests to bypass a standard review or approval" },
            { icon: "eye",      text: "Secrecy, unusual changes or requests outside normal channels" }
          ],
          narration: "A potential concern isn't always obvious. It often shows up as a small detour from the normal process: pressure to rush, missing documentation, a request to bypass a review, or unusual secrecy. You don't need to prove anything. Just notice, pause and check."
        },
        {
          type: "redflags", icon: "search",
          title: "Red Flag Radar",
          lead: "Your inbox this morning. Tag every item that could signal a potential concern, then submit. Beat the clock for a speed bonus!",
          narration: "Time for Red Flag Radar. Scan your inbox and tag every item that could signal a potential compliance concern.",
          seconds: 60, points: 10,
          items: [
            { icon: "receipt",  text: "Vendor: “Please approve the invoice today — I’ll send the details later.”", flag: true,  why: "Pressure to approve without supporting documentation." },
            { icon: "calendar", text: "Team calendar invite for the quarterly planning meeting.", flag: false, why: "Routine business activity." },
            { icon: "split",    text: "Colleague: “Can you skip the second review this time? It always passes.”", flag: true,  why: "A request to bypass a standard review step." },
            { icon: "fileText", text: "HR reminder: annual policy acknowledgment is due next month.", flag: false, why: "Routine reminder through a normal channel." },
            { icon: "mail",     text: "Vendor asks to change their bank details by email, effective immediately.", flag: true,  why: "Unusual, urgent change outside the normal verification process." },
            { icon: "gift",     text: "Supplier offers you an expensive gift while a contract decision is pending.", flag: true,  why: "Could create a conflict of interest — check the applicable policy." },
            { icon: "listChecks", text: "Procurement shares the updated, approved purchasing checklist.", flag: false, why: "Approved guidance shared through the proper channel." },
            { icon: "eye",      text: "Manager: “Let’s keep this between us — no need to log it.”", flag: true,  why: "Secrecy and avoiding documentation are warning signs." }
          ]
        },
        {
          type: "choice", icon: "alert",
          title: "Checkpoint: is it a concern?",
          scenario: { icon: "split", label: "Situation", text: "A teammate says, “Everyone skips this verification step when we’re busy. It’s fine.”" },
          question: "How should you view this situation?",
          narration: "A teammate says everyone skips a verification step when it's busy. How should you view this?",
          points: 20,
          options: [
            { text: "It’s fine — if everyone does it, it must be acceptable.", correct: false },
            { text: "It may be a potential concern; check the procedure and seek guidance.", correct: true },
            { text: "It’s only a concern if something has already gone wrong.", correct: false }
          ],
          feedback: {
            correct: "Right. “Everyone does it” doesn’t make a shortcut approved. Check the procedure and ask.",
            incorrect: "Common practice isn’t the same as approved practice, and you don’t need to wait for harm. Check the procedure and seek guidance."
          }
        }
      ]
    },

    /* ───────────────────────────── MODULE 5 ───────────────────────────── */
    {
      id: 5, icon: "signpost", title: "Scenario-Based Decision Practice", short: "Decisions",
      minutes: 20, district: "Crossroads Junction",
      badge: { id: "crossroads", name: "Crossroads Decider", icon: "signpost" },
      screens: [
        {
          type: "branch", icon: "briefcase",
          title: "Scenario: A vendor request",
          narration: "Consider the situation. The request may be routine, or it may raise a question that needs to be checked. What would you do first?",
          start: "s1",
          nodes: {
            s1: {
              scene: { icon: "briefcase", who: "Vendor", quote: "We’re in a hurry — please approve it today, and I’ll send the details later." },
              context: "A vendor asks you to approve an invoice before you’ve reviewed the supporting documentation.",
              question: "What should you do first?",
              options: [
                { text: "A. Approve the invoice to avoid delaying payment.", quality: "risky", points: 0, next: "s1fb",
                  feedback: "Before proceeding, check the applicable process and seek guidance if the request or documentation is unclear." },
                { text: "B. Pause and review the applicable procedure or ask an appropriate contact for guidance.", quality: "best", points: 50, next: "s2",
                  feedback: "Pausing to check the applicable procedure and seeking guidance when needed helps you make an informed decision. Follow PRCI’s approved policies and reporting channels, and document the concern as directed." },
                { text: "C. Ignore the request and take no further action.", quality: "risky", points: 0, next: "s1fb",
                  feedback: "Before proceeding, check the applicable process and seek guidance if the request or documentation is unclear. Ignoring it leaves the question unresolved." }
              ]
            },
            s1fb: { retry: "s1" },
            s2: {
              scene: { icon: "clipboard", who: "Procedure", quote: "Invoices require complete supporting documentation before approval." },
              context: "You checked the procedure. It’s clear: supporting documentation is required first. The vendor calls again and pushes harder.",
              question: "What’s your next move?",
              options: [
                { text: "Explain that the procedure requires documentation before approval and request it.", quality: "best", points: 50, next: "s3",
                  feedback: "Well navigated. You followed the approved process and communicated it respectfully." },
                { text: "Approve half the amount now as a compromise.", quality: "risky", points: 0, next: "s2fb",
                  feedback: "A partial approval still bypasses the required documentation. Stay on the approved route." },
                { text: "Ask your manager or the designated contact how to handle the vendor’s pressure.", quality: "ok", points: 35, next: "s3",
                  feedback: "Good call — seeking guidance is always appropriate. Remember that the procedure already gives you a clear answer." }
              ]
            },
            s2fb: { retry: "s2" },
            s3: {
              scene: { icon: "fileText", who: "You", quote: "I should make a record of this." },
              context: "The vendor’s pressure felt unusual. Your organization’s guidance says to document concerns as directed.",
              question: "What’s the best way to document it?",
              options: [
                { text: "Record the facts — date, request, what was missing and who you contacted — as directed by policy.", quality: "best", points: 50, next: "end",
                  feedback: "Clear, factual documentation helps the right people review the situation." },
                { text: "Write down your opinion of the vendor’s character.", quality: "risky", points: 0, next: "s3fb",
                  feedback: "Stick to facts, not opinions or speculation." },
                { text: "Don’t document anything — it worked out.", quality: "risky", points: 0, next: "s3fb",
                  feedback: "Documenting as directed creates a reliable record, even when the outcome seems fine." }
              ]
            },
            s3fb: { retry: "s3" }
          }
        },
        {
          type: "order", icon: "navigation",
          title: "Plot the route: P · C · D · A",
          lead: "Drag (or use the arrows) to put the four steps for unclear situations in the right order.",
          narration: "Pause. Check. Document. Seek guidance. Put the four steps of the route in order.",
          points: 30,
          items: [
            { icon: "pause",     title: "Pause",  text: "Stop before acting on an unclear request." },
            { icon: "clipboard", title: "Check",  text: "Review the relevant policy or procedure." },
            { icon: "fileText",  title: "Document", text: "Record the facts as directed." },
            { icon: "help",      title: "Ask for guidance", text: "Use an appropriate channel to ask." }
          ]
        }
      ]
    },

    /* ───────────────────────────── MODULE 6 ───────────────────────────── */
    {
      id: 6, icon: "megaphone", title: "Asking Questions & Reporting Concerns", short: "Speak Up",
      minutes: 12, district: "Speak-Up Station",
      badge: { id: "speakup", name: "Speak-Up Navigator", icon: "megaphone" },
      screens: [
        {
          type: "channels", icon: "megaphone",
          title: "Your guidance channels",
          lead: "There’s more than one road to the right answer. Select each channel. (Final channel names and contact details to be confirmed by PRCI.)",
          narration: "There is more than one road to the right answer. You can ask your manager, a designated compliance contact, other designated functions, or use an approved reporting line. Always follow your organization's guidance for raising concerns.",
          points: 10,
          items: [
            { icon: "userCheck", title: "Your Manager or Supervisor", text: "Often the quickest first stop for questions about a process or request." },
            { icon: "shield",    title: "Compliance Contact", text: "The designated compliance team or officer for guidance and for raising concerns." },
            { icon: "building",  title: "Other Designated Functions", text: "Such as HR or Legal, when your organization’s policy directs you there." },
            { icon: "phone",     title: "Approved Reporting Line", text: "An approved reporting channel, which may allow concerns to be raised confidentially as permitted by policy." }
          ]
        },
        {
          type: "choice", icon: "help",
          title: "Knowledge check",
          badgeLabel: "True or False",
          scenario: { icon: "help", label: "True or false?", text: "If you are unsure whether a situation raises a compliance concern, you should wait until you have proof before asking for guidance." },
          question: "Select your answer.",
          narration: "True or false: If you are unsure whether a situation raises a compliance concern, you should wait until you have proof before asking for guidance.",
          points: 25, tf: true,
          options: [
            { text: "True", correct: false },
            { text: "False", correct: true }
          ],
          feedback: {
            correct: "Correct — False. You do not need to determine whether a violation occurred before asking a question or using an appropriate reporting channel. Follow your organization’s guidance for raising concerns.",
            incorrect: "The answer is False. You do not need to determine whether a violation occurred before asking a question or using an appropriate reporting channel. Follow your organization’s guidance for raising concerns."
          }
        },
        {
          type: "mythfact", icon: "message",
          title: "Myth or Fact? Speed round",
          lead: "Decide whether each statement is a myth or a fact.",
          narration: "Speed round. Decide whether each statement is a myth or a fact.",
          points: 10,
          statements: [
            { text: "Asking a question early can help prevent a concern from becoming more serious.", fact: true },
            { text: "Only managers are allowed to raise compliance concerns.", fact: false, why: "Everyone can ask questions and raise concerns through appropriate channels." },
            { text: "I should investigate the situation myself before reporting it.", fact: false, why: "Your role is to raise the concern; the approved process handles review." },
            { text: "Following the organization’s reporting guidance helps concerns reach the right people.", fact: true }
          ]
        }
      ]
    },

    /* ───────────────────────────── MODULE 7 ───────────────────────────── */
    {
      id: 7, icon: "target", title: "Final Route Challenge", short: "Assessment",
      minutes: 10, district: "Summit Checkpoint",
      badge: { id: "summit", name: "Summit Achiever", icon: "target" },
      screens: [
        {
          type: "quiz", icon: "target",
          title: "Final Route Challenge",
          lead: "Six checkpoints stand between you and the summit. You have 3 fuel tanks — each wrong turn costs one. Answer quickly for time bonuses and build a streak for a multiplier. Score 80% or higher to pass.",
          narration: "This is the Final Route Challenge. Answer each checkpoint question. Wrong turns cost fuel, quick answers earn time bonuses, and streaks multiply your points. You need eighty percent to pass.",
          seconds: 30, fuel: 3, base: 50,
          questions: [
            {
              q: "You receive a request to bypass a standard review step, but you are unsure whether the request is authorized. What is the most appropriate next step?",
              options: [
                "Proceed because the request came from a colleague.",
                "Pause and consult the relevant procedure or an appropriate contact before proceeding.",
                "Delete the request and take no further action."
              ],
              answer: 1,
              feedback: "Checking the applicable procedure and seeking guidance helps ensure that the decision follows the organization’s approved process."
            },
            {
              q: "What is the main purpose of a compliance program?",
              options: [
                "To help the organization carry out its responsibilities in a consistent and accountable way.",
                "To make decisions on behalf of every employee.",
                "To replace the need for policies and procedures."
              ],
              answer: 0,
              feedback: "Compliance supports responsible, consistent and accountable decisions across the organization."
            },
            {
              q: "A vendor asks you to approve an invoice today and says supporting details will follow later. What should you do first?",
              options: [
                "Approve it to keep the relationship positive.",
                "Ignore the request.",
                "Pause, check the applicable procedure and seek guidance if anything is unclear."
              ],
              answer: 2,
              feedback: "Pause • Check • Document • Seek guidance — the approved route for unclear requests."
            },
            {
              q: "True or false: You must prove a violation occurred before you raise a concern.",
              options: ["True", "False"],
              answer: 1,
              feedback: "False. You can ask a question or raise a concern through an appropriate channel without proof."
            },
            {
              q: "Which of these is a potential red flag?",
              options: [
                "A request to keep a decision “off the record” and skip documentation.",
                "A reminder to complete annual policy training.",
                "An approved checklist shared by procurement."
              ],
              answer: 0,
              feedback: "Secrecy and avoiding documentation are common warning signs worth checking."
            },
            {
              q: "When documenting a concern, what should you record?",
              options: [
                "Your personal opinions about the people involved.",
                "The relevant facts — what happened, when, and who you contacted — as directed.",
                "Nothing, unless the outcome was negative."
              ],
              answer: 1,
              feedback: "Factual documentation, recorded as directed, helps the right people review the situation."
            }
          ]
        }
      ]
    },

    /* ───────────────────────────── MODULE 8 ───────────────────────────── */
    {
      id: 8, icon: "trophy", title: "Key Takeaways", short: "Finish",
      minutes: 4, district: "Destination",
      badge: { id: "destination", name: "Route Complete", icon: "trophy" },
      screens: [
        {
          type: "takeaway", icon: "key",
          title: "When a situation is unclear…",
          narration: "Compliance is part of everyday work. When you encounter a situation that is unclear, take time to check the relevant guidance and use the appropriate channel to ask questions. Your organization’s policies and procedures will guide the next steps.",
          steps: [
            { icon: "pause",     title: "Pause",    text: "Stop before acting on an unclear request." },
            { icon: "clipboard", title: "Check",    text: "Check the relevant policy or procedure." },
            { icon: "fileText",  title: "Document", text: "Document as directed." },
            { icon: "help",      title: "Ask",      text: "Ask for guidance through an appropriate channel." }
          ]
        },
        {
          type: "reflect", icon: "message",
          title: "Commit to your route",
          lead: "Think about your own role. Which situation on this route are you most likely to encounter, and who would you contact first? (Optional — your note is stored only on this device.)",
          narration: "Take a moment to reflect. Which situation are you most likely to encounter in your role, and who would you contact first?",
          points: 20
        },
        { type: "certificate", icon: "award", title: "Route complete!" }
      ]
    }
  ]
};
