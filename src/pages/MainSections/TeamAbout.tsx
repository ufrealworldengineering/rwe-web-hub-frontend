import type { LucideIcon } from 'lucide-react'
import { Bot, Motorbike, Drone, Globe, Glasses } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ImageWithLoader } from '@/components/ui/image-with-loader';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselDots,
    CarouselPrevious,
    CarouselNext
} from '@/components/ui/carousel';

type Team = {
    id: string;
    name: string;
    description: string;
    imageFolder: string | null;
    icon: LucideIcon;
}

type GlobImageMap = Record<string, string>;

/** Relative to this file → `public/<folder>/`. Avoid `/public/...` globs (Vite warns; URLs should be `/robot/...` not `/public/robot/...`). */
const robotImages = import.meta.glob('../../../public/robot/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}', {
    eager: true,
    import: 'default',
    query: '?url',
}) as GlobImageMap;

const ebikeImages = import.meta.glob('../../../public/ebike/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}', {
    eager: true,
    import: 'default',
    query: '?url',
}) as GlobImageMap;

const droneImages = import.meta.glob('../../../public/drone/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}', {
    eager: true,
    import: 'default',
    query: '?url',
}) as GlobImageMap;

const smartGlassesImages = import.meta.glob('../../../public/smart-glasses/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}', {
    eager: true,
    import: 'default',
    query: '?url',
}) as GlobImageMap;

const imageMapByTeamId: Record<string, GlobImageMap> = {
    robot_arm: robotImages,
    ebike: ebikeImages,
    drone: droneImages,
    smart_glasses: smartGlassesImages,
};

const getTeamImages = (teamId: string): string[] => {
    const imageMap = imageMapByTeamId[teamId];
    if (!imageMap) return [];

    return Object.entries(imageMap)
        .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
        .map(([, url]) => url);
};

const teams: Team[] = [
    {
        id: 'robot_arm',
        name: 'Robot Arm Team',
        description:
            `Developing a desktop-scale, open source 3D printing robotic arm that serves as an alternative to conventional 3D printers that move along straight X-Y-Z axes. By positioning the printhead with a multi-axis arm rather than stacked linear rails, the system enables non-planar printing, allowing material to be deposited along curved surfaces and continuously varying orientations.`,
        imageFolder: 'robot',
        icon: Bot,
    },
    {
        id: 'ebike',
        name: 'EBike Team',
        description: 'Designing and building an electric bike platform that integrates mechanical design, embedded electronics, battery/power systems, and control software to create a reliable, efficient, and testable mobility prototype.',
        imageFolder: 'ebike',
        icon: Motorbike,
    },
    {
        id: 'drone',
        name: 'Drone Team',
        description: 'Developing a drone system that combines hardware integration, flight control, sensing, and software tooling for autonomous and assisted flight tasks, with a focus on safe operation, data collection, and iterative testing.',
        imageFolder: 'drone',
        icon: Drone,
    },
    {
        id: 'web_dev',
        name: 'Web Development Team',
        description:
            `Building and maintaining this full-stack RWE web platform, including public team pages, applications workflow, and admin dashboard tools that support member operations and project coordination.`,
        imageFolder: null,
        icon: Globe,
    },
    {
        id: 'smart_glasses',
        name: 'Smart Glasses Team',
        description:
            `Combining hardware and software to develop a pair of smart glasses with audio and visual processing, speech and image recognition, and memory-assist features that help users capture and recall information through the glasses.`,
        imageFolder: 'smart-glasses',
        icon: Glasses,
    },
];

const TeamAbout = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentTeam = teams[currentIndex];
    const currentImages = getTeamImages(currentTeam.id);

    return (
        <section className='flex flex-col w-full items-center justify-center bg-background-secondary py-8 px-4'>
            <div className='w-full max-w-2xl mb-4 flex justify-center items-center gap-2 sm:gap-3 md:gap-4 flex-wrap'>
                {teams.map((item, index) => {
                    const TeamIcon = item.icon;
                    const isActive = index === currentIndex;
                    return (
                        <Button
                            key={item.id}
                            onClick={() => setCurrentIndex(index)}
                            className={`md:size-auto md:px-4 md:py-2 relative overflow-hidden ${isActive ? 'bg-primary text-background hover:bg-primary/90' : 'bg-background text-primary hover:text-background hover:bg-primary'} border-2 box-border duration-300 border-primary/60 cursor-pointer font-sans font-semibold`}
                            title={item.name}
                        >
                            <TeamIcon className='size-5 md:size-4 md:mr-2 shrink-0' />
                            <span className='hidden md:inline text-sm font-medium'>
                                {item.name.split(' ')[0]}
                            </span>
                        </Button>
                    )
                })}
            </div>

            <div className='flex flex-col md:flex-row items-stretch w-full gap-8 md:gap-12 lg:gap-16 md:px-8 lg:px-16 max-w-[110rem]'>
                <div className='w-full md:flex-[1.6] min-w-0 flex flex-col justify-center gap-3 overflow-visible'>
                    <Carousel
                        opts={{
                            loop: true,
                        }}
                    >
                        <CarouselContent className='py-12 md:py-14'>
                            {currentImages.length > 0 ? currentImages.map((image, idx) => (
                                <CarouselItem key={idx}>
                                    <Card className='p-2'>
                                        <CardContent className='flex aspect-[16/9] items-center justify-center p-0 overflow-hidden rounded-md'>
                                            <ImageWithLoader
                                                src={image}
                                                alt={currentTeam.name}
                                                wrapperClassName='w-full h-full'
                                                className='w-full h-full object-cover'
                                            />
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            )) : (
                                <CarouselItem>
                                    <Card className='p-2'>
                                        <CardContent className='flex aspect-[16/9] items-center justify-center rounded-md bg-muted text-muted-foreground'>
                                            Images coming soon for {currentTeam.name}.
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            )}
                        </CarouselContent>
                        <CarouselPrevious className='-left-4 md:-left-12 bg-background/95 border-border z-20 cursor-pointer enabled:cursor-pointer shadow-sm' />
                        <CarouselNext className='-right-4 md:-right-12 bg-background/95 border-border z-20 cursor-pointer enabled:cursor-pointer shadow-sm' />
                        <CarouselDots ringClass='border-background-accent' activeClass='bg-background-accent' />
                    </Carousel>
                </div>
                <div className='w-full md:flex-1 min-w-0 flex flex-col justify-center gap-4 py-4 md:py-0 overflow-hidden'>
                    <div className='flex items-center gap-3'>
                        <h2 className='text-2xl sm:text-3xl font-bold text-accent-foreground shrink-0'>
                            {currentTeam.name}
                        </h2>
                    </div>
                    <p className='text-base sm:text-lg font-medium text-accent-foreground/90 overflow-y-auto whitespace-pre-line leading-relaxed'>
                        {currentTeam.description}
                    </p>
                </div>
            </div>
        </section>
    )
};

export default TeamAbout;