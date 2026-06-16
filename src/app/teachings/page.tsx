import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buddhist Teachings: Ancient Wisdom for Modern Life | BuddhaLove',
  description: 'Explore the core teachings of Buddhism — the Four Noble Truths, the Eightfold Path, impermanence, mindfulness, and compassion — and how they apply to everyday modern life.',
};

const teachings = [
  {
    id: 'four-noble-truths',
    title: 'The Four Noble Truths',
    pali: 'Cattāri Ariyasaccāni',
    body: [
      `The Four Noble Truths form the very foundation of Buddhist philosophy. The Buddha taught these truths in his very first sermon after his enlightenment, and they remain the cornerstone of all Buddhist traditions, from Theravāda to Zen to Tibetan Buddhism.`,
      `The First Noble Truth — Dukkha — is often translated as "suffering," but this word captures only part of its meaning. Dukkha encompasses the full range of human dissatisfaction: the obvious pains of illness, aging, and death, but also the subtler ache of impermanence, of things never quite being enough, of the self always wanting more.`,
      `The Second Noble Truth — Samudāya — identifies the origin of this suffering: craving and attachment. We suffer not because the world is cruel, but because we cling to pleasures, resist pain, and desperately grasp at a sense of self that is ultimately fluid and changeable.`,
      `The Third Noble Truth — Nirodha — is the most hopeful: the cessation of suffering is possible. When craving falls away, when we stop fighting with reality as it is, peace naturally arises. This is not a distant spiritual achievement but a possibility available in each moment of genuine acceptance.`,
      `The Fourth Noble Truth — Magga — is the path that leads to the end of suffering: the Noble Eightfold Path. Buddhism is not a philosophy of resignation; it is a practical roadmap for transformation.`,
    ],
  },
  {
    id: 'eightfold-path',
    title: 'The Noble Eightfold Path',
    pali: 'Ariya Aṭṭhaṅgika Magga',
    body: [
      `The Noble Eightfold Path is Buddhism's practical guide to living well. It is divided into three categories: Wisdom (Right View, Right Intention), Ethics (Right Speech, Right Action, Right Livelihood), and Mental Cultivation (Right Effort, Right Mindfulness, Right Concentration).`,
      `Right View means understanding the nature of reality — recognizing impermanence, seeing how suffering arises from craving, and understanding that actions have consequences. It is not a rigid ideology but a clear-eyed way of seeing things as they actually are.`,
      `Right Speech, Right Action, and Right Livelihood guide us in living with integrity. Our words can heal or wound; our actions can liberate or entangle; our work can contribute to well-being or cause harm. Buddhism invites us to examine all of these honestly.`,
      `Right Mindfulness — perhaps the most widely recognized element in modern times — is the practice of present-moment awareness. By simply observing our thoughts, feelings, and sensations without judgment, we create a space of clarity in which suffering loses its grip and wisdom can arise naturally.`,
    ],
  },
  {
    id: 'impermanence',
    title: 'Impermanence',
    pali: 'Anicca',
    body: [
      `"All conditioned things are impermanent." This teaching is central to Buddhism, and yet it is the one we most resist. We build our lives around the assumption of permanence — permanent relationships, permanent identities, permanent achievements — and then suffer profoundly when reality refuses to cooperate.`,
      `Anicca teaches that every experience, every emotion, every relationship, every version of ourselves is constantly changing. What felt like solid ground is actually a flowing river. This is not cause for despair, but for profound freedom. If everything passes, then nothing has the power to permanently harm us. Grief will ease. Joy will visit again. Even the most overwhelming moment is, by nature, transient.`,
      `Modern psychology has confirmed what Buddhist teachers have known for 2,500 years: our suffering is often prolonged not by the painful event itself, but by our resistance to it. When we can acknowledge impermanence and stop fighting the natural flow of change, we discover a remarkable resilience within ourselves.`,
    ],
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness',
    pali: 'Sati',
    body: [
      `Sati — mindfulness — is often described simply as "paying attention." But this understates it considerably. True mindfulness is a quality of awareness that is simultaneously alert and relaxed, engaged and equanimous. It is the capacity to be fully present with whatever is happening, without adding a layer of judgment, commentary, or resistance.`,
      `In Buddhist practice, mindfulness is applied to four foundations: the body (physical sensations, breath, posture), feelings (the basic tone of pleasant, unpleasant, or neutral), mind states (recognizing emotions and mental patterns as they arise), and phenomena (the arising and passing of all experience).`,
      `For the modern practitioner, mindfulness begins with something as simple as one conscious breath. When you notice you have been lost in thought and gently return your attention to the present moment, that is mindfulness in action. Each such moment of returning is not a failure recovered from — it is the practice itself.`,
      `Research in neuroscience has shown that sustained mindfulness practice literally changes the structure of the brain, strengthening areas associated with attention, emotional regulation, and compassion while reducing activity in areas associated with anxiety and reactivity.`,
    ],
  },
  {
    id: 'compassion',
    title: 'Compassion & Loving-Kindness',
    pali: 'Karuṇā & Mettā',
    body: [
      `Buddhism recognizes that our own suffering and the suffering of others are not separate problems. Karuṇā — compassion — is the wish for all beings to be free from suffering. Mettā — loving-kindness — is the wish for all beings to be happy. Together, they dissolve the illusion of separation that underlies so much human cruelty and indifference.`,
      `The traditional Mettā practice begins with yourself: "May I be happy. May I be healthy. May I be safe. May I live with ease." This is not selfishness — it is recognizing that we cannot pour from an empty cup. From a ground of genuine self-compassion, kindness toward others flows naturally rather than being forced.`,
      `Buddhist compassion is not pity, which maintains a distance between the giver and receiver. It is an empathetic resonance — a recognition that the person before you, however difficult, wants to be happy and fears suffering, exactly as you do. This recognition is the beginning of genuine connection and the end of loneliness.`,
    ],
  },
  {
    id: 'middle-way',
    title: 'The Middle Way',
    pali: 'Majjhimā Paṭipadā',
    body: [
      `Before his enlightenment, the Buddha spent years as a prince in extreme luxury, and then years as an ascetic in extreme deprivation. His great insight was that neither extreme led to liberation. The Middle Way — the path between self-indulgence and self-mortification — became the guiding principle of his teaching.`,
      `The Middle Way extends beyond physical lifestyle into how we relate to all of life's experiences. It suggests that we neither cling to pleasant experiences nor violently push away unpleasant ones. Instead, we can be fully present with experience as it is — engaged but not grasping, open but not passive.`,
      `In a culture of extremes — extreme consumption, extreme productivity, extreme stimulation — the Middle Way offers something radical: sufficiency. The recognition that there is a quality of being that is neither restless grasping nor numb withdrawal, but alive, awake, and at peace with what is.`,
    ],
  },
];

export default function TeachingsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white/80 font-sans selection:bg-[#cfa670]/30 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-32">
        <Link href="/" className="inline-block mb-12 text-[#cfa670] hover:text-[#e5c597] transition-colors font-serif tracking-widest text-sm uppercase">
          &larr; Return to Temple
        </Link>

        <h1 className="text-4xl md:text-5xl font-serif text-[#cfa670] mb-6 leading-tight">
          Buddhist Teachings
        </h1>
        <p className="text-xl text-white/60 mb-4 font-light italic font-serif">
          Ancient wisdom for the modern mind.
        </p>
        <p className="text-white/50 mb-16 leading-relaxed">
          For over 2,500 years, Buddhist teachings have offered a clear-eyed map of human suffering and a practical path toward peace. These are not doctrines to be believed but tools to be tested — in your own life, in your own mind, right now.
        </p>

        {/* Table of contents */}
        <nav className="mb-16 p-6 border border-white/10 rounded-2xl bg-white/5">
          <p className="text-[#cfa670] text-xs tracking-widest uppercase mb-4 font-sans">Contents</p>
          <ol className="space-y-2">
            {teachings.map((t, i) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="text-white/50 hover:text-[#cfa670] transition-colors text-sm">
                  {i + 1}. {t.title} <span className="text-white/20 text-xs italic">— {t.pali}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-20">
          {teachings.map((teaching, i) => (
            <section key={teaching.id} id={teaching.id} className="scroll-mt-8">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-[#cfa670]/30 font-mono text-sm">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="text-2xl md:text-3xl font-serif text-[#cfa670]">{teaching.title}</h2>
              </div>
              <p className="text-[#cfa670]/40 italic text-sm mb-6 ml-10">{teaching.pali}</p>
              <div className="ml-10 space-y-4">
                {teaching.body.map((paragraph, j) => (
                  <p key={j} className="text-white/70 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              {i < teachings.length - 1 && (
                <div className="mt-16 border-b border-white/5" />
              )}
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center border border-[#cfa670]/20 rounded-2xl p-10"
             style={{ background: 'radial-gradient(circle at 50% 0%, rgba(207,166,112,0.06) 0%, transparent 70%)' }}>
          <p className="text-[#cfa670] font-serif text-lg mb-3">Carry these teachings into your own life.</p>
          <p className="text-white/40 text-sm mb-6">Bring any worry, question, or burden — and receive wisdom drawn from these ancient teachings.</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 border border-[#cfa670]/40 text-[#cfa670] rounded-full text-sm tracking-widest uppercase hover:bg-[#cfa670]/10 transition-colors"
          >
            Speak with Buddha
          </Link>
        </div>

        {/* Related */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center text-xs text-white/30 tracking-widest">
          <Link href="/reflections" className="hover:text-[#cfa670] transition-colors">Wisdom for Life's Challenges →</Link>
          <span>|</span>
          <Link href="/about" className="hover:text-white/60 transition-colors">About BuddhaLove</Link>
        </div>
      </div>
    </div>
  );
}
