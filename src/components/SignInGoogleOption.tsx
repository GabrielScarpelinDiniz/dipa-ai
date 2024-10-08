
import { signIn } from "@/auth"
import { Button } from "./ui/button"
 
export default function SignInGoogle() {
  return (
    <form action={async (data: FormData) => {
        "use server";
        await signIn("google", { redirectTo: "/dashboard" });
    }}>
        <Button type="submit" className="bg-primary-900 gap-4 py-5 hover:bg-primary-800 transition-all text-white">
            <svg width={24} viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M55.4776 100.049C62.5485 77.0869 84.7948 56.1372 112.121 50.4029C134.099 45.7431 158.899 50.7875 177.137 67.8529C179.562 65.4793 210.704 35.0726 213.04 32.599C150.73 -23.8318 50.9594 -3.981 13.6268 68.8905L55.4776 100.049Z" fill="#E54335"/>
                <path d="M55.3626 149.42C55.4137 149.383 55.4521 149.036 55.4904 149.011C50.0022 133.42 50.0022 112.542 55.4904 100.049H55.4776L13.6268 68.8905H13.614C13.614 68.8905 13.6269 68.8935 13.5503 69.0309C-4.91818 104.823 -4.1524 146.998 13.6779 181.079C13.6269 181.117 13.5886 181.139 13.5503 181.177L55.3626 149.42Z" fill="#F6B704"/>
                <path d="M171.687 188.812C171.687 188.812 171.662 188.886 171.636 188.873C153.87 200.604 130.424 203.266 113.015 199.768C85.7267 194.346 64.131 174.556 55.3626 149.42L13.5503 181.177C29.7086 212.534 59.1152 236.583 94.5461 245.74C132.185 255.609 180.085 248.864 212.172 219.843L171.687 188.812Z" fill="#34A353"/>
                <path d="M247.769 100.049H127.641C127.641 112.542 127.641 137.526 127.565 150.018H197.176C194.508 162.511 185.05 180.005 171.687 188.812L212.172 219.843L212.211 219.879C239.397 195.393 256.321 153.681 247.769 100.049Z" fill="#4280EF"/>
            </svg>
            Entrar com o google
        </Button>
    </form>
  )
} 