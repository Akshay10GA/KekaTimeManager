import Quiz from "./Quiz";

const quizData = { 
  questions: [
  {
    question: "Rahul Gandhi ne bola 'Aaloo ke machine se sona nikalega', machine ka kya reaction hoga?",
    options: ["Sone ka patent daal diya", "Aaloo ne strike kar di", "Machine bhi Pappu ban gayi", "BJP ne machine kharid li"],
    answer: "Machine bhi Pappu ban gayi"
  },
  {
    question: "Modi ji ne bola 'Cloud se chhup ke drone udayenge kyunki radar nahi pakadta', Indian Air Force pilot kya sochega?",
    options: ["Sir aap PM ho ya hacker?", "Cloud mein Wi-Fi bhi hai kya?", "Ab monsoon mein attack karenge", "GPS ko chhutti de di"],
    answer: "Sir aap PM ho ya hacker?"
  },
  {
    question: "Kejriwal ji ne bola 'Main IITian hoon, bijli free ka formula khud banaya', IIT alumni group mein kya message aaya?",
    options: ["Batchmate kaun hai ye?", "Degree wapas le lo", "Arre ye toh failed entrepreneur tha", "Free degree bhi di thi kya?"],
    answer: "Degree wapas le lo"
  },
  {
    question: "Smriti Irani ne bola 'Main HRD minister hoon aur Cambridge se padhi hoon', Cambridge University ne kya kiya?",
    options: ["Website crash", "Disclaimer daal diya", "Never heard of her tweet kiya", "Yale se jealous ho gaye"],
    answer: "Disclaimer daal diya"
  },
  {
    question: "Akhilesh Yadav ne bola 'Gujarat ke donkeys ko UP la rahe hain', donkey ne kya socha?",
    options: ["Hum toh lion se bhi tez bhagte hain", "Arre humara toh CM banne ka chance tha", "UP mein gadha raj aayega", "Cycle se tez chalenge"],
    answer: "Arre humara toh CM banne ka chance tha"
  },
  {
    question: "Kapil Sharma ne bola 'Main election nahi ladunga, hasi mazak ka kaam hai', public ne kya comment kiya?",
    options: ["Bhai tu aaja, baaki sab toh clown hain", "At least tu sach bolta hai", "Comedy se politics better hai", "Fir se tax notice aayega"],
    answer: "Bhai tu aaja, baaki sab toh clown hain"
  },
  {
    question: "Baba Ramdev ne bola 'Allopathy wale marte hain, yog se nahi marte', doctor community ne kya reply diya?",
    options: ["Baba aapka BP check kar lein", "Coronil se oxygen level badhta hai kya?", "Hum marte hain toh aapka ilaaj kaun karega?", "Next time vaccine mat lagwana"],
    answer: "Hum marte hain toh aapka ilaaj kaun karega?"
  },
  {
    question: "Kangana ne bola 'Freedom 2014 mein mili hai', 1947 wale freedom fighters ne kya kiya?",
    options: ["Bhagat Singh ne block kar diya", "Gandhi ji ne charkha tod diya", "Nehru ji rolling in grave", "Subhash Bose ne wapas aa gaye"],
    answer: "Nehru ji rolling in grave"
  },
  {
    question: "Nitish Kumar ne bola 'Main palti nahi marta', news channel ne kya headline banayi?",
    options: ["Breaking: Nitish Kumar ka jhooth detector kharab", "Aaj palti count – 9", "Bihar mein earthquake", "Palti Olympic gold"],
    answer: "Palti Olympic gold"
  },
  {
    question: "Rabri Devi ne bola 'Lalu ji jail mein bhi TV dekhte hain, unko sab pata hai', jailor ne kya note kiya?",
    options: ["TV band karo", "Ye toh remote control se sarkar chala rahe", "Chara ghotala ka sequel dekh rahe honge", "Netflix subscription jail mein?"],
    answer: "Ye toh remote control se sarkar chala rahe"
  },
  {
    question: "Tejasvi Surya ne bola 'Main 26 saal mein MP ban gaya, Rahul 50 mein bhi nahi', Rahul ne kya replay diya?",
    options: ["Quality > quantity", "Main toh hug kar sakta hoon", "Tum bhi 50 tak ruk jao", "Pappu tag remove karwa diya"],
    answer: "Main toh hug kar sakta hoon"
  },
  {
    question: "Sambit Patra ne bola 'Indira is India, India is Indira', fir realize galti ho gayi, kya damage control kiya?",
    options: ["Godi media ne mute kar diya", "Modira bol diya", "Twitter se delete", "Arre mic kharab tha"],
    answer: "Modira bol diya"
  },
  {
    question: "Hema Malini Mathura mein boli 'Main yahan paani laungi', kisan ne kya poocha?",
    options: ["Dream girl ya pipe girl?", "Yamuna mein paani kab se aaya?", "Dharmendra ji pipeline daal denge?", "Reel mein hi paani laa do"],
    answer: "Dream girl ya pipe girl?"
  },
  {
    question: "Sakshi Maharaj ne bola 'Hindu auratein 4 bache paida karein', population control bill wale ne kya socha?",
    options: ["Baba ko bill ki copy bhejo", "Ye khud kitne bache ke baap hain?", "Hindu rashtra ka family planning", "Adoption se count hoga kya?"],
    answer: "Ye khud kitne bache ke baap hain?"
  },
  {
    question: "Sunny Deol ne Gurdaspur mein bola 'Dhai kilo ka haath' aur jeet gaye, voter ne kya socha?",
    options: ["Bas haath hi kaafi tha", "Dialogue se development", "Border film ka sequel", "Pakistan darr gaya"],
    answer: "Bas haath hi kaafi tha"
  },
  {
    question: "Kejriwal ne bola 'Main aam aadmi hoon', fir 10 crore ka sheeshmahal banwaya, aam aadmi ne kya poocha?",
    options: ["Bhai ye aam ka ped kahan hai?", "Sheeshmahal mein free entry milegi?", "Hamara ghar kab banega?", "Muffler bhi imported hai kya?"],
    answer: "Bhai ye aam ka ped kahan hai?"
  },
  {
    question: "Yogi ji ne bola 'Baba ka bulldozer', bulldozer driver ne kya poocha?",
    options: ["Sir overtime milega?", "Petrol ka bill kaun bharega?", "Gunda ka ghar ya galat nirman?", "Mera bhi naam poster mein daal do"],
    answer: "Petrol ka bill kaun bharega?"
  },
  {
    question: "Shashi Tharoor ne tweet kiya 'Cattle class', fir sorry bola, gau rakshak ne kya kiya?",
    options: ["Gau raksha squad bheja", "Dictionary jala di", "Oxford se degree cancel karwaya", "Tharoor ji ko gaay ka doodh pilaya"],
    answer: "Gau raksha squad bheja"
  },
  {
    question: "Gautam Gambhir smile wale ad mein bole 'Smile please', fir opposition ko gali di, brand ne kya kiya?",
    options: ["Contract cancel", "Smile wala ad band", "Angry version launch kiya", "Free dental checkup offer"],
    answer: "Smile wala ad band"
  },
  {
    question: "Nirmala Tai ne bola 'Onion 100 rupaye kilo hai toh mat khao', onion ne kya kiya?",
    options: ["Rone lagi", "Pyaz union strike pe", "Biriyani boycott kar diya", "Lehsun jealous ho gaya"],
    answer: "Rone lagi"
  }
]
};

export { quizData };

export default function App() {
  return <Quiz quizData={quizData} />;
}
