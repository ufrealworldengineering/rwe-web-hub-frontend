import {
    Marquee,
    MarqueeContent,
    MarqueeItem,
    MarqueeFade
} from './ui/shadcn-io/marquee';
import onshape_logo from '@/assets/onshape-logo-RGB_K-cropped.svg';
import slice_logo from '@/assets/sliceengineering-logo.png';

const Logos = [onshape_logo, slice_logo];

const LogoMarquee = () => {
    return (
        <div className='flex size-full items-center justify-center'>
            <Marquee>
                <MarqueeFade side='left' />
                <MarqueeFade side='right' />
                <MarqueeContent autoFill={true} pauseOnHover={true}>
                    {Logos.map((logo, index) => (
                        <MarqueeItem className='mx-6 h-36 w-48 flex items-center justify-center' key={index}>
                            <div className='flex h-full w-full items-center justify-center rounded-lg bg-white p-3 shadow-sm'>
                                <img
                                    src={logo}
                                    alt={`logo-${index}`}
                                    className='max-h-full max-w-full object-contain cursor-pointer transition-transform delay-50 duration-300 ease-in-out hover:scale-110'
                                    loading='eager'
                                    decoding='async'
                                />
                            </div>
                        </MarqueeItem>
                    ))}
                </MarqueeContent>
            </Marquee>
        </div>
    );
};

export default LogoMarquee;