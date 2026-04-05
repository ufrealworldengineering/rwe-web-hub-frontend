import LogoMarquee from "@/components/logo-marquee";

const Sponsors = () => {
    return (
        <section className="space-y-4 pt-10 md:pt-14 bg-background">
            <h1 className="text-3xl font-serif text-text-primary">Sponsors</h1>
            <p className="max-w-2xl text-foreground-secondary">
                Sponsors...
            </p>
            <LogoMarquee />
        </section>
    );
}

export default Sponsors;
