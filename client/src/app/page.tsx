import Image from "next/image";
import ProjectHeader from "./projects/ProjectHeader";
import Project from "./projects/[id]/page";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <Project params={{id:"1"}} />
    </main>
  );
}
