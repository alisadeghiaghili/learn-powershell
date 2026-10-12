/**
 * English catalog for LearnPowerShell.
 */

export const en = {
  locale: "en",
  dir: "ltr",
  series: {},
  levels: {},
  ui: {
    welcomeTitle: "Welcome to Learn PowerShell",
    welcomeTitleHtml: 'Welcome to Learn <span class="brand-ps">PowerShell</span>',
    welcomeIntro: "Interactive **PowerShell Object Pipeline** tutorial — sandbox + guided levels.",
    welcomeBoard:
      "The board shows **Cmdlet → Pipeline → Objects → Session State**. That is the material flow of live typed objects PowerShell manages.",
    welcomeTracks:
      "- **Basics**: `Verb-Noun` cmdlets, drive providers, objects & pipeline flow\n- **Scripting**: variables, hashtables, loops, advanced custom functions\n- **SysAdmin**: error streams, remoting (WinRM/SSH), modules, background jobs\n- **Production**: REST APIs, Pester testing, security & engine internals (AST/ETS)",
    welcomeMeta:
      "Meta: `levels`, `why`, `curriculum`, `concepts`, `lesson`, `hint`, `steps`, `show solution`, `undo`, `reset`.",
    welcomeLevelsCount: (n) =>
      `**${n}** levels included. Open Levels to begin, or stay in sandbox.`,
    welcomeWhat: "**What is LearnPowerShell?**",
    welcomeWhatBody:
      "A browser lab bench for modern PowerShell: you type real-shaped cmdlets and watch live objects, pipeline filters, variables, and session state move in real time. No local install required for the tutorial core.",
    welcomePublisher: "**Publisher**",
    welcomePublisherBody:
      "Published and maintained by **Ali Sadeghi Aghili** — programmer, data engineer / scientist, ML engineer. [linktr.ee/aliaghili](https://linktr.ee/aliaghili)",
    welcomeGithub: "- [GitHub — source & issues](https://github.com/alisadeghiaghili/learn-powershell)",
    welcomeCoffee: "Buy Me a Coffee (supports the publisher):",
    openLevels: "Open levels",
    whyPowerShellBtn: "Why PowerShell?",
    appWelcome:
      "Welcome to Learn PowerShell — interactive sandbox and object pipeline visualizer.",
    sandboxSeeded:
      "Virtual lab seeded with filesystem, processes, and services. Try Get-Process.",
    progressSaved:
      "Progress saves in this browser (cookie + localStorage). Resume anytime.",
    language: "Language",
    levels: "Levels",
    lesson: "Lesson",
    lessonTitle: "Replay intro lesson slides",
    guide: "Guide",
    hint: "Hint",
    solution: "Solution",
    undo: "Undo",
    reset: "Reset",
    sandboxBtn: "Sandbox",
    help: "Help",
    titleLine: (id, name, par) => `${id} · ${name} · par ${par}`,
    sandboxTitle: "Sandbox mode",
    learningGuide: "Learning guide",
    guideAlwaysOn:
      "Always-on panel. In a level it shows concepts, field notes, and the solution checklist.",
    startHere: "START HERE",
    startHereItems: [
      "**Why PowerShell?** Type `why` or click Why PowerShell? to learn core purposes",
      "Open **Levels** and begin with Getting Started → Say hello",
      "Type `help` for a map of commands",
      "Type `curriculum` for outcomes you will own",
    ],
    sandboxTip: "SANDBOX TIP",
    sandboxTipItems: [
      "Pipeline: Passes typed objects, not text lines",
      "Terminal: Tab completes word-by-word; ↑/↓ walks history",
      "Progress: Saved in this browser (cookie + localStorage)",
    ],
    noActiveLevel: "No active level",
    noActiveLevelDetail: "Levels → pick a challenge to see the checklist here",
    guideFlashNote:
      "Toolbar Guide flashes this panel. It stays open at full page height.",
    youAreLearning: "YOU ARE LEARNING",
    fieldNotesTitle: "IN PRODUCTION (FIELD NOTES)",
    typeNextTitle: "TYPE NEXT — HIGHLIGHTED IN ORANGE",
    remainingLabel: "○ remaining",
    wrongCommandNote:
      "Wrong command? You stay here — progress is kept. History: ↑ / ↓",
    allSolutionMet: "All solution steps met.",
    nowChip: "now",
    optionalChip: "optional",
    stateNotes: "State notes:",
    bestSoFar: (commands, par) =>
      `Best so far: ${commands} command${commands === 1 ? "" : "s"} · ideal: ${par}`,
    idealSolution: (par) =>
      `Ideal solution: ${par} command${par === 1 ? "" : "s"}`,
    solvedBanner: (n) => `Level solved${n !== null ? ` in ${n} command${n === 1 ? "" : "s"}` : ""}.`,
    levelCleared: "LEVEL CLEARED",
    levelComplete: "Level cleared",
    baskInIt: "Bask in it",
    celebrateOn: (id) => `Celebrate on: ${id}`,
    browseLevels: "Browse levels",
    shareTitle: "Share your progress",
    styleList: "What you have learned so far",
    solveMoreLevels: "Solve a few levels to build your list.",
    shareGroupLabel: "Share",
    linkedin: "LinkedIn",
    xTwitter: "X / Twitter",
    facebook: "Facebook",
    copyPost: "Copy post",
    copied: "Copied to clipboard.",
    copyFailed: "Copy failed — select the text manually.",
    solutionTitle: (id) => `Solution: ${id}`,
    solutionCommands: "Run these commands in order to solve the level:",
    solutionWarn: "Running the solution resets the level to ensure clean state.",
    runSolution: "Run solution",
    cancel: "Cancel",
    close: "Close",
    levelsTitle: "Levels",
    pickChallenge: "Pick a challenge. Solved levels stay saved in this browser.",
    howToRead: "How to read a level row",
    difficultyLegend:
      "**Difficulty** — 1 to 5 dots; more dots = more concepts. Always 5 slots.",
    idealLegend:
      "**Ideal commands** — golf target, not a hard limit.",
    solvedLegend: "**Solved** — your best command count is preserved.",
    solvedLabel: "solved",
    githubTitle: "GitHub repository",
    supportTitle: "Support the author",
    visitorsTitle: "Learners who practiced PowerShell in this sandbox",
    uiGuideTitle: "UI Guide — What Each Region Does",
    uiGuideIntro:
      "Tap **Highlight** on any region to see it pulse on the page, or run `tour` to light them all up at once.",
    uiGuideHighlight: "Highlight",
    uiGuideHowTo: "How to use:",
    quizHeader: (num, total) => `Question ${num} of ${total}`,
    quizAnswerUsage: "Answer with: quiz A, quiz B, or quiz C",
    quizFinished: "Quiz finished! You have completed all questions.",
    quizCorrect: "Correct.",
    quizIncorrect: (letter, answer) => `Incorrect. Best answer: ${letter} — ${answer}`,
    quiz: [
      {
        q: "Which operator compares two values for equality inside a Where-Object filter?",
        a: ["==", "-eq", "-match"],
        correct: 1,
      },
      {
        q: "What does the pipeline operator | pass between cmdlets?",
        a: ["Raw text lines", "Typed objects", "Nothing"],
        correct: 1,
      },
      {
        q: "Which placeholder refers to the current object inside ForEach-Object { }?",
        a: ["$_", "$this", "%item%"],
        correct: 0,
      },
      {
        q: "Which cmdlet sorts pipeline objects by a property?",
        a: ["Group-Object", "Sort-Object", "Select-Object"],
        correct: 1,
      },
      {
        q: "Which switch makes Get-ChildItem include hidden items?",
        a: ["-All", "-Force", "-Verbose"],
        correct: 1,
      },
    ],
    aboutTitle: "About LearnPowerShell",
    cheers: [
      "Clean solve.",
      "Pipeline locked in.",
      "That is PowerShell thinking.",
      "Objects moved. You moved with them.",
    ],
  },
};
