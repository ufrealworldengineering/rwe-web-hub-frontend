import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

const About = () => {
  const teams = [
    {
      name: "General",
      description: "Description.....",
      members: [
        { name: "First Last", role: "role", about: "about me info here..." },
        { name: "First Last", role: "role", about: "about me info here..." },
        { name: "First Last", role: "role", about: "about me info here..." },
      ],
    },
    {
      name: "Web Development",
      description: "Description.....",
      members: [
        { name: "John Smith", role: "role", about: "hello!" },
        { name: "First Last", role: "role", about: "about me info here..." },
        { name: "First Last", role: "role", about: "about me info here..." },
      ],
    },
    {
      name: "E-Bike",
      description: "Description.....",
      members: [
        { name: "First Last", role: "role", about: "about me info here..." },
        { name: "First Last", role: "role", about: "about me info here..." },
        { name: "First Last", role: "role", about: "about me info here..." },
      ],
    },
    {
      name: "Robot Arm",
      description: "Description.....",
      members: [
        { name: "First Last", role: "role", about: "about me info here..." },
        { name: "First Last", role: "role", about: "about me info here..." },
        { name: "First Last", role: "role", about: "about me info here..." },
      ],
    },
  ];
  const [currTeam, setCurrTeam] = useState(teams[0]);

  return (
    <section className="space-y-4 p-16">
      <div className="flex flex-col md:flex-row items-center md:gap-16 gap-8 mb-16">
        <h1 className="text-6xl font-black font-serif text-text-primary">
          ABOUT
        </h1>
        <p className="text-3xl font-black font-serif text-text-secondary text-center">
          mission statement
        </p>
      </div>
      <Card className="flex mx-auto flex-col w-min md:w-full md:flex-row justify-center gap-20 mb-16 p-4">
        {teams.map((team) => (
          <button
            key={team.name}
            className={`flex-1 max-w-2x ${
              currTeam.name === team.name
                ? "font-bold text-text-primary"
                : "font-normal text-text-secondary"
            }`}
            onClick={() => setCurrTeam(team)}
          >
            {team.name}
          </button>
        ))}
      </Card>
      <p className="mb-16">{currTeam.description}</p>
      <div className="flex justify-center mb-16">
        <p className="text-3xl font-black text-text-secondary">
          Meet Our Executive Board
        </p>
      </div>
      <div className="flex flex-col items-center lg:flex-row lg:justify-center gap-16">
        {currTeam.members.map((member, index) => (
          <Card className="min-w-56 max-w-100" key={index}>
            <CardHeader>
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>{member.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-8">{member.about}</p>
              <div className="aspect-square bg-black"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default About;
