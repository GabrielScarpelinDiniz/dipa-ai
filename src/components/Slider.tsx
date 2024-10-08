"use client";
import React, { useEffect } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Button } from './ui/button';


const SliderDemo = () => {
  return (
  <form>
    <div className="flex w-80 gap-3 mt-4 items-center">
      <h3>0,0</h3>
      <Slider.Root className="SliderRoot relative flex items-center select-none w-[200px] touch-none h-5" defaultValue={[100]}  inverted max={100} step={1}>
        <Slider.Track className="bg-primary-800 dark:bg-primary-600 relative flex-grow rounded-full h-2 w-full">
          <Slider.Range className="absolute bg-white rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-4 h-4 bg-dark-900 dark:bg-white shadow-md rounded-full hover:bg-primary-800 dark:hover:bg-primary-700 focus:shadow-md " aria-label="Volume" />
      </Slider.Root>
      <h3>1,0</h3>
      <Button type="submit" className="bg-primary-800 hover:bg-primary-800 hover:opacity-90 dark:bg-primary-700 dark:text-white">Salvar</Button>
    </div>
    
  </form>
)};

export default SliderDemo;