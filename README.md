# CloudPrep Pro: The All-in-One AZ-900 Toolkit ☁️🔥

![CloudPrep Pro Preview](<img width="959" height="446" alt="image" src="https://github.com/user-attachments/assets/037a3289-75d1-4bd0-9a22-3cd612466c39" />) <!-- You can replace this with a screenshot later -->

**Live Demo:** [CloudPrep Pro on Lovable](https://cloudprep-pro.lovable.app)

Built for the **Vibe Coding Hackathon: AZ-900 Exam Prep Edition** (#1MillionDevs 2026).

## 🎯 The Problem (Target Users & Understanding)
Through my experience in the PLP bootcamp and as a tech community leader at KCA University, I noticed a recurring problem: students cram for the AZ-900 by memorizing answers without understanding the "Why". Cloud concepts feel abstract and disconnected from our daily lives.

**CloudPrep Pro** solves this by combining 5 tools into one:
1. **Readiness Tracker:** Dynamically tracks progress across the 3 core AZ-900 pillars.
2. **Smart Quiz Builder:** 30 questions with immediate, detailed "Why?" explanations.
3. **Flashcard Coach:** Spaced-repetition learning for core terminology.
4. **Study Planner:** Generates a custom weekly schedule based on the user's exam date.
5. **AI Study Buddy:** Explains abstract cloud concepts using **relatable African analogies** (e.g., CapEx/OpEx = Buying a Matatu vs. using a ride-hailing app).

## 🧠 Prompt Engineering Strategy
To build a massive 5-in-1 app rapidly, I utilized **"God-Tier Mega-Prompts"** in Lovable. 
* **Data-Seed Injection:** Instead of relying on the AI to randomly generate questions, I injected a heavily structured JSON array of 8 highly accurate questions into the initial prompt, and instructed the AI to use that exact schema to auto-generate the remaining 22 questions directly in the code.
* **Logic Constraints:** I explicitly prompted the AI to use `localStorage` for state management, enforcing a 70/30 weighted math system (Quiz vs. Flashcards) to accurately update the Readiness Tracker.
* **Vibe Constraints:** I enforced strict UI boundaries (glassmorphism, neon accents, dark mode) and localized tone ("Nairobi Hype" notifications like *Moto kabisa!*) in a single layout prompt without breaking the underlying React logic.

## 🛠️ Technical Creativity & UX
* **Spaced Repetition Math:** Flashcards dynamically sort based on "Hard" (reappears in 2 cards), "Good" (6 cards), and "Easy" (sent to back).
* **Gamification:** Integrated Confetti explosions for 80%+ quiz scores and built-in Pomodoro focus timers.
* **Scalable Architecture:** Designed with a "Certification Switcher" in mind. While currently focused on AZ-900, the architecture is ready to easily adapt to AWS CLF-C02 and AI-900 (as shown in the UI).

## 🚀 How to Run Locally
1. Clone the repo: `git clone https://github.com/Rehema-Muchai/cloudprep-pro.git`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

---
*Built with React, Tailwind CSS, Lucide Icons, and Lovable. Let the vibes guide your code!*
