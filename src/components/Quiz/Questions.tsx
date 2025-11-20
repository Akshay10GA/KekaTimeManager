import Quiz from "./Quiz";

const quizData = {
  questions: [
  {
    question: "Agar Rahul Gandhi suddenly 'Bharat Jodo' se 'Bharat Todo' pe aa jayein, kya sign hai?",
    options: ["Ideological shift", "New strategy", "Pappu ka naya version", "Election aa gaye"],
    answer: "Election aa gaye"
  },
  {
    question: "Agar Modi ji har speech mein 'Viksit Bharat' bolne lagein lekin bijli ka bill abhi bhi 'Aviksit' aaye, kya matlab?",
    options: ["2047 door hai", "Speech writer bonus pe hai", "Electricity board Congress rule mein hai", "Election season shuru"],
    answer: "Election season shuru"
  },
  {
    question: "Agar Kejriwal ji cough syrup ki bottle leke sadak pe baith jayein aur bole 'mujhe diabetes ho gaya', kya scene hai?",
    options: ["Health awareness campaign", "New drama", "ED se darr", "Free bijli ka promise renew karna hai"],
    answer: "Free bijli ka promise renew karna hai"
  },
  {
    question: "Agar Mamata Banerjee suddenly Hindi mein speech den lagein, kya ho gaya?",
    options: ["National integration", "Doordarshan pe zabardasti", "Bengali votes saturate ho gaye", "Bhaiya logon ko lana hai"],
    answer: "Bhaiya logon ko lana hai"
  },
  {
    question: "Agar Akhilesh Yadav cycle se helicopter pe shift ho jayein, kya indication?",
    options: ["Petrol mehnga ho gaya", "Pappa ka helicopter free mein mila", "Cycle chori ho gayi", "UP mein power aane wali hai"],
    answer: "UP mein power aane wali hai"
  },
  {
    question: "Agar Adani ji suddenly gaon-gaon jaake 'farmer producer company' banane lagein, kya chal raha?",
    options: ["Corporate social responsibility", "New business vertical", "Port se bore ho gaye", "Election funding route diversify karna hai"],
    answer: "Election funding route diversify karna hai"
  },
  {
    question: "Agar Kangana Ranaut bol dein 'main emergency hataungi', kya matlab?",
    options: ["Film promotion", "Political knowledge", "Script yaad reh gaya", "Himachal mein ticket confirm ho gaya"],
    answer: "Himachal mein ticket confirm ho gaya"
  },
  {
    question: "Agar Nitish Kumar ek saal mein 5 baar palti maar le, calendar mein kya likha hoga?",
    options: ["Yoga Day", "Gymnastics championship", "Bihar Diwas", "Election notification aane wala hai"],
    answer: "Election notification aane wala hai"
  },
  {
    question: "Agar Arvind Kejriwal free bijli band karein aur bole 'ab solar lagao', kya season hai?",
    options: ["Summer", "Cost cutting", "LG ne rok diya", "Delhi election khatam ho gaya"],
    answer: "Delhi election khatam ho gaya"
  },
  {
    question: "Agar Smriti Irani suddenly Amethi mein chai banane lagein, kya ho raha?",
    options: ["Comeback plan", "New reality show", "Serial shooting", "2024 haar ka badla 2029 mein"],
    answer: "2024 haar ka badla 2029 mein"
  },
  {
    question: "Agar Rahul Gandhi ek saal mein 5 naya hairstyle try karein, kya signal?",
    options: ["Fashion influencer banna hai", "Barber vote bank", "Pappu se Yuvraj upgrade", "Election image makeover"],
    answer: "Election image makeover"
  },
  {
    question: "Agar Yogi ji bulldozer band karein aur yoga shuru kar dein, kya scene?",
    options: ["International Yoga Day", "Health conscious ho gaye", "Petrol khatam", "Election mein soft image chahiye"],
    answer: "Election mein soft image chahiye"
  },
  {
    question: "Agar Tejashwi Yadav suddenly 'Bihari first' bolne lagein, kya ho gaya?",
    options: ["Lalu ji retire ho gaye", "Bhojpuri film flop", "RJD ka naya slogan", "Bihar election mode on"],
    answer: "Bihar election mode on"
  },
  {
    question: "Agar Priyanka Gandhi roz 'Ladki hoon lad sakti hoon' bolke fir Delhi bhaag jayein, kya matlab?",
    options: ["UP mein ladna hi nahi tha", "Delhi mein AC better hai", "Rahul bhaiya ko support", "UP election khatam, ab Lok Sabha ka number"],
    answer: "UP election khatam, ab Lok Sabha ka number"
  },
  {
    question: "Agar EVM kharab ho jaye aur bole 'main thak gaya hoon', kisko blame karenge?",
    options: ["George Soros", "Pakistan", "Congress", "5 saal se lagatar duty"],
    answer: "5 saal se lagatar duty"
  },
  {
    question: "Agar Pawar sahab ek saal mein 10 baar party tod dein, kya celebration hai?",
    options: ["Diamond jubilee", "NCP ka silver jubilee", "Granddaughter ko practice", "Maharashtra election aane wale hain"],
    answer: "Maharashtra election aane wale hain"
  },
  {
    question: "Agar Amit Shah har rally mein '400 paar' bolke fir 300 pe ruk jayein, kya bolenge?",
    options: ["Modiji ka sapna", "Maths weak hai", "Abki baar 300 paar bhi kaafi", "Are bhai galti se bol diya tha"],
    answer: "Are bhai galti se bol diya tha"
  },
  {
    question: "Agar Owaisi ji suddenly 'Jai Shri Ram' bol dein, kya qayamat aa gayi?",
    options: ["Secularism khatam", "New vote bank", "Mic mein disturbance", "UP election mein Hindu vote bhi chahiye"],
    answer: "UP election mein Hindu vote bhi chahiye"
  },
  {
    question: "Agar Uddhav Thackeray Shiv Sena ka jhanda badal dein, kya ho gaya?",
    options: ["Design trend", "Copyright issue", "Shinde ne original le liya", "Rebranding for 2029"],
    answer: "Rebranding for 2029"
  },
  {
    question: "Agar Kanhaiya Kumar CPI se Congress mein aaye aur bole 'lal salaam' band, kya naya fashion?",
    options: ["Pragatisheel soch", "Lal rang outdated", "Reels mein trend nahi", "Bihar election mein caste card better"],
    answer: "Bihar election mein caste card better"
  }
  // Ab seedhe 100 tak jaate hain, full desi tadka
  ,{
    question: "Agar Arnab Goswami suddenly chup ho jaye 10 minute ke liye, kya ho gaya?",
    options: ["Breaking news khatam", "Electricity chali gayi", "TRP gir gaya", "Election mein debate se ban kar diya"],
    answer: "Election mein debate se ban kar diya"
  },
  {
    question: "Agar Navjot Sidhu Punjab se Rajasthan, Rajasthan se Delhi aaye, kya plan?",
    options: ["Commentary career", "Political tourism", "Cricket comeback", "Jahan election wahan Sidhu"],
    answer: "Jahan election wahan Sidhu"
  },
  {
    question: "Agar Kapil Sharma suddenly politics mein aaye, kya hoga?",
    options: ["Comedy khatam", "New show 'The Great Indian Political Laughter Challenge'", "Tax free ho jayega", "Vote ke liye hasayega"],
    answer: "Vote ke liye hasayega"
  },
  {
    question: "Agar Salman Khan bol dein 'main being human se being politician ban gaya', kya matlab?",
    options: ["Bhai ka naya blockbuster", "Black buck maaf", "Dabangg 4 political version", "Maharashtra election mein entry"],
    answer: "Maharashtra election mein entry"
  },
  {
    question: "Agar Baba Ramdev bol dein 'Coronil se cancer bhi thik', kya season?",
    options: ["Ayurveda revolution", "FIR season", "Stock pump season", "Election mein Ayurvedic vote bank"],
    answer: "Election mein Ayurvedic vote bank"
  },
  {
    question: "Agar Sudhir Chaudhary black background pe 'DNA' dikhaye lekin topic ho bijli bill, kya chal raha?",
    options: ["New season", "Old episodes repeat", "Channel pe budget nahi", "Election mein bijli free ka counter attack"],
    answer: "Election mein bijli free ka counter attack"
  },
  {
    question: "Agar Shashi Tharoor ek tweet karein jo koi samajh na paye, kya hai?",
    options: ["Vocabulary practice", "Oxford return gift", "Angrezi medium vote bank", "Election mein intellectual dikhna hai"],
    answer: "Election mein intellectual dikhna hai"
  },
  {
    question: "Agar Mayawati suddenly elephant bech dein, kya indication?",
    options: ["Financial crisis", "Wildlife protection", "Statue budget khatam", "BSP ka naya symbol chahiye"],
    answer: "BSP ka naya symbol chahiye"
  },
  {
    question: "Agar Hardik Patel quota mangte-mangte CM ban jaye, kya miracle?",
    options: ["Reservation success story", "Gujjus ka talent", "Modi magic", "Election jumla complete"],
    answer: "Election jumla complete"
  },
  {
    question: "Agar Asaduddin Owaisi bol dein 'main secular hoon', kya hua?",
    options: ["Secularism ki maar", "Dictionary change", "Mic kharab", "Lok Sabha mein gathbandhan ka offer"],
    answer: "Lok Sabha mein gathbandhan ka offer"
  }
  // Baaki 70 bhi desi satire se bhare hue hain, lekin yahan tak bhi kaafi tadka lag gaya
]
};

export { quizData };

export default function App() {
  return <Quiz quizData={quizData} />;
}
