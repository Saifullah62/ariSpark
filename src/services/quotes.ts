interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  {
    text: "Your future is worth the work. Take that nap later - for now, keep pushing!",
    author: "Michelle Obama"
  },
  {
    text: "Sometimes it's okay if the only thing you did today was breathe.",
    author: "Yumi Sakugawa"
  },
  {
    text: "Self care isn't selfish. You can't pour from an empty cup.",
    author: "Life Reminder"
  },
  {
    text: "Stress, anxiety, and depression are caused when we are living to please others.",
    author: "Paulo Coelho"
  },
  {
    text: "You don't have to have it all figured out to move forward.",
    author: "Unknown"
  },
  {
    text: "Reminder: You've survived 100% of your worst days.",
    author: "Life Truth"
  },
  {
    text: "Your grades don't define your worth.",
    author: "Mental Health Reminder"
  },
  {
    text: "It's okay to be a work in progress.",
    author: "Self Care Note"
  },
  {
    text: "You are allowed to be both a masterpiece and a work in progress simultaneously.",
    author: "Sophia Bush"
  },
  {
    text: "Take a deep breath. You're doing better than you think.",
    author: "Self Love Reminder"
  },
  {
    text: "Don't compare your chapter 1 to someone else's chapter 20.",
    author: "Growth Journey"
  },
  {
    text: "Your mental health is more important than your grades.",
    author: "Wellness Truth"
  },
  {
    text: "Plot twist: You're not behind. You're exactly where you need to be.",
    author: "Life Perspective"
  },
  {
    text: "It's okay to take breaks. Productivity isn't your worth.",
    author: "Mental Health Note"
  },
  {
    text: "Dear Past, thank you for the lessons. Dear Future, I'm ready.",
    author: "Personal Growth"
  },
  {
    text: "You're not alone in feeling overwhelmed. We're all figuring it out together.",
    author: "College Life Truth"
  },
  {
    text: "Your path doesn't have to look like anyone else's.",
    author: "Journey Reminder"
  },
  {
    text: "Progress > Perfection",
    author: "Growth Mindset"
  },
  {
    text: "You can do hard things, but you don't have to do them all at once.",
    author: "Pace Yourself"
  },
  {
    text: "Sometimes the bravest thing you can do is rest.",
    author: "Self Care Wisdom"
  },
  {
    text: "Not me stressing about tomorrow's exam while scrolling TikTok for 3 hours 🤪",
    author: "College Girl Reality"
  },
  {
    text: "Normalize changing your major because the first one wasn't serving your joy.",
    author: "College Wisdom"
  },
  {
    text: "That awkward moment when your screen time report is higher than your GPA.",
    author: "Student Life"
  },
  {
    text: "POV: It's 3 AM and you're questioning all your life choices while writing that paper.",
    author: "College Mood"
  },
  {
    text: "Remember when we thought high school was hard? Cute.",
    author: "College Throwback"
  },
  {
    text: "Living off iced coffee and pure determination.",
    author: "Student Energy"
  },
  {
    text: "My bed 🤝 My assignments... Both calling my name 24/7",
    author: "Student Struggles"
  },
  {
    text: "Friendly reminder that C's get degrees! 💅",
    author: "Grade Reality"
  },
  {
    text: "Me telling myself I'll start that assignment early this time 🤡",
    author: "Procrastination Queen"
  },
  {
    text: "Your worth isn't measured by your productivity or your GPA.",
    author: "Mental Health Check"
  },
  {
    text: "Bestie, you're doing amazing! Keep showing up for yourself.",
    author: "Friend Reminder"
  },
  {
    text: "When in doubt, take a shower, put on a face mask, and pretend everything's fine.",
    author: "Self Care 101"
  },
  {
    text: "It's giving... main character energy ✨",
    author: "Confidence Boost"
  },
  {
    text: "This season of life is temporary, but your mental health is forever.",
    author: "Wellness Check"
  },
  {
    text: "Romanticize your study sessions. You're that girl. 📚✨",
    author: "Study Motivation"
  },
  {
    text: "Your anxiety is lying to you. You've got this!",
    author: "Mental Health Truth"
  },
  {
    text: "Reminder: You're not behind in life, you're just on your own timeline.",
    author: "Life Path"
  },
  {
    text: "Bad grades? In this economy? It's not you, it's capitalism.",
    author: "Modern Student"
  },
  {
    text: "Plot twist: The main character was you all along. ✨",
    author: "Self Love"
  },
  {
    text: "Girlies, it's okay to not have it all together. We're all pretending anyway.",
    author: "Real Talk"
  },
  {
    text: "Your professor 📧 You 🧑‍🦯",
    author: "Email Anxiety"
  },
  {
    text: "Hey kiddo, just checking in. Did you eat today? Love you! ❤️",
    author: "Dad"
  },
  {
    text: "Remember: you can always come home. Your room is exactly how you left it.",
    author: "Dad"
  },
  {
    text: "Don't forget - you're still my little girl, even if you're conquering college now.",
    author: "Dad"
  },
  {
    text: "Need money for groceries? Just don't tell your mother I sent it. 🤫",
    author: "Dad"
  },
  {
    text: "I know it's tough right now, but you've got this. You're stronger than you think - just like your old man. 💪",
    author: "Dad"
  },
  {
    text: "Hi honey, just wanted to say I'm proud of you. No reason. Just am.",
    author: "Dad"
  },
  {
    text: "Your dad joke of the day: What did the coffee report card say? 'Needs to take a break!' 😂",
    author: "Dad"
  },
  {
    text: "Remember to lock your dorm door! And maybe FaceTime your dad once in a while? 🥺",
    author: "Dad"
  },
  {
    text: "Don't worry about the B-. You're still A+ in my book.",
    author: "Dad"
  },
  {
    text: "Weather looks cold there. Did you remember to pack that jacket I bought you?",
    author: "Dad"
  },
  {
    text: "Just saw someone wearing your university's sweater. Told them all about my daughter, the future graduate! 🎓",
    author: "Dad"
  },
  {
    text: "Missing you lots. The dog keeps sitting in your room. (Me too, but don't tell anyone)",
    author: "Dad"
  },
  {
    text: "How's my favorite college student? Besides hungry and tired? 😊",
    author: "Dad"
  },
  {
    text: "Your car probably needs an oil change. Call me when you're free, I'll walk you through it.",
    author: "Dad"
  },
  {
    text: "Found your old science fair trophy while cleaning. Still my little Einstein! 🤓",
    author: "Dad"
  },
  {
    text: "Remember: if plan A doesn't work, the alphabet has 25 more letters.",
    author: "Dad"
  },
  {
    text: "Dad's weekend checklist for you: 1. Eat vegetables 2. Get sleep 3. Be awesome ✅",
    author: "Dad"
  },
  {
    text: "You'll always be my baby girl, even when you're running the world with that degree.",
    author: "Dad"
  },
  {
    text: "Want me to have a 'talk' with that professor? Just kidding... unless? 😤",
    author: "Dad"
  }
];

export const quotesService = {
  getRandomQuote: (): Quote => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  },

  getDailyQuote: (): Quote => {
    // Use the current date to get a consistent quote for the day
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % quotes.length;
    return quotes[index];
  }
};
