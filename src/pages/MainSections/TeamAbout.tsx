import type { LucideIcon } from 'lucide-react'
import { Bot, Motorbike, Drone, Globe, Glasses } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselDots
} from '@/components/ui/carousel';

type Team = {
    id: string;
    name: string;
    description: string;
    images: string[];
    icon: LucideIcon;
}

const teams: Team[] = [
    {
        id: 'robot_arm',
        name: 'Robot Arm Team',
        description:
            `Developing a desktop-scale, open source 3D printing robotic arm that serves as an alternative to conventional 3D printers that move along straight X-Y-Z axes. By positioning the printhead with a multi-axis arm rather than stacked linear rails, the system enables non-planar printing, allowing material to be deposited along curved surfaces and continuously varying orientations.`,
        images: [
            '/robot/1.png',
            '/robot/2.jpg',
            '',
        ],
        icon: Bot,
    },
    {
        id: 'ebike',
        name: 'EBike Team',
        description:
            `Developing a desktop-scale, open source 3D printing robotic arm that serves as an alternative to conventional 3D printers that move along straight X-Y-Z axes. By positioning the printhead with a multi-axis arm rather than stacked linear rails, the system enables non-planar printing, allowing material to be deposited along curved surfaces and continuously varying orientations.`,
        images: [
            '/ebike/1.jpg',
            '/ebike/2.jpg',
            '/ebike/3.jpg',
        ],
        icon: Motorbike,
    },
    {
        id: 'drone',
        name: 'Drone Team',
        description:
            `Developing a desktop-scale, open source 3D printing robotic arm that serves as an alternative to conventional 3D printers that move along straight X-Y-Z axes. By positioning the printhead with a multi-axis arm rather than stacked linear rails, the system enables non-planar printing, allowing material to be deposited along curved surfaces and continuously varying orientations.`,
        images: [
            '/drone/1.jpg',
            '/drone/2.jpg',
            '',
        ],
        icon: Drone,
    },
    {
        id: 'web_dev',
        name: 'Web Development Team',
        description:
            `Developing a desktop-scale, open source 3D printing robotic arm that serves as an alternative to conventional 3D printers that move along straight X-Y-Z axes. By positioning the printhead with a multi-axis arm rather than stacked linear rails, the system enables non-planar printing, allowing material to be deposited along curved surfaces and continuously varying orientations.`,
        images: [
            '',
            '',
            '',
            ''
        ],
        icon: Globe,
    },
    {
        id: 'smart_glasses',
        name: 'Smart Glasses Team',
        description:
            `Developing a desktop-scale, open source 3D printing robotic arm that serves as an alternative to conventional 3D printers that move along straight X-Y-Z axes. By positioning the printhead with a multi-axis arm rather than stacked linear rails, the system enables non-planar printing, allowing material to be deposited along curved surfaces and continuously varying orientations.`,
        images: [
            '',
            '',
            '',
            ''
        ],
        icon: Glasses,
    },
];

const TeamAbout = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentTeam = teams[currentIndex];

    return (
        <section className='flex flex-col w-full items-center justify-center bg-background-accent-secondary py-8 px-4'>
            <div className='w-full max-w-2xl mb-4 flex justify-center items-center gap-2 sm:gap-3 md:gap-4 flex-wrap'>
                {teams.map((item, index) => {
                    const TeamIcon = item.icon;
                    const isActive = index === currentIndex;
                    return (
                        <Button
                            key={item.id}
                            onClick={() => setCurrentIndex(index)}
                            className={`md:size-auto md:px-4 md:py-2 relative overflow-hidden ${isActive ? 'bg-background text-background-accent-secondary hover:bg-background' : 'bg-background-accent-secondary text-background hover:text-background-accent-secondary hover:bg-background'} border-2 box-border duration-300 border-background cursor-pointer font-sans font-semibold`}
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

            <div className='flex flex-col md:flex-row items-stretch w-full gap-8 md:gap-12 lg:gap-16 md:px-16 lg:px-32 max-w-7xl'>
                <div className='w-full md:flex-1 min-w-0 flex flex-col justify-center gap-3 overflow-hidden'>
                    <Carousel
                        opts={{
                            loop: true,
                        }}
                    >
                        <CarouselContent className='py-8'>
                            {currentTeam.images.map((image, idx) => (
                                <CarouselItem key={idx}>
                                    <Card className='p-1'>
                                        <CardContent className='flex aspect-video items-center justify-center p-0 overflow-hidden rounded-md'>
                                            <img
                                                src={image}
                                                alt={currentTeam.name}
                                                className='w-full h-full object-cover'
                                            />
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
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