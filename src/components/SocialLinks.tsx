import AnimatedIconButton from './AnimatedIconButton';
import GitHubLoop from '../assets/images/github_loop.gif';
import GitHubStatic from '../assets/images/github_static.png';
import LinkedInLoop from '../assets/images/linkedin_loop.gif';
import LinkedInStatic from '../assets/images/linkedin_static.png';
import EmailLoop from '../assets/images/email_loop.gif';
import EmailStatic from '../assets/images/email_static.png';

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
        target="_blank"
        className={buttonClassName}
      />
      <AnimatedIconButton
        activeLogo={LinkedInLoop}
        inactiveLogo={LinkedInStatic}
        href="https://www.linkedin.com/in/joaquin-galang/"
        target="_blank"
        className={buttonClassName}
      />
      <AnimatedIconButton
        activeLogo={EmailLoop}
        inactiveLogo={EmailStatic}
        href="mailto:galang.joaquin.dev@gmail.com"
        className={buttonClassName}
      />
    </>
  );
}

export default SocialLinks;
