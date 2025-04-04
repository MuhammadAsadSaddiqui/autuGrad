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
            <Card className={" w-[20%] h-[55%]  "}>
                <CardHeader>
                    <img src={"/assets/images/logo.png"} alt={"logo"} className={"h-12 mx-auto"}/>
                </CardHeader>
                <CardContent >
                    <form className={"space-y-2"}>
                        <Input placeholder={"Enter Full Name"}/>
                        <Input placeholder={"Enter your Email"}/>
                        <Input placeholder={"Enter Password"}/>
                        <Input placeholder={"Confirm Password"}/>
                        <Button className={"w-full mt-2"}>Signup</Button>
                            <div className={"flex justify-center mt-2 text-sm"}><p className={"text-sm"}>Already have an account? <Link href={"/login"} className={"text-blue-500 text-sm"}>Sign in!</Link> Now!</p></div>


                    </form>

                </CardContent>

            </Card>

        </div>
    )
}
