import { ChevronDown } from 'lucide-react';
import logo from '@/assets/rwe-logo-notext.svg';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
	return (
		<main className='flex flex-col md:flex-row w-full min-h-screen bg-background-primary justify-center'>
			<div className='flex flex-col justify-center items-center w-full md:w-[45%] gap-4 px-6 py-16 md:py-0 md:px-0'>
				<div className='flex flex-col'>
					<h1 className='text-4xl sm:text-5xl lg:text-6xl text-text-secondary'>REAL WORLD</h1>
					<div className='uppercase overflow-hidden h-10 sm:h-12 lg:h-15 leading-10 sm:leading-12 lg:leading-15 text-4xl sm:text-5xl lg:text-6xl'>
						<span className='font-black block animate-hero-text'>
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
			<div className='w-full flex-1 md:flex-none md:w-[55%] md:min-h-0 bg-background-accent relative flex items-center justify-center'>
				<img src={logo} className='w-1/2 md:w-auto max-w-xs md:max-w-sm lg:max-w-md' />
				{/* TODO: Fancy hero section graphic here... */}
			</div>
		</main>
	);
};

export default HeroSection;
