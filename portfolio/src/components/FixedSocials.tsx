"use client";

export default function FixedSocials({ contactActive }: { contactActive: boolean }) {
  const socials = [
    {
      name: "GitHub",
      url: "https://github.com/naksh-atra",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58V22" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/nakshatra-rajput",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/SatyaNaaksh",
      icon: (
         <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.293 19.494h2.039L6.482 3.239H4.293l13.315 17.408z" />
        </svg>
      ),
    },
    {
      name: "Email",
      url: "mailto:nakshatra.rajput@outlook.com",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`fixed transition-all duration-1000 ease-eye-ease z-[500] flex ${

        contactActive ? "bottom-[25vh] left-1/2 -translate-x-1/2 flex-row gap-12" : "bottom-12 left-12 flex-col gap-[1.8rem]"
      }`}
    >

      {socials.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          title={social.name}
          className="group"
        >
          <div className={`transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-[3px] opacity-40 text-eye ${contactActive ? 'w-6 h-6' : 'w-5 h-5'}`}>
            {social.icon}
          </div>
        </a>
      ))}
    </div>
  );
}
