import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselDots
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

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
        name: "Brady Carrington",
        role: "President",
        imgURL: stockHeadshot,
        description: "Previous @ ",
        linkedin: "brady-carrington"
    },
    {
        name: "Allario Carni",
        role: "Vice-President",
        imgURL: stockHeadshot,
        description: "Desc...",
        linkedin: "brady-carrington"
    },
    {
        name: "Grant Sherman",
        role: "Robot Arm Program Manager",
        imgURL: stockHeadshot,
        description: "Previous @ ",
        linkedin: "brady-carrington"
    },
    {
        name: "Alina Garib",
        role: "SWE Program Manager",
        imgURL: stockHeadshot,
        description: "Desc...",
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
            <div className="flex flex-row items-center justify-between w-full gap-24 px-32">
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-bold ">Meet Our Executive Board</h1>
                    <p className="text-medium text-accent-foreground mb-4">
                        <span className="block font-semibold text-text-secondary">
                            {selected.name}
                        </span>
                        <span className="block text-sm text-foreground-secondary">
                            {selected.role}
                        </span>
                        <span className="block mt-2 text-sm text-foreground-tertiary">
                            {selected.description ?? "—"}
                        </span>
                    </p>
                    <p className="text-medium text-accent-foreground">.</p>
                </div>
                <Carousel
                    opts={{
                        loop: true,
                    }}
                    setApi={setEmblaApi}
                >
                    <CarouselContent className="py-8">
                        {/* TODO: modify carousel card sizes to be smaller if not the current card */}
                        {EBoard.map((item, index) => (
                            <CarouselItem key={index} className="basis-1/3">
                                <Card className="p-4">
                                    <CardContent className="flex flex-col aspect-[3/4] gap-3 items-center justify-center">
                                        <div
                                            className="rounded-full w-full aspect-square bg-cover bg-center"
                                            style={{ backgroundImage: `url(${item.imgURL})` }}
                                            role="img"
                                            aria-label={`${item.name} headshot`}
                                        />
                                        <p className="font-bold text-lg text-text-secondary">
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
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselDots ringClass="border-background-accent-secondary" activeClass="bg-background-accent-secondary" />
                </Carousel>
            </div>
        </section>
    )
};

export default OrgAbout;