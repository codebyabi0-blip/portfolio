import React from 'react'
import { Spotlightining } from './ui/spotlight' // Ensure this matches your filename exactly
import { cn } from "@/lib/utils";
import { TextGenerateEffect } from './ui/text-generate-effect';
import MagicButton from './ui/magic-button';
import { FaLocationArrow } from 'react-icons/fa';

const Hero = () => {
  return (
    <div className=' pt-18 relative ' id='hero' >
      {/* 1. Spotlight Section */}
      <div className='absolute inset-0 z-1 pointer-events-none '>
        <Spotlightining className='-top-40 -left-10 md:-left-32 md:-top-20 ' fill='white'/>
        <Spotlightining className='top-10 left-[80%] h-[80vh] w-[50vw]' fill='purple'/> 
        <Spotlightining className='top-28 left-80 h-[80vh] w-[50vw]' fill='blue'/>
      </div>

      {/* 2. Grid Background - Fixed positioning and height */}
      <div className="h-screen w-full dark:bg-[#000319] bg-white dark:bg-grid-white/[0.03] bg-grid-black/[0.2] flex items-center justify-center absolute top-0 left-0">
        {/* Radial mask for the faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-[#000319] bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      {/* 3. Content Section */}
      <div className="flex justify-center relative  z-10">
        {/* Increased max-width to md:max-w-5xl to keep heading on 2 lines */}
        <div className="max-w-[89vw] md:max-w-5xl lg:max-w-[70vw] flex flex-col items-center justify-center">
          
          {/* <h2 className='uppercase tracking-widest text-xs text-center text-blue-100 max-w-80'>
            Dynamic Web Magic With Next.js
          </h2> */}

          <TextGenerateEffect 
            className='text-center text-[40px] md:text-5xl lg:text-6xl leading-tight' 
            words='Transforming Concepts Into Seamless User Experiences'
          />

          <p className="text-center md:tracking-wider  text-sm md:text-lg lg:text-2xl mt-2">
            Hi, I&apos;m Abi, a Web & Mobile Developer based in Patiala.
          </p>

          {/* Added mt-10 and z-index to ensure button is visible and clickable */}
          <a href="#about" className=" relative z-20">
            <MagicButton 
              title="Show my work" 
              icon={<FaLocationArrow/>} 
              position='right'
            />
          </a>
          
        </div>
      </div>
    </div> 
  )
}

export default Hero;
