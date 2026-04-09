# RecruiterAI 🤖✨

**Revolutionizing the hiring process with AI-powered interactive interviews.**

RecruiterAI is a cutting-edge platform designed to streamline the recruitment process. By leveraging advanced AI avatars and real-time voice processing, it conducts autonomous, conversational interviews with candidates, providing user with instant feedback and detailed analytics of the interview which will help them prepare for there interviews.

![Project Banner](https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop).

## 🚀 Key Features

-   **🤖 Interactive AI Avatars**: Lifelike interviewers powered by **HeyGen** and **Simli** that engage candidates in natural conversation.
-   **🎙️ Real-Time Voice Interaction**: Seamless, low-latency voice conversations using **Vapi** for a human-like interview experience.
-   **📝 Automated Feedback**: Instant analysis of candidate responses, providing scores and insights to help recruiters make faster decisions.
-   **🛠️ Recruiter Dashboard**: A comprehensive dashboard to create interview templates, manage candidates, and review performance.
-   **🔐 Secure & Scalable**: Built with **Supabase** for robust authentication and database management.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
-   **Database & Auth**: [Supabase](https://supabase.com/)
-   **AI & Avatars**:
    -   [HeyGen](https://www.heygen.com/) (Streaming Avatars)
    -   [Simli](https://www.simli.com/) (Visual Avatars)
    -   [Vapi](https://vapi.ai/) (Voice AI)
    -   [OpenAI](https://openai.com/) (LLM Intelligence)
-   **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   Node.js (v18 or higher)
-   npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/CoderFlux666/AT-Interviewer-Analyser.git
    cd RecruiterAI-main
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your API keys:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NEXT_PUBLIC_INTERVIEW_API_KEY=your_api_key
    # Add other necessary keys for HeyGen, Vapi, etc.
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
#
