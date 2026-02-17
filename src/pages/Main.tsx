import Footer from '@/components/footer';
import TeamAbout from '@/pages/MainSections/TeamAbout';
import OrgAbout from '@/pages/MainSections/OrgAbout';
import HeroSection from '@/pages/MainSections/HeroSection';

const Main = () => {
    return (
        <main className='overflow-hidden'>
            <div>
                <HeroSection />
                <OrgAbout />
                <TeamAbout />
                <Footer />
            </div>
        </main>
    );
};

export default Main;