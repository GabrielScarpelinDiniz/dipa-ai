"use client";
import React, { useEffect } from 'react';
import * as Slider from '@radix-ui/react-slider';


const SliderDemo = () => {
  const [value, setValue] = React.useState(50);
  useEffect(() => {
    console.log(value);
  }, [value]);
  return (
  <form>
    <Slider.Root className="SliderRoot relative flex items-center select-none w-[200px] touch-none h-5" defaultValue={[50]} inverted max={100} step={1} onChange={(props) => {
        const target = props.target as HTMLInputElement;
        setValue(parseInt(target.value));
    } }>
      <Slider.Track className="bg-primary-800 dark:bg-primary-600 relative flex-grow rounded-full h-2 w-full">
        <Slider.Range className="absolute bg-white rounded-full h-full" />
      </Slider.Track>
      <Slider.Thumb className="block w-4 h-4 bg-dark-900 dark:bg-white shadow-md rounded-full hover:bg-primary-800 dark:hover:bg-primary-700 focus:shadow-md " aria-label="Volume" />
    </Slider.Root>
  </form>
)};

export default SliderDemo;