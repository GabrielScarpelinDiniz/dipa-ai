import { Button } from "./ui/button";
import { Input } from "./ui/input";


export default function SignInEmail() {
    return (
        <form>
            <div className="flex flex-col gap-4">
                <Input type="email" placeholder="E-mail" />
                <Button type="submit" className="bg-primary-900 py-5">
                    Entrar
                </Button>
            </div>
        </form>
    )
}