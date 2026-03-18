import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselDots
} from "@/components/ui/carousel"

// import Autoplay from "embla-carousel-autoplay";
// import useEmblaCarousel from "embla-carousel-react";

import { Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

import stockHeadshot from '@/assets/headshots/stock-headshot.jpg';

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
        imgURL: stockHeadshot,
        description: "Previous Intern...",
        linkedin: "brady-carrington"
    },
    {
        name: "Ian Towns",
        role: "Vice President",
        imgURL: stockHeadshot,
        description: "Desc...",
        linkedin: "brady-carrington"
    },
    {
        name: "Michael Smith",
        role: "Treasurer",
        imgURL: stockHeadshot,
        description: "Previous @ ",
        linkedin: "brady-carrington"
    },
    {
        name: "Michael Smith",
        role: "Treasurer",
        imgURL: stockHeadshot,
        description: "Previous @ ",
        linkedin: "brady-carrington"
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
        <section className="flex flex-col w-full items-center justify-center bg-background-accent py-4">
            <div className="flex flex-col md:flex-row items-center w-full gap-8 md:gap-12 lg:gap-16 px-6 md:px-16 lg:px-32 py-4">
                <div className="flex flex-col items-center md:items-start w-full md:w-auto md:shrink-0">
                    <h1 className="text-center text-3xl md:text-4xl font-bold mb-6 text-foreground-primary">Our Executive Board</h1>
                    <div className="flex flex-col gap-2 items-center w-full">
                        <p className="text-center text-2xl md:text-3xl font-bold text-text-secondary">
                            {selected.name}
                        </p>
                        <p className="text-center md:text-lg font-semibold text-foreground-primary">
                            {selected.role}
                        </p>
                        <p className="text-sm text-center text-background-tertiary mt-2">
                            {selected.description ?? "—"}
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
                                                <div
                                                    className="rounded-full w-full aspect-square bg-cover bg-center"
                                                    style={{ backgroundImage: `url(${item.imgURL})` }}
                                                    role="img"
                                                    aria-label={`${item.name} headshot`}
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
                        <CarouselDots ringClass="border-background-accent-secondary" activeClass="bg-background-accent-secondary" />
                    </Carousel>
                </div>
            </div>
        </section>
    )
};

export default OrgAbout;