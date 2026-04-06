import rwe_logo from '@/assets/rwe-logo-notext.svg';
import { Mail, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithLoader } from './ui/image-with-loader';

const Footer = () => {
    return (
        <footer className="mt-auto py-5 flex flex-col items-center px-4">
            <div className='flex items-center gap-1'>
                <ImageWithLoader
                    src={rwe_logo}
                    alt='RWE Logo'
                    wrapperClassName='w-5'
                    className='w-full h-auto'
                    loading='eager'
                />
                <p className="text-base sm:text-lg text-muted-foreground">
                    Real World Engineering
                </p>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground text-center">
                University of Florida · Gainesville, FL
            </p>
            <div className="flex flex-col items-center gap-2 mt-1">
                <div className="flex space-x-4">
                    <Link
                        to='https://www.instagram.com/realworldengineering'
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        <Mail
                            className='text-muted-foreground hover:text-primary'
                        />
                    </Link>
                    <Link
                        to='https://www.instagram.com/realworldengineering'
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        <Instagram
                            className='text-muted-foreground hover:text-primary'
                        />
                    </Link>
                    <Link
                        to='https://www.linkedin.com/company/rwe-real-world-engineering/'
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        <Linkedin
                            className='text-muted-foreground hover:text-primary'
                        />
                    </Link>
                </div>
                <Link
                    to='/login'
                    className='mt-1 rounded-md border border-border px-3 py-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
                >
                    Admin Login
                </Link>
            </div>
        </footer>
    );
};

export default Footer;