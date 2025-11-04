import { SiFlutter, SiFirebase, SiSupabase, SiHtml5, SiCss3, SiJavascript, SiTypescript, SiReact, SiTailwindcss, SiBootstrap, SiGit, SiCloudflare, SiVercel} from 'react-icons/si';
import LogoLoop from "../components/LogoLoop";

const techLogos = [
  { node: <SiFlutter color="gray"/>, title: "React"},
  { node: <SiFirebase color="gray"/>, title: "React"},
  { node: <SiSupabase color="gray"/>, title: "React"},
  { node: <SiHtml5 color="gray"/>, title: "React"},
  { node: <SiCss3 color="gray"/>, title: "React"},
  { node: <SiJavascript color="gray"/>, title: "React"},
  { node: <SiTypescript color="gray"/>, title: "React"},
  { node: <SiReact color="gray"/>, title: "React"},
  { node: <SiTailwindcss color="gray"/>, title: "React"},
  { node: <SiBootstrap color="gray"/>, title: "React"},
  { node: <SiGit color="gray"/>, title: "React"},
  { node: <SiCloudflare color="gray"/>, title: "React"},
  { node: <SiVercel color="gray"/>, title: "React"},
];

function SkillSection() {
    return (
        <div className='grid grid-cols-12'>
            <div className='col-start-3 col-span-8'>
                <LogoLoop
                    logos={techLogos}
                    speed={50}
                    direction="left"
                    logoHeight={48}
                    gap={40}
                    pauseOnHover
                    scaleOnHover
                    fadeOut
                    fadeOutColor="#0B0B0D"
                    ariaLabel="Technology partners"
                /> 
            </div>
        </div>    
    );
}

export default SkillSection;