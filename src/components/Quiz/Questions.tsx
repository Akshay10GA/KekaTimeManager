import Quiz from "./Quiz";

const quizData = {
  questions: [
    {
    question: "Agar election season me sabko sudden pyaar aa jaye, kya sign hai?",
    options: ["Unity", "New era", "Camera nearby", "Vote magnet mode"],
    answer: "Vote magnet mode",
  },
  {
    question: "Agar kisi ne bola ‘country ka vision’, kya expect kare?",
    options: ["Blueprint", "Charts", "PowerPoint", "Fancy words with zero context"],
    answer: "Fancy words with zero context",
  },
  {
    question: "Agar politician bole ‘youth humari shakti hai’, kya matlab?",
    options: ["Jobs milenge", "Skill training", "Workshops", "Reels banwate rahoge"],
    answer: "Reels banwate rahoge",
  },
  {
    question: "Agar neta rally me ‘dosti’ bole, kaun dosto?",
    options: ["Public", "Voter base", "Cadre", "Camera crew"],
    answer: "Camera crew",
  },
  {
    question: "Agar koi bole ‘aapka paisa safe hai’, kitna safe?",
    options: ["100%", "80%", "50%", "Haathi ke daant safe"],
    answer: "Haathi ke daant safe",
  },
  {
    question: "Agar press conference me water bottle bhi scripted lagti hai, kya hoga?",
    options: ["Overthinking", "Meta politics", "PR level 9000", "Election aa raha"],
    answer: "PR level 9000",
  },
  {
    question: "Agar promises 10 ho aur delivery 1, kya kehte hain?",
    options: ["Compromise", "Economic constraints", "Political science", "Normal Tuesday"],
    answer: "Normal Tuesday",
  },
  {
    question: "Aajkal ka policy announcement kya hota?",
    options: ["Actual policy", "Old wine new bottle", "Word salad", "Video montage"],
    answer: "Old wine new bottle",
  },
  {
    question: "Agar koi neta suddenly temple visit kare, kya signal?",
    options: ["Faith", "Peace", "Tourism", "Election geography"],
    answer: "Election geography",
  },
  {
    question: "Agar public issue trending ho jaye, govt kya karti?",
    options: ["Meeting", "Press release", "Blueprint", "Suddenly WiFi slow ho jata"],
    answer: "Press release",
  },
  {
    question: "Agar koi bole 'desh ka bhavishya', kis bhavishya ki baat?",
    options: ["Tech", "Youth", "Development", "Election cycle"],
    answer: "Election cycle",
  },
  {
    question: "India me investigation ka real timeline?",
    options: ["3 din", "1 mahina", "1 saal", "Next sarkar"],
    answer: "Next sarkar",
  },
  {
    question: "Agar manifesto me sab kuch free ho, kaun free nahi?",
    options: ["Electricity", "Water", "Fuel", "Aapki expectations"],
    answer: "Aapki expectations",
  },
  {
    question: "Agar politician bole 'hamari priority clear hai', kya clear?",
    options: ["Public welfare", "Economy", "Infrastructure", "Media optics"],
    answer: "Media optics",
  },
  {
    question: "Agar koi neta bole 'transparency', kaun transparent?",
    options: ["Data", "Policy", "Meetings", "Dekho mat bass"],
    answer: "Dekho mat bass",
  },
  {
    question: "Aajkal national issue kis se decide hota?",
    options: ["Debate", "Research", "Expert panel", "Trending hashtags"],
    answer: "Trending hashtags",
  },
  {
    question: "Agar opposition bole 'ye galat hai', ruling party kya bolti?",
    options: ["Theek hai", "Nahi", "Bhool jao", "Tum galat ho"],
    answer: "Tum galat ho",
  },
  {
    question: "Agar ruling party bole 'ye sahi hai', opposition kya bolegi?",
    options: ["Correct", "Dekhte hain", "Maybe", "Bilkul nahi"],
    answer: "Bilkul nahi",
  },
  {
    question: "Agar politician crying emoji use kare, kya ho raha?",
    options: ["Genuine emotion", "Drama", "Engagement strategy", "PR intern bored"],
    answer: "Engagement strategy",
  },
  {
    question: "Agar koi minister inauguration ke liye ribbon cut kare, kya banega?",
    options: ["New era", "Development", "Hope", "Photo for next 5 saal"],
    answer: "Photo for next 5 saal",
  },
  {
    question: "Agar koi scheme 'yojana' ban jaye, to kya hoga?",
    options: ["Relief", "Funding", "Action", "Forms ki baarish"],
    answer: "Forms ki baarish",
  },
  {
    question: "Agar youth protest kare, kya response milega?",
    options: ["Dialogue", "Support", "Discussion", "Tum log free ho kya"],
    answer: "Tum log free ho kya",
  },
  {
    question: "Agar politician bole 'humne sun liya', kya hua?",
    options: ["Action", "Meeting", "Noted", "Mute unmute moment"],
    answer: "Noted",
  },
  {
    question: "Agar budget me middle class ka naam aaye, kya hota?",
    options: ["Relief", "Tax cut", "New scheme", "Bas naam hi aata"],
    answer: "Bas naam hi aata",
  },
  {
    question: "Aajkal public debate ka base kya hai?",
    options: ["Facts", "Reports", "Logic", "WhatsApp forwards"],
    answer: "WhatsApp forwards",
  },
  {
    question: "Agar politician clip viral ho jaye, kya result?",
    options: ["Embarrassment", "Clarification", "PR damage", "Next speech aur loud"],
    answer: "Next speech aur loud",
  },
  {
    question: "Agar politician carcade 40 gaadiyon ka ho, kya message?",
    options: ["Security", "Power", "Protocol", "Fuel ka budget ud gaya"],
    answer: "Power",
  },
  {
    question: "Agar kabhi sab neta ek hi baat bole, kya ho raha?",
    options: ["Consensus", "Peace", "Miracle", "PR sync achieved"],
    answer: "PR sync achieved",
  },
  {
    question: "Agar koi news anchor chill bol de, kya ho raha?",
    options: ["Balanced journalism", "Calm day", "Rare moment", "Studio ka AC kharab"],
    answer: "Rare moment",
  },
  {
    question: "Agar government report leaked ho jaye, kaun shock hota?",
    options: ["Public", "Opposition", "Media", "Koi nahi shock hota"],
    answer: "Koi nahi shock hota",
  },
  {
    question: "Agar neta speech me Hindi + English + Sanskrit mix kare, kya signal?",
    options: ["Culture rich", "Educated", "Confused", "Testing crowd IQ"],
    answer: "Testing crowd IQ",
  },
  {
    question: "Agar politician nayi app launch kare, kya hoga?",
    options: ["Tech revolution", "Digital India", "New platform", "Login error"],
    answer: "Login error",
  },
  {
    question: "Agar koi highway ka inauguration teen baar ho jaye, kya matlab?",
    options: ["Testing", "Upgrades", "New lanes", "Photo gallery banana hai"],
    answer: "Photo gallery banana hai",
  },
  {
    question: "Agar election ke baad sab promises gayab, ye kya effect?",
    options: ["Economic pressure", "Planning gap", "Execution issue", "Memory loss"],
    answer: "Memory loss",
  },
  {
    question: "Aajkal politician ka favourite sport kya hai?",
    options: ["Football", "Cricket", "Badminton", "Blame passing"],
    answer: "Blame passing",
  },
  {
    question: "Agar koi bole ‘hamari government digital hai’, kya feature?",
    options: ["E-governance", "Online services", "Faster systems", "Down server"],
    answer: "Down server",
  },
  {
    question: "Agar neta selfie leke bole ‘ground reality check’, kya ground?",
    options: ["People", "Development", "Fields", "Selfie camera lens hi ground"],
    answer: "Selfie camera lens hi ground",
  },
  {
    question: "Agar 2 politicians ek dusre ko compliment kar de, kya hua?",
    options: ["Respect", "Decency", "New vibe", "Matrix glitch"],
    answer: "Matrix glitch",
  },
  {
    question: "Agar rally me crowd kam ho, kya solution?",
    options: ["Improve message", "Better planning", "More outreach", "Camera zoom 200 percent"],
    answer: "Camera zoom 200 percent",
  },
  {
    question: "Agar politician ka ‘foreign trip’ ho, kya output?",
    options: ["Deals", "Partnerships", "Press coverage", "Airport photo album"],
    answer: "Airport photo album",
  },
  {
    question: "Agar koi bole ‘hamari priority farmers hai’, kaun believe karta?",
    options: ["Farmers", "Public", "Experts", "Comment section"],
    answer: "Comment section",
  },
  {
    question: "Aajkal ka modern scam alert kya hota?",
    options: ["Emails", "Messages", "Missed calls", "Free scheme ka form"],
    answer: "Free scheme ka form",
  },
  {
    question: "Agar news anchor chillake bole ‘BIG BREAKING’, kya big?",
    options: ["Policy shift", "Major event", "Country issue", "Traffic update only"],
    answer: "Traffic update only",
  },
  {
    question: "Agar politician bole ‘hum sab ek hain’, kya moment?",
    options: ["Unity", "Hope", "Brotherhood", "Election alignment"],
    answer: "Election alignment",
  },
  {
    question: "Agar koi minister Twitter bio change kare, kya sign?",
    options: ["New role", "New start", "Personal choice", "Storm incoming"],
    answer: "Storm incoming",
  },
  {
    question: "Agar politician interview me 'hmm' bole, kya matlab?",
    options: ["Thinking", "Agreeing", "Processing", "Avoiding the question entirely"],
    answer: "Avoiding the question entirely",
  },
  {
    question: "Agar koi political party bole ‘hum youth first’, kya first?",
    options: ["Jobs", "Skills", "Opportunities", "Reel challenge"],
    answer: "Reel challenge",
  },
  {
    question: "Agar koi hoarding 200 foot ka ho, kya message clear?",
    options: ["Development", "Growth", "Achievements", "Vote warna flex aur bada hoga"],
    answer: "Vote warna flex aur bada hoga",
  },
  {
    question: "Agar politician road pe bike chalaye bina helmet, kya hoga?",
    options: ["Fine", "Lecture", "Awareness", "Camera angle perfect"],
    answer: "Camera angle perfect",
  },
  {
    question: "Agar election ka date aa jaye, kya atmosphere?",
    options: ["Excitement", "Tension", "Hope", "Free gifts ka ecosystem"],
    answer: "Free gifts ka ecosystem",
  },
  {
    question: "Agar neta airport me bina reason hand wave kare, kisko?",
    options: ["Public", "Supporters", "Security", "Camera hi kaafi hai"],
    answer: "Camera hi kaafi hai",
  },
  {
    question: "Agar politician suddenly sad quotes daale, kya hua?",
    options: ["Emotional", "Reflective", "Overworked", "Intern ka breakup"],
    answer: "Intern ka breakup",
  },
  {
    question: "Agar koi scheme ka naam 12 words ka ho, kya sign?",
    options: ["Comprehensive", "Detailed", "Impactful", "Confusion hi goal hai"],
    answer: "Confusion hi goal hai",
  },
  {
    question: "Agar kisi neta ko youth slang na samajh aaye, kya karta?",
    options: ["Ask", "Learn", "Ignore", "Bol de 'ye hamari sanskritik virasat nahi’"],
    answer: "Bol de 'ye hamari sanskritik virasat nahi’",
  },
  {
    question: "Agar campaign me drone camera ho, kya zarurat?",
    options: ["Coverage", "Aerial visuals", "Innovation", "Crowd ka size badha ke dikhana"],
    answer: "Crowd ka size badha ke dikhana",
  },
  {
    question: "Agar politician bole ‘hamne record tod diya’, kya record?",
    options: ["Policy", "Development", "Progress", "Speech duration"],
    answer: "Speech duration",
  },
  {
    question: "Agar ruling party ka spokesperson bole ‘ye narrative hai’, kya hota?",
    options: ["Analysis", "Debate", "Logic", "Blame cloud"],
    answer: "Blame cloud",
  },
  {
    question: "Agar politician ne 4 baar same bridge inaugurate kiya, kya milega?",
    options: ["Better transport", "More connectivity", "Growth", "Bridge influencer badge"],
    answer: "Bridge influencer badge",
  },
  {
    question: "Agar news anchor table pe thalle bajaye, kya ho raha?",
    options: ["Anger", "Passion", "Energy", "TRP ka booster shot"],
    answer: "TRP ka booster shot",
  },
  {
    question: "Agar koi neta youth summit me aaye, kya kare?",
    options: ["Talk about youth", "Discuss issues", "Solution de", "90s ki kahani sunaye"],
    answer: "90s ki kahani sunaye",
  },
  {
    question: "Agar election ke baad sab silent ho jaye, kya hua?",
    options: ["Peace", "Relief", "Work started", "Naye narrative ki search"],
    answer: "Naye narrative ki search",
  },
  {
    question: "Agar politician bicycle ride kare rally me, kya message?",
    options: ["Eco friendly", "Fitness", "Support", "Car peeche hi chal rahi hoti"],
    answer: "Car peeche hi chal rahi hoti",
  },
  {
    question: "Agar kisi neta ka mic baar baar band ho, kya implication?",
    options: ["Technical issue", "Setup problem", "Sound check fail", "Universe bhi thak gaya"],
    answer: "Universe bhi thak gaya",
  },
  {
    question: "Agar koi bole ‘public ne faisla de diya’, kaun si public?",
    options: ["Online", "Offline", "Youth", "Comment section ke 12 log"],
    answer: "Comment section ke 12 log",
  },
  {
    question: "Agar politician suddenly history yaad kare, kya phase?",
    options: ["Reflection", "Education", "Depth", "Debate me point khatam ho gaye"],
    answer: "Debate me point khatam ho gaye",
  },
  {
    question: "Agar koi party bole ‘hum clean politics karte’, kya clean?",
    options: ["Intentions", "Finances", "Ideology", "Google Drive ka trash"],
    answer: "Google Drive ka trash",
  },
  {
    question: "Agar ek leader speech me 40 baar ‘mitron’ bole, kya mood?",
    options: ["Friendly", "Soft", "Calm", "Punchline warmup"],
    answer: "Punchline warmup",
  },
  {
    question: "Agar politician ko meme banaya jaye, kya reaction?",
    options: ["Ignored", "Legal notice", "Laugh", "Community guidelines violation"],
    answer: "Legal notice",
  },
  {
    question: "Agar politician ki car ko traffic rukvaya jaye, kya hoga?",
    options: ["Normal", "Routine", "Respect", "Breaking news for 4 hours"],
    answer: "Breaking news for 4 hours",
  },
  {
    question: "Agar koi budget speech 3 ghante chale, kya deliver hua?",
    options: ["Growth", "Plan", "Hope", "Back pain + tax confusion"],
    answer: "Back pain + tax confusion",
  },
  {
    question: "Agar neta youth ko bole 'focus on goals', kaunse goals?",
    options: ["Career", "Skills", "Future", "Unka next election"],
    answer: "Unka next election",
  }
  ],
};

export { quizData };

export default function App() {
  return <Quiz quizData={quizData} />;
}
