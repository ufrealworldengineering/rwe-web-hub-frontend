import rwe_logo from '@/assets/rwe-logo-notext.svg';
import { Mail, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/lib/theme-context';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} className='cursor-pointer mt-1 text-muted-foreground'>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

const Footer = () => {
    return (
        <footer className="mt-auto py-5 flex flex-col items-center px-4">
            <div className='flex items-center gap-1'>
                <img
                    alt='RWE Logo'
                    className="w-5"
                    src={rwe_logo}
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
                        to='https://www.instagram.com/realworldengineering?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        <Mail
                            className='text-muted-foreground hover:text-primary'
                        />
                    </Link>
                    <Link
                        to='https://www.instagram.com/realworldengineering?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
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
            </div>
            <ThemeToggle />
        </footer>
    );
};

export default Footer;