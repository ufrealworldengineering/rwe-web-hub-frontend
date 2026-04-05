import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselDots,
    CarouselPrevious,
    CarouselNext
} from "@/components/ui/carousel"
import { ImageWithLoader } from "@/components/ui/image-with-loader";

// import Autoplay from "embla-carousel-autoplay";
// import useEmblaCarousel from "embla-carousel-react";

import { Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

// import stockHeadshot from '@/assets/headshots/stock-headshot.jpg';
import AlinaGarib from '@/assets/headshots/AlinaGarib.jpeg';
import IanTowns from '@/assets/headshots/IanTowns.jpeg';
import MichaelSmith from '@/assets/headshots/MichealSmith.jpeg';
import SarveshPalani from '@/assets/headshots/SarveshPalani.jpg';

type BoardMember = {
    name: string;
    role: string;
    imgURL: string;
    description?: string;
    linkedin?: string;
};

const EBoard: BoardMember[] = [
    {
        name: "Sarveshwaran Palani",
        role: "President",
        imgURL: SarveshPalani,
        // description: "Previous Intern...",
        linkedin: "sarveshwpalani"
    },
    {
        name: "Ian Towns",
        role: "Vice President",
        imgURL: IanTowns,
        // description: "Previous Intern...",
        linkedin: "ian-towns"
    },
    {
        name: "Michael Smith",
        role: "Treasurer",
        imgURL: MichaelSmith,
        // description: "Previous Intern...",
        linkedin: "brady-carrington"
    },
    {
        name: "Alina Garib",
        role: "Software Program Manager",
        imgURL: AlinaGarib,
        // description: "Previous Intern...",
        linkedin: "alina-garib"
    },
];

const OrgAbout = () => {
    const [emblaApi, setEmblaApi] = useState<any | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            const current = emblaApi.selectedScrollSnap();
            setSelectedIndex(current ?? 0);
        };

        // set the initial index and attach listener
        onSelect();
        emblaApi.on("select", onSelect);

        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi]);

    const selected = EBoard[selectedIndex] ?? EBoard[0];

    return (
        <section className="flex flex-col w-full items-center justify-center bg-gradient-to-b from-background-accent to-background pt-4 pb-10">
            <div className="flex flex-col md:flex-row items-center w-full gap-8 md:gap-12 lg:gap-16 px-6 md:px-16 lg:px-32 py-4">
                <div className="flex flex-col items-center md:items-start w-full md:w-auto md:shrink-0">
                    <h1 className="text-center text-3xl md:text-4xl font-bold mb-6 background-primary">Our Executive Board</h1>
                    <div className="flex flex-col gap-2 items-center w-full">
                        <p className="text-center text-2xl md:text-3xl font-bold text-text-secondary">
                            {selected.name}
                        </p>
                        <p className="text-center md:text-lg font-semibold text-foreground-primary">
                            {selected.role}
                        </p>
                        <p className="text-sm text-center text-background-tertiary mt-2">
                            {selected.description ?? ""}
                        </p>
                    </div>
                </div>
                <div className="w-full min-w-0">
                    <Carousel
                        opts={{
                            loop: true,
                            skipSnaps: false,
                        }}
                        setApi={setEmblaApi}
                    >
                        <CarouselContent className="py-8 -mx-2 md:-mx-3">
                            {EBoard.map((item, index) => (
                                <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-5/12 px-2 md:px-3">
                                    {/* TODO: not centered in mobile view... not sure why */}
                                    <div className={`transition-all duration-300 transform ${index === selectedIndex ? 'scale-100 opacity-100' : 'scale-75 md:scale-85 opacity-60 md:opacity-75'}`}>
                                        <Card className="p-3 max-w-xs">
                                            <CardContent className="flex flex-col aspect-[3/4] gap-3 items-center justify-center">
                                                <ImageWithLoader
                                                    src={item.imgURL}
                                                    alt={`${item.name} headshot`}
                                                    wrapperClassName="rounded-full w-full aspect-square overflow-hidden"
                                                    className="h-full w-full object-cover"
                                                />
                                                <p className="font-bold text-lg text-text-secondary text-center">
                                                    {item.name}
                                                </p>
                                                {item.linkedin &&
                                                    <Link
                                                        to={`https://www.linkedin.com/in/${item.linkedin}/`}
                                                        rel='noopener noreferrer'
                                                        target='_blank'
                                                    >
                                                        <Linkedin
                                                            className='w-full text-muted-foreground hover:text-primary'
                                                        />
                                                    </Link>
                                                }
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 md:-left-10 bg-background/80 border-border cursor-pointer enabled:cursor-pointer" />
                        <CarouselNext className="right-2 md:-right-10 bg-background/80 border-border cursor-pointer enabled:cursor-pointer" />
                        <CarouselDots ringClass="border-primary" activeClass="bg-primary" />
                    </Carousel>
                </div>
            </div>
        </section>
    )
};

export default OrgAbout;