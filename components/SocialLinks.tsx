import { BsGithub, BsLinkedin, BsEnvelopeOpenFill } from 'react-icons/bs';

const LINKEDIN_URL = 'https://www.linkedin.com/in/yunior-profile/';
const GITHUB_URL = 'https://github.com/batistaDev1113';
const EMAIL = 'yuniorbatista1113@gmail.com';

type SocialLinksProps = {
  className?: string;
  variant?: 'icon' | 'text';
};

const ITEMS = [
  {
    label: 'GitHub',
    href: GITHUB_URL,
    Icon: BsGithub,
  },
  {
    label: 'LinkedIn',
    href: LINKEDIN_URL,
    Icon: BsLinkedin,
  },
  {
    label: 'Email',
    href: `mailto:${EMAIL}`,
    Icon: BsEnvelopeOpenFill,
  },
];

const SocialLinks = ({ className = '', variant = 'icon' }: SocialLinksProps) => {
  return (
    <div
      className={`flex gap-6 ${variant === 'text' ? 'flex-col items-start' : 'flex-row items-center'}`}
    >
      {ITEMS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          aria-label={`${label} profile`}
          className={`group flex items-center gap-2 transition-colors duration-200 ${className}`}
        >
          <Icon className='w-5 h-5 transition-transform duration-200 group-hover:scale-110' />
          {variant === 'text' && (
            <span className='text-sm font-mono'>{label}</span>
          )}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;