"use client";

import { useTheme } from 'next-themes';
import { Button } from './ui/button';

const ThemeButtonsChanger = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-4 mt-2">
        <Button className="bg-white text-primary-900 border-2 border-primary-900 dark:border-white hover:bg-opacity-70 hover:bg-white flex items-center gap-2" type="submit" onClick={() => {
            setTheme('light');
        }}>
            <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5">
                <path d="M25.6299 2.8446V5.3446M25.6299 45.3446V47.8446M5.62988 25.3446H3.12988M11.4152 11.1299L9.37988 9.0946M39.8446 11.1299L41.8799 9.0946M11.4152 39.5696L9.37988 41.5949M39.8446 39.5696L41.8799 41.5949M48.1299 25.3446H45.6299M35.6299 25.3446C35.6299 30.8674 31.1526 35.3446 25.6299 35.3446C20.107 35.3446 15.6299 30.8674 15.6299 25.3446C15.6299 19.8218 20.107 15.3446 25.6299 15.3446C31.1526 15.3446 35.6299 19.8218 35.6299 25.3446Z" stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Claro
        </Button>
    
        <Button className="bg-primary-900 text-white hover:bg-opacity-90 hover:bg-primary-900 flex items-center gap-2 dark:bg-dark-800" type="submit" onClick={() => {
            setTheme('dark');
        }}>
            <svg width="49" height="50" viewBox="0 0 49 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5">
                <path d="M2.96191 24.153C2.96191 36.5795 13.0355 46.653 25.4619 46.653C34.9299 46.653 43.0319 40.805 46.3531 32.5243C43.7616 33.5658 40.9259 34.1528 37.9619 34.1528C25.5354 34.1528 15.4619 24.0793 15.4619 11.6528C15.4619 8.70272 16.0403 5.85074 17.0725 3.26917C8.80126 6.59497 2.96191 14.6921 2.96191 24.153Z" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Escuro
        </Button>
    </div>
  );
};

export default ThemeButtonsChanger;