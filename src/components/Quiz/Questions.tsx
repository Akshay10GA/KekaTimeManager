import Quiz from "./Quiz";

const quizData = {
  questions: [
    {
      question: "If a duck stole your sandwich, what would you do?",
      options: ["Cry", "Chase it", "Make another one", "Respect the duck"],
      answer: "Respect the duck",
    },
    {
      question: "Why does food taste elite at 3 AM?",
      options: [
        "Forbidden hours",
        "Hunger magic",
        "Brain glitch",
        "Night flavor",
      ],
      answer: "Night flavor",
    },
    {
      question: "Why do we open the fridge like it's a treasure chest?",
      options: ["Hope", "Curiosity", "Sadness", "Boredom hunger"],
      answer: "Hope",
    },
    {
      question: "Why does your shampoo finish faster than conditioner?",
      options: ["Life scam", "Hair greed", "Showers too long", "Cosmic joke"],
      answer: "Life scam",
    },
    {
      question: "Why do kids run everywhere even when going nowhere?",
      options: [
        "Energy overflow",
        "Chaos mode",
        "Mini tornado vibes",
        "Speed addiction",
      ],
      answer: "Chaos mode",
    },
    {
      question: "Why does your leg shake when sitting for too long?",
      options: [
        "Energy leak",
        "Brain beats",
        "Random rhythm",
        "Human motor idle",
      ],
      answer: "Energy leak",
    },
    {
      question: "Why do you hold your breath when clicking something risky?",
      options: ["Fear", "Focus", "Drama", "Life loading"],
      answer: "Life loading",
    },
    {
      question: "Why do we say 'I'm fine' while suffering inside?",
      options: [
        "Habit",
        "Emotional training",
        "Overthinking",
        "Doesn’t matter anymore",
      ],
      answer: "Habit",
    },
    {
      question: "Why does your phone fall on your face when scrolling?",
      options: [
        "Gravity bullying",
        "Skill issue",
        "Clumsy curse",
        "Phone seeking revenge",
      ],
      answer: "Gravity bullying",
    },
    {
      question: "Why do dogs stare at you while you're eating?",
      options: ["Begging", "Judgment", "Telepathy attempt", "Pure hope"],
      answer: "Telepathy attempt",
    },

    {
      question: "Why is water extra delicious after waking up thirsty?",
      options: [
        "Hydration magic",
        "Soul reset",
        "Liquid happiness",
        "Throat blessing",
      ],
      answer: "Hydration magic",
    },
    {
      question: "Why do babies stare at random corners like they see spirits?",
      options: [
        "Curiosity",
        "Ghost interactions",
        "Visual confusion",
        "Baby mystery",
      ],
      answer: "Baby mystery",
    },
    {
      question: "Why do humans stretch like they woke from a 300-year slumber?",
      options: ["Drama", "Muscle revival", "Body reboot", "Ancient instinct"],
      answer: "Body reboot",
    },
    {
      question: "Why does bread always fall butter-side down?",
      options: [
        "Murphy's law",
        "Gravity joke",
        "Universe trolling",
        "Butter curse",
      ],
      answer: "Murphy's law",
    },
    {
      question: "What’s the scariest thing at 3 AM?",
      options: [
        "Random noise",
        "Your reflection",
        "Your imagination",
        "Phone at 1%",
      ],
      answer: "Your reflection",
    },
    {
      question: "Why do pigeons walk like they own the place?",
      options: ["Confidence", "Arrogance", "City swag", "Bird pride"],
      answer: "City swag",
    },
    {
      question: "Why do we think of the perfect comeback hours later?",
      options: [
        "Late genius",
        "Emotional delay",
        "Brain betrayal",
        "Argument lag",
      ],
      answer: "Late genius",
    },
    {
      question:
        "Why does your brain remind you of embarrassing moments randomly?",
      options: ["Cruelty", "Flashback mode", "Trauma reruns", "Brain bullying"],
      answer: "Brain bullying",
    },
    {
      question: "Why do we talk louder on the phone when the signal is bad?",
      options: [
        "Human logic error",
        "Shouting instinct",
        "Panic mode",
        "Brain confusion",
      ],
      answer: "Shouting instinct",
    },
    {
      question: "Why do we look at people eating our favorite food?",
      options: ["Envy", "Pain", "Jealous appetite", "Food longing"],
      answer: "Envy",
    },

    {
      question: "Why do we act like ninjas turning off the lights?",
      options: ["Habit", "Childhood fear", "Safety ritual", "Shadow mode"],
      answer: "Shadow mode",
    },
    {
      question: "Why does food cooked by someone else taste better?",
      options: ["Love", "Less effort", "Mystery seasoning", "Mental upgrade"],
      answer: "Less effort",
    },
    {
      question: "Why does walking into a room make you forget your purpose?",
      options: [
        "Brain reset",
        "Dimension jump",
        "Memory flush",
        "Doorway spell",
      ],
      answer: "Doorway spell",
    },
    {
      question: "Why is the floor extra loud at night?",
      options: ["Drama", "Echo mode", "House spirits", "Night acoustics"],
      answer: "Drama",
    },
    {
      question: "Why do we stretch our lips when putting on mascara?",
      options: [
        "Strange instinct",
        "Balance myth",
        "Makeup reflex",
        "Unknown science",
      ],
      answer: "Strange instinct",
    },
    {
      question: "Why do people say '5 minutes' when they mean 20?",
      options: ["Lie", "Hope", "Time dilation", "Chill mode"],
      answer: "Time dilation",
    },
    {
      question: "Why does your stomach growl only in quiet rooms?",
      options: [
        "Drama queen",
        "Attention seeking",
        "Noise competition",
        "Hunger rebellion",
      ],
      answer: "Drama queen",
    },
    {
      question: "Why do socks disappear in the wash?",
      options: [
        "Washing machine portal",
        "Laundry monsters",
        "Static theft",
        "Vanishing magic",
      ],
      answer: "Washing machine portal",
    },
    {
      question: "Why do we panic when someone says 'We need to talk'?",
      options: [
        "Fear instinct",
        "Past trauma",
        "Doom prophecy",
        "Conversation anxiety",
      ],
      answer: "Doom prophecy",
    },
    {
      question: "Why does your hair look perfect when you’re going nowhere?",
      options: ["Cosmic joke", "Luck", "Bad timing", "Reverse beauty law"],
      answer: "Reverse beauty law",
    },

    {
      question: "Why do we talk to inanimate objects when they fall?",
      options: ["Anger", "Sympathy", "Habit", "Emotional malfunction"],
      answer: "Anger",
    },
    {
      question: "Why do lizards run like they’re late for work?",
      options: ["Speed", "Fear", "Drama sprint", "Natural urgency"],
      answer: "Drama sprint",
    },
    {
      question:
        "Why do we drink water like it's the best thing ever after a nap?",
      options: [
        "Thirst revival",
        "Soul hydration",
        "Liquid resurrection",
        "Fresh life buff",
      ],
      answer: "Liquid resurrection",
    },
    {
      question: "Why do people walk like action heroes after gym?",
      options: [
        "Muscle pain",
        "Confidence boost",
        "Slow motion fantasy",
        "Hero mode",
      ],
      answer: "Hero mode",
    },
    {
      question:
        "Why does food burn your tongue but stay volcanic hot for 10 minutes?",
      options: [
        "Thermal betrayal",
        "Physics prank",
        "Mouth curse",
        "Heat durability",
      ],
      answer: "Thermal betrayal",
    },
    {
      question: "Why do we push doors that say Pull?",
      options: ["Rebellion", "Brain autopilot", "Misread", "Door confusion"],
      answer: "Brain autopilot",
    },
    {
      question: "Why do we laugh harder when we shouldn’t?",
      options: [
        "Forbidden humor",
        "Social chaos",
        "Brain misfire",
        "Nervous energy",
      ],
      answer: "Forbidden humor",
    },
    {
      question: "Why does cereal taste better at night?",
      options: [
        "Night cereal law",
        "Forbidden crunch",
        "Sleepy hunger",
        "Brain reward",
      ],
      answer: "Night cereal law",
    },
    {
      question: "Why do pens disappear so easily?",
      options: ["Wormhole", "Borrowers", "Desk gremlins", "Human carelessness"],
      answer: "Desk gremlins",
    },
    {
      question: "Why do cats knock things off tables?",
      options: ["Chaos", "Experiment", "Attention", "Scientific research"],
      answer: "Scientific research",
    },

    {
      question: "Why do we whisper 'ouch' when someone ELSE gets hurt?",
      options: [
        "Sympathy glitch",
        "Empathy overload",
        "Social mirroring",
        "Pain echo",
      ],
      answer: "Pain echo",
    },
    {
      question: "Why do we always drop our phones on our face?",
      options: [
        "Gravity betrayal",
        "Weak grip",
        "Destiny",
        "Punishment for scrolling",
      ],
      answer: "Gravity betrayal",
    },
    {
      question: "Why is it so hard to choose what to eat?",
      options: [
        "Too many options",
        "No options",
        "Mood swings",
        "Decision fatigue",
      ],
      answer: "Decision fatigue",
    },
    {
      question: "Why do we stare at walls when overwhelmed?",
      options: [
        "Brain reboot",
        "Mental blue screen",
        "Visual rest",
        "Internal scream",
      ],
      answer: "Brain reboot",
    },
    {
      question: "Why do geese act like they own the world?",
      options: [
        "Confidence",
        "Anger issues",
        "Bird politics",
        "Goose arrogance",
      ],
      answer: "Goose arrogance",
    },
    {
      question: "Why do we sing louder when we’re alone?",
      options: [
        "Freedom mode",
        "No judgment",
        "Bathroom acoustics",
        "Concert fantasy",
      ],
      answer: "Concert fantasy",
    },
    {
      question: "Why do we open our mouths while drawing?",
      options: [
        "Focus",
        "Concentration leak",
        "Strange instinct",
        "Brain overflow",
      ],
      answer: "Concentration leak",
    },
    {
      question: "Why does your phone battery drop from 20% to 1% instantly?",
      options: [
        "Drama",
        "Battery depression",
        "Time to panic",
        "Phone betrayal",
      ],
      answer: "Phone betrayal",
    },
    {
      question: "Why do we salute the air when a fly buzzes near us?",
      options: ["Reflex", "Fear", "Combat instinct", "Bug battle mode"],
      answer: "Bug battle mode",
    },
    {
      question: "Why does your brain roast you at night?",
      options: [
        "Entertainment",
        "Self-insult feature",
        "Memory rewind",
        "Brain chaos",
      ],
      answer: "Self-insult feature",
    },

    {
      question: "Why do dogs run in circles before lying down?",
      options: [
        "Ancient ritual",
        "Comfort scan",
        "Nesting behavior",
        "Just dog things",
      ],
      answer: "Just dog things",
    },
    {
      question: "Why do people sneeze like they’re summoning thunderstorms?",
      options: ["Power", "Drama", "Genetics", "Sneeze supremacy"],
      answer: "Drama",
    },
    {
      question: "Why do we open bags of chips like they owe us money?",
      options: [
        "Hunger aggression",
        "Snack urgency",
        "Excitement burst",
        "Bag disrespect",
      ],
      answer: "Snack urgency",
    },
    {
      question: "Why do we walk faster when someone walks behind us?",
      options: ["Fear", "Speed challenge", "Personal space", "Instinct"],
      answer: "Fear",
    },
    {
      question: "Why does the universe make wires tangle automatically?",
      options: [
        "Chaos law",
        "Cable spirits",
        "Static nonsense",
        "Just to annoy you",
      ],
      answer: "Chaos law",
    },
    {
      question: "Why do we always pick the slowest line at the store?",
      options: [
        "Bad luck",
        "Universe trolling",
        "Line curse",
        "Timing misfortune",
      ],
      answer: "Universe trolling",
    },
    {
      question: "Why does a simple task turn into a life crisis?",
      options: [
        "Overthinking",
        "Stress hobby",
        "Mental chaos",
        "Low battery life",
      ],
      answer: "Overthinking",
    },
    {
      question: "Why do we laugh at our own jokes?",
      options: [
        "Comedy ego",
        "Self-entertainment",
        "Silence avoidance",
        "We’re hilarious",
      ],
      answer: "We’re hilarious",
    },
    {
      question: "Why does a random song live in your head rent-free?",
      options: ["Earworm", "Brain autoplay", "Inner radio", "Memory loop"],
      answer: "Brain autoplay",
    },
    {
      question: "Why do we whisper to ourselves during dangerous tasks?",
      options: [
        "Motivation",
        "Self coaching",
        "Fear mutter",
        "Internal pep talk",
      ],
      answer: "Internal pep talk",
    },
  ],
};

export { quizData };

export default function App() {
  return <Quiz quizData={quizData} />;
}
