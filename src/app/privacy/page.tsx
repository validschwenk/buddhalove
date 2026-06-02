import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white/80 font-sans selection:bg-[#cfa670]/30 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-32">
        <Link href="/" className="inline-block mb-12 text-[#cfa670] hover:text-[#e5c597] transition-colors font-serif tracking-widest text-sm uppercase">
          &larr; Return to Temple
        </Link>

        <h1 className="text-4xl md:text-5xl font-serif text-[#cfa670] mb-8 leading-tight">Privacy Policy</h1>
        
        <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-[#cfa670]">
          <p className="text-sm text-white/50 mb-8">Last Updated: June 2026</p>

          <p>
            Welcome to BuddhaLove. We respect your privacy and are committed to protecting any information you may share 
            while finding peace within our digital sanctuary. This Privacy Policy explains how we collect, use, and safeguard 
            your information when you visit our website (the "Service").
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            <strong>Conversational Data:</strong> The messages you send to the digital Buddha are processed temporarily to 
            generate a response via third-party AI services (e.g., OpenAI). We do not store, log, or associate these messages 
            with your personal identity on our servers. Your confessions and thoughts remain ephemeral.
          </p>
          <p>
            <strong>Usage Data:</strong> We may collect standard anonymous usage data, such as your IP address, browser type, 
            operating system, and pages visited, to help us understand how our sanctuary is being used and to improve the experience.
          </p>

          <h2>2. Third-Party Services and Cookies</h2>
          <p>
            <strong>Google AdSense:</strong> We use Google AdSense to display advertisements. Google, as a third-party vendor, 
            uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads 
            to our users based on their visit to our site and/or other sites on the Internet.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#cfa670] hover:underline">Google Ads Settings</a>.
          </p>

          <h2>3. Data Security</h2>
          <p>
            While we strive to use commercially acceptable means to protect your data, remember that no method of transmission 
            over the Internet or method of electronic storage is 100% secure. We cannot guarantee its absolute security, though 
            we prioritize minimal data collection by design.
          </p>

          <h2>4. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
            on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at: <br/>
            <a href="mailto:hello@validschwenk.com" className="text-[#cfa670] hover:underline">hello@validschwenk.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
