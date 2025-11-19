import Quiz from "./Quiz";

const quizData = {
  questions: [
    {
      question: "Why do we open our eyes wider when we can't see in the dark?",
      options: [
        "Human instinct",
        "Brain thinks it's headlights",
        "Drama",
        "NPC default",
      ],
      answer: "Brain thinks it's headlights",
    },
    {
      question: "What is the natural enemy of white clothes?",
      options: ["Tomato sauce", "Rain", "Dust", "The universe"],
      answer: "Tomato sauce",
    },
    {
      question:
        "Why do we pretend to look for something even when we know we lost it forever?",
      options: ["Hope", "Denial", "Side quest", "NPC loop"],
      answer: "NPC loop",
    },
    {
      question: "What is the true purpose of pockets?",
      options: [
        "Holding items",
        "Losing items",
        "Storing trash",
        "Hand comfort",
      ],
      answer: "Losing items",
    },
    {
      question: "Why do we press harder on a remote when the battery is dying?",
      options: [
        "Force magic",
        "Human stupidity",
        "Muscle instinct",
        "Default setting",
      ],
      answer: "Force magic",
    },
    {
      question: "Which animal acts like it pays rent?",
      options: ["Cat", "Dog", "Goose", "Hamster"],
      answer: "Cat",
    },
    {
      question: "Why do we run faster up the stairs at night?",
      options: ["Ghost DLC", "Adrenaline", "Paranoia perks", "NPC sprint mode"],
      answer: "Ghost DLC",
    },
    {
      question: "What is the true purpose of ceiling fans?",
      options: ["Air", "Ambience", "Threatening noises", "Random wobble"],
      answer: "Threatening noises",
    },
    {
      question: "Why do we turn down the music when looking for an address?",
      options: ["Focus buff", "Brain glitch", "Road respect", "It just works"],
      answer: "Focus buff",
    },
    {
      question:
        "What is the first thought when someone says 'Can I ask you something?'",
      options: ["Fear", "Regret", "Panic", "You already died inside"],
      answer: "Panic",
    },

    {
      question: "What’s the universal reaction to seeing a bug fly toward you?",
      options: ["Scream", "Run", "Kung fu reflex", "Become Olympic athlete"],
      answer: "Become Olympic athlete",
    },
    {
      question: "What do you call waking up tired after 8 hours of sleep?",
      options: [
        "Skill issue",
        "Modern curse",
        "Insomnia",
        "Human disappointment",
      ],
      answer: "Skill issue",
    },
    {
      question: "What is the strongest known element?",
      options: [
        "Diamond",
        "Vibranium",
        "WiFi during exam season",
        "Mom strength",
      ],
      answer: "Mom strength",
    },
    {
      question: "Why do cookies taste better at midnight?",
      options: [
        "Forbidden magic",
        "Night buff",
        "Sadness seasoning",
        "Human glitch",
      ],
      answer: "Forbidden magic",
    },
    {
      question: "Why do we check pockets even when we know nothing is inside?",
      options: ["Hope", "Habit", "NPC animation", "Brain idle motion"],
      answer: "NPC animation",
    },
    {
      question: "What is the final boss of being an adult?",
      options: [
        "Laundry",
        "Waking up early",
        "Dishes",
        "Remembering passwords",
      ],
      answer: "Remembering passwords",
    },
    {
      question:
        "Why do we say 'I'm on the way' when we haven't left the house?",
      options: ["Optimism", "Delusion", "Social survival", "NPC script"],
      answer: "NPC script",
    },
    {
      question: "Which creature is likely to steal your food?",
      options: ["Crow", "Monkey", "Seagull", "All of them"],
      answer: "All of them",
    },
    {
      question: "What is the natural predator of earphones?",
      options: ["Washing machine", "Door handles", "Gravity", "Your pockets"],
      answer: "Door handles",
    },
    {
      question: "Why do we Google things we already know?",
      options: ["Bored", "Reassurance", "NPC behavior", "Brain update check"],
      answer: "Brain update check",
    },

    {
      question: "Why does math suddenly get easier after the exam ends?",
      options: [
        "Brain trolling",
        "Relaxation buff",
        "Hidden talent",
        "Trauma lifted",
      ],
      answer: "Brain trolling",
    },
    {
      question: "Which sound causes instant trauma?",
      options: [
        "Alarm ringtone",
        "Pressure cooker whistle",
        "Thunder",
        "Mom calling your full name",
      ],
      answer: "Alarm ringtone",
    },
    {
      question: "Why do we feel like a hacker when typing fast?",
      options: ["Movie influence", "Delusion", "Power moment", "Brainrot"],
      answer: "Movie influence",
    },
    {
      question: "Where do lost pens go?",
      options: [
        "Black hole",
        "Alternate universe",
        "Coworker’s desk",
        "Unknown realm",
      ],
      answer: "Unknown realm",
    },
    {
      question: "Why do people hum while doing tasks?",
      options: ["Vibe boost", "Rhythm", "NPC soundtrack", "Brain update"],
      answer: "NPC soundtrack",
    },
    {
      question: "What is the most dangerous household item?",
      options: ["Lego brick", "Corner of table", "Wet floor", "Soap in eyes"],
      answer: "Lego brick",
    },
    {
      question: "Why do we re-read messages we already understood?",
      options: [
        "Overthinking",
        "Paranoia",
        "NPC double-check routine",
        "Drama",
      ],
      answer: "NPC double-check routine",
    },
    {
      question: "Why does food become elite when someone else is eating it?",
      options: ["Jealousy", "Human nature", "Forbidden taste", "Snack envy"],
      answer: "Forbidden taste",
    },
    {
      question: "Which creature gives main character vibes?",
      options: ["Cat", "Wolf", "Crow", "Pigeon"],
      answer: "Cat",
    },
    {
      question: "Why do we put our hands on our hips when annoyed?",
      options: ["Buffering", "Dominance", "NPC idle pose", "Drama"],
      answer: "NPC idle pose",
    },

    {
      question:
        "Why do we look in the fridge 10 times hoping food magically appears?",
      options: ["Hope", "Sadness", "Brainloop", "Hunger hallucination"],
      answer: "Hope",
    },
    {
      question: "Which item betrays you the fastest?",
      options: ["USB cable", "Charger wire", "Earphones", "Pen"],
      answer: "Charger wire",
    },
    {
      question: "Why do we say 'ouch' even if it didn’t hurt?",
      options: ["Reflex", "Drama", "Social cue", "NPC pain sound"],
      answer: "NPC pain sound",
    },
    {
      question:
        "What do you call the moment you forget why you walked into a room?",
      options: [
        "Brain crash",
        "Side quest lost",
        "Human lag",
        "Shortcut to nowhere",
      ],
      answer: "Human lag",
    },
    {
      question: "What is the natural predator of peace?",
      options: [
        "Notifications",
        "Doorbell",
        "Family group chat",
        "Work emails",
      ],
      answer: "Family group chat",
    },
    {
      question: "Which animal would be the worst roommate?",
      options: ["Monkey", "Goose", "Raccoon", "Cat"],
      answer: "Goose",
    },
    {
      question: "Why do we talk to pets like they're CEOs?",
      options: ["Cute", "Respect", "Instinct", "They're the boss"],
      answer: "They're the boss",
    },
    {
      question: "Why do we replay arguments in our head?",
      options: ["Overthinking", "Trying to win", "Drama practice", "NPC loop"],
      answer: "Trying to win",
    },
    {
      question: "Which sound gives instant nostalgia?",
      options: [
        "Cartoon intro",
        "Windows XP startup",
        "School bell",
        "Old ringtone",
      ],
      answer: "Windows XP startup",
    },
    {
      question: "What do you call sudden motivation at 2 AM?",
      options: ["Delusion", "Side quest energy", "Temporary buff", "Fake hope"],
      answer: "Temporary buff",
    },

    {
      question: "Why do we fake laugh at unfunny jokes?",
      options: ["Politeness", "Survival", "NPC behavior", "Social pressure"],
      answer: "Social pressure",
    },
    {
      question: "Why do people talk louder when wearing earphones?",
      options: [
        "Not self-aware",
        "NPC malfunction",
        "Trying to hear themselves",
        "Human bug",
      ],
      answer: "NPC malfunction",
    },
    {
      question: "What is the natural predator of silence?",
      options: [
        "Family arguments",
        "Car horns",
        "Notifications",
        "Random dog barking",
      ],
      answer: "Random dog barking",
    },
    {
      question: "Why does everything become funny at 3 AM?",
      options: [
        "Sleep deprivation",
        "Brainrot",
        "Chaos mode",
        "All of the above",
      ],
      answer: "All of the above",
    },
    {
      question: "Which NPC phrase ends all conversations?",
      options: ["Cool", "Nice", "Okay", "Haha"],
      answer: "Okay",
    },
    {
      question: "What is the real reason you forget names instantly?",
      options: ["Brain full", "Social fear", "NPC memory limit", "Distraction"],
      answer: "NPC memory limit",
    },
    {
      question: "Which thing mysteriously tangles itself?",
      options: ["Earphones", "Chains", "Shoelaces", "All of them"],
      answer: "All of them",
    },
    {
      question: "Why do we clean the house when stressed?",
      options: ["Distraction", "Control illusion", "Brain reset", "NPC ritual"],
      answer: "Brain reset",
    },
    {
      question: "Why do we stare at the wall when overwhelmed?",
      options: [
        "Buffering",
        "Brain reboot",
        "NPC idle animation",
        "Existential crisis",
      ],
      answer: "Brain reboot",
    },
    {
      question: "Which object activates pain instantly?",
      options: ["Lego", "Table corner", "Shoes without socks", "All of them"],
      answer: "Lego",
    },

    {
      question: "What causes sudden confidence in front of the mirror?",
      options: [
        "Good lighting",
        "Delusion",
        "Main character mode",
        "Hair looked okay",
      ],
      answer: "Main character mode",
    },
    {
      question: "Why do we rewatch the same comfort show?",
      options: [
        "Zero risk",
        "No emotional damage",
        "Vibe consistency",
        "All of the above",
      ],
      answer: "All of the above",
    },
    {
      question: "Why do we check the time and immediately forget it?",
      options: [
        "Brain lag",
        "Skill issue",
        "NPC processing delay",
        "It wasn’t important",
      ],
      answer: "NPC processing delay",
    },
    {
      question: "Why do we think of the perfect comeback 6 hours later?",
      options: [
        "Brain hates timing",
        "Delayed reaction",
        "NPC scripting",
        "Plot twist",
      ],
      answer: "Delayed reaction",
    },
    {
      question: "Which creature would definitely start drama?",
      options: ["Goose", "Parrot", "Monkey", "Cat"],
      answer: "Parrot",
    },
    {
      question: "Why does food taste better when someone else cooks it?",
      options: ["Love", "Effort avoided", "Lazy happiness", "Different vibe"],
      answer: "Effort avoided",
    },
    {
      question: "Which item betrays you when you least expect it?",
      options: ["Chair leg", "Shoe lace", "Table corner", "Ceiling fan"],
      answer: "Table corner",
    },
    {
      question: "Why do we stare at text messages instead of replying?",
      options: ["Social anxiety", "Overthinking", "NPC freeze", "All of them"],
      answer: "All of them",
    },
    {
      question: "Why do we panic when someone says 'We need to talk'?",
      options: ["Trauma", "Fear", "PTSD unlock", "Skill issue"],
      answer: "Fear",
    },
    {
      question: "What is the natural enemy of motivation?",
      options: ["Bed", "Phone", "Brain", "WiFi"],
      answer: "Phone",
    },
    {
      question: "Why do we say 'I’m fine' when we are clearly not?",
      options: [
        "NPC script",
        "Avoid explaining",
        "Emotional lag",
        "All of them",
      ],
      answer: "NPC script",
    },
    {
      question: "What is the strongest type of bond?",
      options: [
        "Covalent",
        "Ionic",
        "Friendship",
        "People who hate the same person",
      ],
      answer: "People who hate the same person",
    },
    {
      question:
        "Why does your brain replay your most embarrassing moment before sleep?",
      options: ["Pain DLC", "Drama reruns", "Internal sabotage", "Brainrot"],
      answer: "Internal sabotage",
    },
    {
      question: "What’s the natural predator of good decisions?",
      options: [
        "Midnight cravings",
        "Peer pressure",
        "Notifications",
        "Your own brain",
      ],
      answer: "Your own brain",
    },
    {
      question: "Why do pillows feel cold on one side only?",
      options: ["Physics", "Magic", "Comfort gods", "Unknown technology"],
      answer: "Magic",
    },
    {
      question: "Why does every cord magically tangle itself?",
      options: ["Chaos", "Witchcraft", "Cable gremlins", "NPC sabotage"],
      answer: "Cable gremlins",
    },
    {
      question: "What sound gives instant childhood flashbacks?",
      options: [
        "School bell",
        "Cartoon intro",
        "Ice cream truck",
        "All of them",
      ],
      answer: "Ice cream truck",
    },
    {
      question: "Why do we open our mouths while concentrating?",
      options: ["Brain cooling system", "Focus mode", "Human bug", "Instinct"],
      answer: "Human bug",
    },
    {
      question: "Why do we wave at babies like they know us?",
      options: [
        "Cute instinct",
        "NPC greeting protocol",
        "Brain soft moment",
        "Politeness",
      ],
      answer: "Cute instinct",
    },
    {
      question: "What is the most powerful move in any argument?",
      options: ["Silence", "Sarcasm", "Walking away", "Saying 'ok'"],
      answer: "Silence",
    },

    {
      question: "Why does the floor make extra noise only at night?",
      options: [
        "Drama",
        "Ghost collab",
        "Attention seeking",
        "Night mode glitch",
      ],
      answer: "Drama",
    },
    {
      question:
        "Why does running out of shampoo and conditioner never happen at the same time?",
      options: [
        "Universal prank",
        "Cosmic joke",
        "Shower RNG",
        "Balance of life",
      ],
      answer: "Cosmic joke",
    },
    {
      question: "Why do we read the shampoo bottle in the shower?",
      options: ["Bored", "Habit", "NPC idle activity", "Brain likes words"],
      answer: "NPC idle activity",
    },
    {
      question: "What’s the ultimate boss fight of daily life?",
      options: [
        "Waking up",
        "Doing dishes",
        "Laundry folding",
        "Phone battery at 1%",
      ],
      answer: "Waking up",
    },
    {
      question: "Why do we randomly trip on flat surfaces?",
      options: [
        "Physics said no",
        "NPC glitch",
        "Foot lag",
        "Walking update error",
      ],
      answer: "NPC glitch",
    },
    {
      question: "Why does hunger hit hardest right after you brush your teeth?",
      options: [
        "Toothpaste curse",
        "Cosmic timing",
        "Brain trolling",
        "Snack destiny",
      ],
      answer: "Brain trolling",
    },
    {
      question: "Which animal would absolutely spill tea about everyone?",
      options: ["Parrot", "Goat", "Pigeon", "Monkey"],
      answer: "Parrot",
    },
    {
      question: "Why do we mimic accents unconsciously?",
      options: [
        "Brain syncing",
        "NPC assimilation",
        "Social glitch",
        "For fun",
      ],
      answer: "Brain syncing",
    },
    {
      question: "Why do we stare into the fridge hoping food respawns?",
      options: ["Gaming logic", "Hope", "Sadness", "NPC refresh attempt"],
      answer: "NPC refresh attempt",
    },
    {
      question: "What is the natural predator of socks?",
      options: [
        "Washing machine",
        "Dog",
        "Your own forgetfulness",
        "Parallel universe",
      ],
      answer: "Washing machine",
    },

    {
      question: "Why do we suddenly get productive right before a deadline?",
      options: [
        "Fear buff",
        "Stress adrenaline",
        "Superpower unlock",
        "Deadline magic",
      ],
      answer: "Fear buff",
    },
    {
      question: "Why does food drop face-down 90% of the time?",
      options: [
        "Gravity bullying",
        "Universe hates you",
        "Murphy’s law",
        "Surface attraction",
      ],
      answer: "Murphy’s law",
    },
    {
      question: "Why do ghosts only appear when lights are off?",
      options: [
        "Horror rules",
        "Power saving mode",
        "Dramatic effect",
        "NPC lighting",
      ],
      answer: "Dramatic effect",
    },
    {
      question: "Why do we yell 'OW!' before the pain hits?",
      options: [
        "Early warning system",
        "Human glitch",
        "Just dramatic",
        "Skill issue",
      ],
      answer: "Early warning system",
    },
    {
      question: "What is the scariest thing to see at 3 AM?",
      options: [
        "Your reflection",
        "Phone at 1%",
        "Moving shadow",
        "Notification from boss",
      ],
      answer: "Your reflection",
    },
    {
      question: "Why do chargers only break when you desperately need them?",
      options: ["Bad timing", "Device betrayal", "Cable karma", "Plot twist"],
      answer: "Device betrayal",
    },
    {
      question: "What does your brain do when someone says 'Don't laugh'?",
      options: ["Laugh harder", "Explode", "Cry", "Focus on everything funny"],
      answer: "Laugh harder",
    },
    {
      question: "Which animal would start a fight for no reason?",
      options: ["Goose", "Cat", "Monkey", "Squirrel"],
      answer: "Goose",
    },
    {
      question: "Why do we check the same app again after 2 seconds?",
      options: ["Addiction", "Hope", "NPC reset", "Brain boredom"],
      answer: "NPC reset",
    },
    {
      question: "Why do we whisper 'ouch' when someone else gets hurt?",
      options: ["Empathy", "Reflex", "NPC sympathy protocol", "Brain echo"],
      answer: "NPC sympathy protocol",
    },

    {
      question: "Why do we immediately forget the plot after watching a movie?",
      options: [
        "Brain leak",
        "Too much info",
        "NPC memory",
        "You weren't paying attention",
      ],
      answer: "NPC memory",
    },
    {
      question: "What is the most relatable NPC dialogue?",
      options: ["Huh?", "Wait what?", "I forgot", "Same"],
      answer: "Same",
    },
    {
      question: "Which item always disappears exactly when needed?",
      options: ["Scissors", "USB", "Hair tie", "All of them"],
      answer: "All of them",
    },
    {
      question: "Why do we hit the remote when it stops working?",
      options: [
        "Violence fixes everything",
        "Instinct",
        "Frustration",
        "Ancient ritual",
      ],
      answer: "Ancient ritual",
    },
    {
      question: "Why do we pretend we didn’t trip?",
      options: [
        "Dignity",
        "Embarrassment",
        "NPC recovery animation",
        "Social survival",
      ],
      answer: "Dignity",
    },
    {
      question: "Why does water taste elite at 3 AM?",
      options: [
        "Stamina potion",
        "Night flavor",
        "Dehydration",
        "Thirst enlightenment",
      ],
      answer: "Night flavor",
    },
    {
      question: "Why does every USB plug go in wrong on first try?",
      options: ["Universal law", "Cosmic joke", "USB curse", "Human error"],
      answer: "Universal law",
    },
    {
      question: "What’s the most terrifying sound while home alone?",
      options: ["Door creak", "Random thud", "Footsteps", "Your own thoughts"],
      answer: "Random thud",
    },
    {
      question: "Why do we stare at people eating our favorite food?",
      options: ["Envy", "Sadness", "Food jealousy", "NPC curiosity"],
      answer: "Food jealousy",
    },
    {
      question: "Why is it so hard to choose what to eat?",
      options: [
        "Too many options",
        "No options",
        "Brain lag",
        "Existential crisis",
      ],
      answer: "Brain lag",
    },

    {
      question: "Why do we feel we forgot something when leaving the house?",
      options: [
        "Paranoia",
        "Instinct",
        "NPC premonition",
        "You actually forgot something",
      ],
      answer: "NPC premonition",
    },
    {
      question: "Which animal is most likely an NPC?",
      options: ["Pigeon", "Goldfish", "Cow", "Squirrel"],
      answer: "Pigeon",
    },
    {
      question: "Why do we make weird faces in the mirror?",
      options: [
        "Testing expressions",
        "Checking sanity",
        "Brain boredom",
        "NPC customization",
      ],
      answer: "NPC customization",
    },
    {
      question: "Why do we open curtains dramatically?",
      options: [
        "Main character energy",
        "Sunlight ritual",
        "Drama",
        "It feels cool",
      ],
      answer: "Main character energy",
    },
    {
      question: "Why do babies stare like they know something?",
      options: ["Wisdom", "Curiosity", "Judgment", "NPC scanning"],
      answer: "NPC scanning",
    },
    {
      question: "Why do people say 'I'm not hungry' then eat half your food?",
      options: ["Lies", "Brain glitch", "Food envy", "Human nature"],
      answer: "Human nature",
    },
    {
      question: "Why do we dance a little when getting good food?",
      options: [
        "Instinct",
        "Food happiness",
        "NPC celebration animation",
        "Vibes",
      ],
      answer: "NPC celebration animation",
    },
    {
      question: "Why do we suddenly walk faster at night?",
      options: [
        "Fear buff",
        "NPC danger mode",
        "Ghost avoidance",
        "Survival instinct",
      ],
      answer: "NPC danger mode",
    },
    {
      question: "Which sound gives immediate anxiety?",
      options: [
        "Message tone",
        "Alarm",
        "Someone typing then stopping",
        "Door knock",
      ],
      answer: "Alarm",
    },
    {
      question: "Why do we talk louder to people far away?",
      options: ["Distance logic", "Human bug", "NPC shout mode", "Reflex"],
      answer: "NPC shout mode",
    },
  ],
};

export { quizData };

export default function App() {
  return <Quiz quizData={quizData} />;
}
