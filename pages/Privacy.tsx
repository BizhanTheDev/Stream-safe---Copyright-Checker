import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 prose prose-slate max-w-none">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-8">Legal & Privacy</h1>
      
      <div className="space-y-8 text-slate-600">
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Privacy Policy</h2>
          <p>
            At StreamSafe, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from StreamSafe.
          </p>
          <h3 className="font-bold mt-4">Information We Collect</h3>
          <p>
            When you use StreamSafe, we collect information about the songs you search for to improve our database. We do not collect personal identifiable information (PII) like your name or address unless you explicitly provide it (e.g., in a contact form). We use LocalStorage on your device to remember your recent searches.
          </p>
          <h3 className="font-bold mt-4">Cookies</h3>
          <p>
            We may use cookies to improve your experience. If we display ads in the future (e.g., via Google AdSense), third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites.
          </p>
        </section>

        <hr className="border-slate-200 my-8"/>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Terms of Service</h2>
          <p>
            By using StreamSafe, you agree to these terms.
          </p>
          <h3 className="font-bold mt-4">Disclaimer</h3>
          <p>
            The information provided by StreamSafe is for informational purposes only. While we use advanced AI to analyze copyright data, copyright policies change frequently. We are not responsible for any copyright strikes, claims, or bans you may receive. Always verify with the official platform or rights holder.
          </p>
          <h3 className="font-bold mt-4">Usage</h3>
          <p>
            You agree not to misuse the service or scrape our data. We reserve the right to ban users who abuse the system.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;