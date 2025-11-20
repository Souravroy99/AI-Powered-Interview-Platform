"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import Image from "next/image";
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signup } from "@/lib/actions/auth.action";

const authFormSchema = (type) => {
    return z.object({
        name: type === "sign-in" ? z.string().optional() : z.string().min(3),
        email: z.string().email(),
        password: z.string().min(3)
    });
};

const AuthForm = ({ type }) => {
    const router = useRouter();
    const formSchema = authFormSchema(type);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        },
    });

    async function onSubmit(values) {
        try {
            if (type === "sign-in") {
                const { email, password } = values;
                const userCredential = await signInWithEmailAndPassword(auth, email, password);

                const idToken = await userCredential.user.getIdToken();

                if (!idToken) {
                    toast.error("Sign in failed");
                    return;
                }

                await signIn({
                    email,
                    idToken
                });

                toast.success("Sign in successfully.");
                router.push("/");
            } else {
                const { name, email, password } = values;

                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

                const result = await signup({
                    uid: userCredentials.user.uid,
                    name,
                    email,
                    password,
                });

                if (!result?.success) {
                    toast.error(result?.message);
                    return;
                }

                toast.success("Account created successfully. Please sign in.");
                router.push("/sign-in");
            }
        } catch (error) {
            console.log(error);
            toast.error("Invalid Credentials! or Server Down!");
        }
    }

    const isSignIn = type === "sign-in";

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className="text-primary-100">AiView</h2>
                </div>

                <h3>Practice job interviews with AI</h3>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6 mt-4 form"
                    >
                        {!isSignIn && (
                            <FormField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder="Your Name"
                                type="text"
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Your email address"
                            type="email"
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                        />

                        <Button className="btn" type="submit">
                            {isSignIn ? "Sign In" : "Create an Account"}
                        </Button>
                    </form>
                </Form>

                <p className="text-center">
                    {isSignIn ? "No account yet?" : "Have an account already?"}
                    <Link
                        href={!isSignIn ? "/sign-in" : "/sign-up"}
                        className="font-bold text-user-primary ml-1"
                    >
                        {!isSignIn ? "Sign In" : "Sign Up"}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
