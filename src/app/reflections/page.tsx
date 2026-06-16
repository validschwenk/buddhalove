import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buddhist Wisdom for Life\'s Challenges | BuddhaLove Reflections',
  description: 'Buddhist wisdom and teachings for anxiety, grief, anger, loneliness, and the search for purpose. Find ancient guidance for the challenges of modern life.',
};

const sections = [
  {
    id: 'anxiety',
    situation: 'When You Are Anxious',
    icon: '🌊',
    intro: 'Anxiety pulls us out of the present and into an imagined future filled with threat. Buddhist wisdom consistently points back to the only place where peace is actually found: here, now.',
    entries: [
      {
        quote: 'Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.',
        reflection: 'Most anxiety lives in a future that has not happened. The mind constructs scenarios, rehearses catastrophes, and treats imagination as reality. The antidote is simple but demanding: notice the breath, feel the ground beneath your feet, hear the sounds around you. The present moment, however uncomfortable, is always survivable.',
      },
      {
        quote: 'You yourself, as much as anybody in the entire universe, deserve your love and affection.',
        reflection: 'Anxiety is often accompanied by harsh self-judgment — a voice that says we are not safe because we are not enough. Buddhist loving-kindness practice begins by turning compassion toward oneself. When you can meet your own fear with gentleness rather than more fear, the spiral begins to slow.',
      },
      {
        quote: 'Peace comes from within. Do not seek it without.',
        reflection: 'We often seek to relieve anxiety by controlling external circumstances — avoiding certain places, seeking reassurance, staying busy. Buddhist wisdom invites a different direction: turning inward toward the unchanging awareness beneath the anxious thoughts, and finding that it has never been troubled.',
      },
    ],
  },
  {
    id: 'grief',
    situation: 'When You Are Grieving',
    icon: '🕯️',
    intro: 'Buddhism was born from an encounter with loss. The Buddha\'s first teaching arose from his direct confrontation with the reality of death. Grief is not a problem to be solved but a truth to be honored.',
    entries: [
      {
        quote: 'When you realize how perfect everything is, you will tilt your head back and laugh at the sky.',
        reflection: 'This teaching does not deny grief but points to a larger perspective. Love and loss are inseparable. To have loved deeply is to have lived deeply. Grief is love with nowhere to go — and in Buddhism, the practice is not to eliminate that love but to let it expand beyond its original object, becoming compassion for all beings who have ever lost someone.',
      },
      {
        quote: 'Nothing is lost. Everything is transformed.',
        reflection: 'Impermanence does not mean annihilation. The energy of every life continues in the world it touched — in memories, in changed hearts, in the countless ripples of every kindness offered. Buddhist philosophy invites us to hold grief and continuity simultaneously: to mourn the form while recognizing the ongoing presence of what was truly loved.',
      },
      {
        quote: 'Even death is not to be feared by one who has lived wisely.',
        reflection: 'Buddhist cultures throughout Asia treat death not as a failure of life but as its natural completion. When we can acknowledge mortality honestly — our own and those we love — we stop postponing presence. We become more willing to say the important things, to offer the kindness we might otherwise defer.',
      },
    ],
  },
  {
    id: 'anger',
    situation: 'When You Are Angry',
    icon: '🔥',
    intro: 'Buddhism does not ask us to suppress anger. It asks us to see it clearly — to recognize how anger arises, what it costs us, and what lies beneath it. Seen clearly, anger becomes a teacher.',
    entries: [
      {
        quote: 'Holding onto anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned.',
        reflection: 'This teaching invites a simple self-inquiry: who is actually suffering right now? The person we are angry with is often unaware of our internal weather. Meanwhile, we carry the weight of resentment through every moment of our day. Releasing anger is not the same as excusing harm — it is the recognition that continued suffering is optional.',
      },
      {
        quote: 'You will not be punished for your anger; you will be punished by your anger.',
        reflection: 'Buddhist psychology identifies anger as one of the "three poisons" — not because it is morally wrong to feel it, but because unchecked anger reliably produces suffering. The practice is not suppression but transformation: can you feel the heat of anger, trace it to the wound or fear beneath it, and respond from that deeper place rather than from the flame on the surface?',
      },
      {
        quote: 'In a controversy, the instant we feel anger, we have already ceased striving for truth and have begun striving for ourselves.',
        reflection: 'Anger often signals a boundary that has been crossed or a need that has not been met. Rather than directing the full force of that energy outward, Buddhist practice invites us to pause, get curious about what the anger is protecting, and then respond from clarity rather than heat.',
      },
    ],
  },
  {
    id: 'loneliness',
    situation: 'When You Feel Lonely',
    icon: '🏮',
    intro: 'Loneliness is one of the defining experiences of the modern age. Buddhism offers a surprising perspective: beneath the feeling of loneliness is a deeper truth about connection that has never been broken.',
    entries: [
      {
        quote: 'If you truly loved yourself, you could never hurt another.',
        reflection: 'Genuine connection with others becomes possible only through genuine connection with ourselves. Loneliness often contains an invitation: to stop waiting for an external relationship to make us feel whole, and instead to discover the quality of presence that makes all relationship possible. The one who can be alone peacefully is the same one who connects most fully with others.',
      },
      {
        quote: 'Just as a candle cannot burn without fire, men cannot live without a spiritual life.',
        reflection: 'Buddhism suggests that the deepest loneliness is not the absence of other people but the absence of contact with our own depth. Meditation, contemplation, and service all create a sense of meaningful participation in something larger than the individual self — and in that participation, loneliness dissolves without requiring any particular person to appear.',
      },
      {
        quote: 'We are all connected. To hurt another is to hurt yourself.',
        reflection: 'The Buddhist doctrine of interdependence — the recognition that all phenomena arise in relationship — fundamentally challenges the premise of isolation. You are not a separate self adrift in a sea of other separate selves. You are a node in an inconceivably vast web of connection. Your loneliness is felt by the world; your peace contributes to it.',
      },
    ],
  },
  {
    id: 'purpose',
    situation: 'When You Seek Purpose',
    icon: '🌸',
    intro: 'The search for meaning is itself meaningful. Buddhism does not hand us a pre-packaged purpose but offers a framework for discovering what genuinely matters — when we are still enough to hear.',
    entries: [
      {
        quote: 'Your work is to discover your world and then with all your heart give yourself to it.',
        reflection: 'Purpose, in Buddhist thought, is not found by looking outward for a cosmic assignment. It is found by paying close attention to what calls to you — what causes you to lean forward with interest, what kind of suffering you feel particularly moved to address, what activities make you lose track of time. These are not accidents; they are the shape of your contribution.',
      },
      {
        quote: 'The trouble is, you think you have time.',
        reflection: 'One of the most powerful teachers of purpose is the honest acknowledgment of mortality. When we truly reckon with the fact that our time is finite, the small things naturally fall away. What would you do if you had one year? One month? What does that question reveal about what actually matters to you?',
      },
      {
        quote: 'Three things cannot be long hidden: the sun, the moon, and the truth.',
        reflection: 'Lasting purpose is always aligned with truth — with what we actually value rather than what we think we should value, with who we actually are rather than who we think we should be. Buddhism invites a sustained inquiry into this territory. Meditation creates the stillness in which the authentic self, so often drowned out by external noise, can finally be heard.',
      },
    ],
  },
  {
    id: 'letting-go',
    situation: 'When You Cannot Let Go',
    icon: '🍂',
    intro: 'Attachment is the Buddha\'s word for the grip we place on people, outcomes, and identities. Learning to loosen that grip — without losing love — is one of the deepest skills a human being can develop.',
    entries: [
      {
        quote: 'Let go or be dragged.',
        reflection: 'There are moments when the choice becomes unmistakably clear: we can move with the flow of life, or we can be pulled under by our refusal to let it move. Letting go is not giving up — it is recognizing that our grip has already failed, and that our hands are now free for something new.',
      },
      {
        quote: 'Attachment is the source of all suffering. Non-attachment is not indifference — it is the freedom to love without clinging.',
        reflection: 'A common misunderstanding of Buddhism is that non-attachment means not caring. The opposite is true. When we love without grasping, we love more completely — because we are present to the actual person before us rather than the person we need them to be. Non-attachment is what makes genuine intimacy possible.',
      },
      {
        quote: 'You only lose what you cling to.',
        reflection: 'Everything in the physical world is borrowed. The house, the body, the relationships, the reputation — all of it is on loan from a universe that will reclaim it in due time. This is not a reason for despair but for a different kind of appreciation: the beauty of the ephemeral, the preciousness of now, the lightness that comes from holding life with open hands.',
      },
    ],
  },
];

export default function ReflectionsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white/80 font-sans selection:bg-[#cfa670]/30 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-32">
        <Link href="/" className="inline-block mb-12 text-[#cfa670] hover:text-[#e5c597] transition-colors font-serif tracking-widest text-sm uppercase">
          &larr; Return to Temple
        </Link>

        <h1 className="text-4xl md:text-5xl font-serif text-[#cfa670] mb-6 leading-tight">
          Reflections
        </h1>
        <p className="text-xl text-white/60 mb-4 font-light italic font-serif">
          Buddhist wisdom for the challenges of everyday life.
        </p>
        <p className="text-white/50 mb-16 leading-relaxed">
          These teachings have been offered and refined over 2,500 years of human experience. They do not promise the elimination of pain — they offer something more durable: a way of meeting whatever arises with clarity, compassion, and a measure of peace.
        </p>

        {/* Jump links */}
        <nav className="mb-16 p-6 border border-white/10 rounded-2xl bg-white/5 flex flex-wrap gap-3">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-white/40 hover:text-[#cfa670] hover:border-[#cfa670]/30 transition-colors text-xs tracking-wide"
            >
              <span>{s.icon}</span>
              {s.situation.replace('When You ', '').replace('When You Are ', '')}
            </a>
          ))}
        </nav>

        <div className="space-y-24">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-2xl md:text-3xl font-serif text-[#cfa670]">{section.situation}</h2>
              </div>
              <p className="text-white/50 italic mb-10 leading-relaxed pl-11">{section.intro}</p>

              <div className="pl-11 space-y-10">
                {section.entries.map((entry, i) => (
                  <div key={i} className="border-l border-[#cfa670]/20 pl-6">
                    <blockquote className="text-[#f3e8dd] font-serif text-lg leading-relaxed mb-4 italic"
                                style={{ textShadow: '0 0 20px rgba(207,166,112,0.1)' }}>
                      &ldquo;{entry.quote}&rdquo;
                    </blockquote>
                    <p className="text-white/55 leading-relaxed text-sm">{entry.reflection}</p>
                  </div>
                ))}
              </div>

              {sections.indexOf(section) < sections.length - 1 && (
                <div className="mt-16 border-b border-white/5" />
              )}
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center border border-[#cfa670]/20 rounded-2xl p-10"
             style={{ background: 'radial-gradient(circle at 50% 0%, rgba(207,166,112,0.06) 0%, transparent 70%)' }}>
          <p className="text-[#cfa670] font-serif text-lg mb-3">Words are a beginning. Practice is the path.</p>
          <p className="text-white/40 text-sm mb-6">Bring your specific situation to Buddha — and receive wisdom that speaks directly to where you are right now.</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 border border-[#cfa670]/40 text-[#cfa670] rounded-full text-sm tracking-widest uppercase hover:bg-[#cfa670]/10 transition-colors"
          >
            Speak with Buddha
          </Link>
        </div>

        {/* Related */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center text-xs text-white/30 tracking-widest">
          <Link href="/teachings" className="hover:text-[#cfa670] transition-colors">Core Buddhist Teachings →</Link>
          <span>|</span>
          <Link href="/about" className="hover:text-white/60 transition-colors">About BuddhaLove</Link>
        </div>
      </div>
    </div>
  );
}
