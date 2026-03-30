import Footer from '@/components/footer';
import TeamAbout from '@/pages/MainSections/TeamAbout';
import OrgAbout from '@/pages/MainSections/OrgAbout';
import HeroSection from '@/pages/MainSections/HeroSection';
import LogoMarquee from '@/components/logo-marquee';

const Main = () => {
    return (
        <main className='overflow-hidden'>
            <div>
                <HeroSection />
                <TeamAbout />
                <OrgAbout />
                <LogoMarquee />
                <Footer />
            </div>
        </main>
    );
};

export default Main;