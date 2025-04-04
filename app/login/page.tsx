import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";


export default function Home() {
    return (
        <div className={"flex bg-[#F6F1EB] justify-center items-center h-screen"}>
            <Card className={" w-[20%] h-[50%]  "}>
                <CardHeader>
                    <img src={"/assets/images/logo.png"} alt={"logo"} />
                </CardHeader>
                <CardContent >
                    <form className={"space-y-3"}>
                    <Input placeholder={"Email"}/>
                    <Input placeholder={"Password"}/>
                        <div className={"flex justify-center"}><Link href={"/forgotpass"} className={"text-sm text-blue-500"} >Forget password?</Link>
                        </div>
                        <Button className={"w-full"}>Login</Button>

                    </form>
                    <div className={"flex justify-center mt-2 text-sm"}><p className={"text-sm"}>Not Registered yet? <Link href={"/signup"} className={"text-blue-500 text-sm"}>Sign up!</Link> Now!</p></div>
                </CardContent>

            </Card>

        </div>
    )
}
