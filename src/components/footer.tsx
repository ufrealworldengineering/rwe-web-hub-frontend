import rwe_logo from '@/assets/rwe-logo-notext.svg';
import { Mail, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="mt-auto py-5 flex flex-col items-center">
            <div className='flex'>
                <img
                    alt='RWE Logo'
                    className="self-center w-5 float-left mr-1"
                    src={rwe_logo}

                />
                <p className="text-lg text-muted-foreground">
                    Real World Engineering
                </p>
            </div>

            <p className="text-sm text-muted-foreground">
                University of Florida · Gainesville, FL
            </p>
            <div className="flex flex-col items-center md:items-end gap-2 mt-1">
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
        </footer >
    );
};

export default Footer;