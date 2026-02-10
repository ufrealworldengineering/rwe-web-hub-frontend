import {
    Marquee,
    MarqueeContent,
    MarqueeItem,
    MarqueeFade
} from './ui/shadcn-io/marquee';
import onshape_logo from '@/assets/onshape-logo-RGB_K-cropped.svg';

const Logos = [onshape_logo];

const LogoMarquee = () => {
    return (
        <div className='flex size-full items-center justify-center'>
            <Marquee>
                <MarqueeFade side='left' />
                <MarqueeFade side='right' />
                <MarqueeContent autoFill={true} pauseOnHover={true}>
                    {Logos.map((logo, index) => (
                        <>
                            <MarqueeItem className='mx-6 w-48 h-36 flex items-center justify-center' key={index}>
                                <img
                                    alt={`logo-${index}`}
                                    className='max-w-full mxa-h-full py-3.5 object-contain cursor-pointer transition-transform delay-50 duration-300 ease-in-out hover:scale-125'
                                    src={logo}
                                />
                            </MarqueeItem>
                        </>
                    ))}
                </MarqueeContent>
            </Marquee>
        </div>
    );
};

export default LogoMarquee;