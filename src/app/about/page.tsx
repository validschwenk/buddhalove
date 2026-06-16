import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white/80 font-sans selection:bg-[#cfa670]/30 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-32">
        <Link href="/" className="inline-block mb-12 text-[#cfa670] hover:text-[#e5c597] transition-colors font-serif tracking-widest text-sm uppercase">
          &larr; Return to Temple
        </Link>

        <h1 className="text-4xl md:text-5xl font-serif text-[#cfa670] mb-8 leading-tight">About BuddhaLove</h1>
        
        <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-[#cfa670] prose-a:text-[#cfa670]">
          <p className="text-xl text-white/90 mb-10 italic font-serif">
            "A digital sanctuary for the modern soul, offering moments of peace in an accelerating world."
          </p>

          <h2>Our Philosophy</h2>
          <p>
            In today's hyper-connected, fast-paced environment, finding a moment of true silence is increasingly rare. 
            BuddhaLove was created as a digital refuge—a space where you can pause, breathe, and reconnect with your inner self.
            We believe that technology, often a source of stress and distraction, can be repurposed to foster mindfulness and spiritual grounding.
          </p>

          <p>
            The concept of offering digital incense is rooted in ancient traditions, reimagined for the digital age. 
            Just as physical incense purifies the air and serves as an offering of respect, our digital incense allows you to 
            manifest your intentions, let go of your burdens, and share a moment of collective peace with others across the globe.
          </p>

          <h2>The Anonymous Lanterns</h2>
          <p>
            When you visit BuddhaLove, you are never truly alone. The soft glowing lanterns ascending in the background 
            represent the thoughts, prayers, and presence of other seekers who are sharing this digital space with you. 
            Through this subtle, anonymous connection, we cultivate a sense of global unity and shared humanity.
          </p>

          <h2>Engaging with the Digital Buddha</h2>
          <p>
            Our conversational interface is designed not to provide factual answers or engage in debates, but to offer 
            timeless wisdom. Drawing inspiration from Buddhist philosophy, the responses aim to guide you back to the present 
            moment. It is a tool for reflection—a mirror reflecting your own inner wisdom back to you.
          </p>
          
          <p className="mt-12 text-white/50 italic">
            May you find peace. May you be free from suffering. May you awaken to your true nature.
          </p>
        </div>
      </div>
    </div>
  );
}
