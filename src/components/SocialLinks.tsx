import AnimatedIconButton from './AnimatedIconButton';
import GitHubLoop from '../assets/images/github_loop.gif';
import GitHubStatic from '../assets/images/github_static.webp';
import LinkedInLoop from '../assets/images/linkedin_loop.gif';
import LinkedInStatic from '../assets/images/linkedin_static.webp';
import EmailLoop from '../assets/images/email_loop.gif';
import EmailStatic from '../assets/images/email_static.webp';
import { CONTACT_EMAIL } from '../data/contact';

interface SocialLinksProps {
  buttonClassName?: string;
}

function SocialLinks({ buttonClassName }: SocialLinksProps) {
  return (
    <>
      <AnimatedIconButton
        activeLogo={GitHubLoop}
        inactiveLogo={GitHubStatic}
        href="https://github.com/joaquingalang"
        label="GitHub profile"
        target="_blank"
        className={buttonClassName}
      />
      <AnimatedIconButton
        activeLogo={LinkedInLoop}
        inactiveLogo={LinkedInStatic}
        href="https://www.linkedin.com/in/joaquin-galang/"
        label="LinkedIn profile"
        target="_blank"
        className={buttonClassName}
      />
      <AnimatedIconButton
        activeLogo={EmailLoop}
        inactiveLogo={EmailStatic}
        href={`mailto:${CONTACT_EMAIL}`}
        label="Send an email"
        className={buttonClassName}
      />
    </>
  );
}

export default SocialLinks;
