import { ChevronDown } from 'lucide-react';
import logo from '@/assets/rwe-logo-notext.svg';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
	return (
		<main className='flex flex-row w-full min-h-screen bg-background-primary justify-center'>
			<div className='flex flex-col justify-center items-center left-0 w-[45%] gap-4'>
				<div className='flex flex-col'>
					<h1 className='text-6xl text-text-secondary'>REAL WORLD</h1>
					<div className='uppercase overflow-hidden h-15 leading-15 text-6xl'>
						<span className='font-black relative animate-hero-text '>
							PROBLEMS <br />
							SOLUTIONS <br />
							EXPERIENCE <br />
							ENGINEERING
						</span>
					</div>
				</div>
				<div className='w-fit flex flex-row justify-center gap-4'>
					<Button className='bg-accent text-background border-2 box-border duration-300 border-accent hover:text-accent hover:bg-background font-sans font-semibold '>
						Join Discord
					</Button>
					<Button className='bg-transparent text-accent border-accent duration-300 hover:text-background hover:bg-accent border-2 font-sans font-semibold'>
						Check-In
					</Button>
				</div>
				<ChevronDown className='text-accent transition-transform animate-bounce ease-in-out duration-1500' />
			</div>
			<div className='right-0 w-[55%] bg-background-accent relative flex items-center justify-center'>
				<img src={logo} />
				{/* TODO: Fancy hero section graphic here... */}
            </div>
		</main>
	);
};

export default HeroSection;
