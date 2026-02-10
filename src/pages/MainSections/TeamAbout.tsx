import React, { useEffect, useState } from "react"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselDots
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay";

type Team = {
    id: string
    name: string
    description: string
    images: string[]
}

const teams: Team[] = [
    {
        id: "controls",
        name: "Controls Team",
        description:
            "The Controls Team builds embedded and control systems for our projects. They design control loops, tune PID parameters, and write firmware to integrate sensors and actuators. They collaborate closely with hardware and software groups to make prototypes robust.",
        images: [
            "https://via.placeholder.com/800x600?text=Controls+1",
            "https://via.placeholder.com/800x600?text=Controls+2",
            "https://via.placeholder.com/800x600?text=Controls+3",
        ],
    },
    {
        id: "perception",
        name: "Perception Team",
        description:
            "The Perception Team focuses on computer vision and sensor fusion. They develop algorithms to detect and track objects, process lidar and camera data, and enable the system to 'see' the world.",
        images: [
            "https://via.placeholder.com/800x600?text=Perception+1",
            "https://via.placeholder.com/800x600?text=Perception+2",
            "https://via.placeholder.com/800x600?text=Perception+3",
        ],
    },
    {
        id: "mechanical",
        name: "Mechanical Team",
        description:
            "The Mechanical Team handles CAD, fabrication, and structural design. They create 3D models, run simulations, and assemble prototypes for testing and competition.",
        images: [
            "https://via.placeholder.com/800x600?text=Mechanical+1",
            "https://via.placeholder.com/800x600?text=Mechanical+2",
            "https://via.placeholder.com/800x600?text=Mechanical+3",
        ],
    },
]

const TeamAbout = () => {
    return (
        <section className="flex flex-col w-full items-center justify-center bg-background-accent-secondary py-4">
            <div className="flex flex-row items-center justify-between w-full gap-24 px-32">
                <Carousel
                    opts={{
                        loop: true,
                    }}
                    plugins={[Autoplay({ delay: 4000 })]}
                >
                    <CarouselContent className="py-8">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index}>
                                <div>
                                    <Card className="p-4">
                                        <CardContent className="flex aspect-video items-center justify-center p-6">
                                            <span className="text-4xl font-semibold">{index + 1}</span>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselDots ringClass="border-background-accent" activeClass="bg-background-accent"/>
                </Carousel>
                <p className="text-lg font-semibold text-accent-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>
        </section>
    )
};

export default TeamAbout;