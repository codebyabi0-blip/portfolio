import Approach from "@/components/Approach"
import Clients from "@/components/client"
import Experience from "@/components/experience"
import Footer from "@/components/footer"
import Grid from "@/components/grid"
import Hero from "@/components/hero"
import RecentProjects from "@/components/recent-projects"
import { BentoGrid } from "@/components/ui/bento-grid"
import { FloatingNav } from "@/components/ui/floating-navbar"
import { navItems } from "@/data"
import { FaHome } from "react-icons/fa"


const home = () => {
  return (
    <main  className="relative bg-[#000319] w-full  text-white flex justify-center items-center flex-col overflow-hidden mx-auto sm-px-10 px-5"
    >
     <div className="max-w-7xl w-full">
      <FloatingNav navItems={navItems} className=""/>
      <Hero/>
      <Grid/>
      <RecentProjects/>
      <Clients/>
      <Experience/>
      <Approach/>
      <Footer/>
      </div> 
    </main>
  )
}

export default home