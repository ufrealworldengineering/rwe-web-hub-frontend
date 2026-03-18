import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselDots
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay";
import type { UseEmblaCarouselType } from "embla-carousel-react";

type CarouselApi = UseEmblaCarouselType[1];

type Team = {
    id: string
    name: string
    description: string
    images: string[]
}

const teams: Team[] = [
    {
        id: "robot_arm",
        name: "Robot Arm Team",
        description:
            `Developing a desktop-scale, open source 3D printing robotic arm that serves as an alternative to conventional 3D printers that move along straight X-Y-Z axes. By positioning the printhead with a multi-axis arm rather than stacked linear rails, the system enables non-planar printing, allowing material to be deposited along curved surfaces and continuously varying orientations.`,
        images: [
            "https://via.placeholder.com/800x600?text=Controls+1"
        ],
    },
    {
        id: "ebike",
        name: "EBike Team",
        description:
            "The Perception Team focuses on computer vision and sensor fusion. They develop algorithms to detect and track objects, process lidar and camera data, and enable the system to 'see' the world.",
        images: [
            "https://via.placeholder.com/800x600?text=Perception+1"
        ],
    },
    {
        id: "drone",
        name: "Drone Team",
        description:
            "The Mechanical Team handles CAD, fabrication, and structural design. They create 3D models, run simulations, and assemble prototypes for testing and competition.",
        images: [
            "https://via.placeholder.com/800x600?text=Mechanical+1"
        ],
    },
    {
        id: "web_dev",
        name: "Web Development Team",
        description:
            "The Mechanical Team handles CAD, fabrication, and structural design. They create 3D models, run simulations, and assemble prototypes for testing and competition.",
        images: [
            "https://via.placeholder.com/800x600?text=Mechanical+1"
        ],
    },
    {
        id: "smart_glasses",
        name: "Smart Glasses Team",
        description:
            "The Mechanical Team handles CAD, fabrication, and structural design. They create 3D models, run simulations, and assemble prototypes for testing and competition.",
        images: [
            "https://via.placeholder.com/800x600?text=Mechanical+1"
        ],
    },
];

const TeamAbout = () => {
    const [api, setApi] = React.useState<CarouselApi>();
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        if (!api) return;
        const onSelect = () => setCurrentIndex(api.selectedScrollSnap());
        api.on("select", onSelect);
        return () => { api.off("select", onSelect); };
    }, [api]);

    const currentTeam = teams[currentIndex];

    return (
        <section className="flex flex-col w-full items-center justify-center bg-background-accent-secondary py-4">
            <div className="flex flex-col md:flex-row items-stretch w-full gap-8 md:gap-12 lg:gap-16 px-6 md:px-16 lg:px-32">
                <div className="w-full md:flex-1 min-w-0">
                    <Carousel
                        setApi={setApi}
                        opts={{
                            loop: true,
                        }}
                        plugins={[Autoplay({ delay: 4000 })]}
                    >
                        <CarouselContent className="py-8">
                            {teams.map((team) => (
                                <CarouselItem key={team.id}>
                                    <Card className="p-4">
                                        <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden rounded-md">
                                            <img
                                                src={team.images[0]}
                                                alt={team.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselDots ringClass="border-background-accent" activeClass="bg-background-accent"/>
                    </Carousel>
                </div>
                <div className="w-full md:flex-1 min-w-0 flex flex-col justify-center gap-3 py-4 md:py-8 overflow-hidden">
                    <h2 className="text-xl sm:text-2xl font-bold text-accent-foreground shrink-0">{currentTeam.name}</h2>
                    <p className="text-base sm:text-lg font-semibold text-accent-foreground overflow-y-auto whitespace-pre-line">
                        {currentTeam.description}
                    </p>
                </div>
            </div>
        </section>
    )
};

export default TeamAbout;