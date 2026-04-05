import { Moon, Sun } from 'lucide-react';
import logo from '@/assets/rwe-logo-notext.svg';
import { Button } from '@/components/ui/button';
import { ImageWithLoader } from '@/components/ui/image-with-loader';
import { Link } from 'react-router-dom';
import { useUIStore } from '@/store/uiStore';

const HeroSection = () => {
	const { theme, setTheme } = useUIStore();
	const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

	return (
		<main className='flex flex-col md:flex-row w-full min-h-screen bg-background-primary justify-center'>
			<div className='fixed top-4 left-4 z-30 flex items-center gap-3'>
				<Link
					to='https://discord.com/invite/b2v2gFxBdt'
					rel='noopener noreferrer'
					target='_blank'
				>
					<Button
						className='bg-accent text-background border-2 box-border duration-300 border-accent hover:text-accent cursor-pointer hover:bg-background font-sans font-semibold'
					>
						Join Discord
					</Button>
				</Link>
				<Link
					to='/applications'
					rel='noopener noreferrer'
				>
					<Button className='bg-transparent text-accent border-accent duration-300 hover:text-background cursor-pointer hover:bg-accent border-2 font-sans font-semibold'>
						Apply
					</Button>
				</Link>
			</div>

			<button
				type='button'
				onClick={toggleTheme}
				className='fixed top-4 right-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm hover:bg-muted transition-colors cursor-pointer'
				aria-label='Toggle theme'
				title='Toggle light/dark mode'
			>
				{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
			</button>

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
			</div>
			<div className='w-full flex-1 md:flex-none md:w-[55%] md:min-h-0 bg-background-secondary relative flex items-center justify-center'>
				<ImageWithLoader
					src={logo}
					alt='RWE logo'
					wrapperClassName='w-1/2 md:w-auto max-w-xs md:max-w-sm lg:max-w-md'
					className='w-full h-auto'
					loading='eager'
				/>
				{/* TODO: Fancy hero section graphic here... */}
			</div>
		</main>
	);
};

export default HeroSection;
