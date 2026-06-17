"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormField from "@/components/FormField";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "@firebase/auth";
import {auth} from "@/firebase/client";
import {signIn, signUp} from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(6, "Password must be at least 6 characters"),
    });
};

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();

    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            if (type === "sign-up") {
                const { name, email, password } = data;

                try {
                    const userCredential = await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                    const result = await signUp({
                        uid: userCredential.user.uid,
                        name: name!,
                        email,
                        password,
                    });

                    if (!result.success) {
                        toast.error(result.message);
                        return;
                    }

                    const idToken = await userCredential.user.getIdToken();
                    const signInResult = await signIn({ email, idToken });

                    if (!signInResult?.success) {
                        toast.error(
                            signInResult?.message ||
                                "Account created, but sign in failed. Please sign in manually."
                        );
                        router.push("/sign-in");
                        return;
                    }

                    toast.success("Account created successfully.");
                    router.push("/");
                } catch (error: any) {
                    if (error?.code) {
                        const firebaseErrorMessage = getFirebaseErrorMessage(error.code);
                        toast.error(firebaseErrorMessage);
                    } else {
                        toast.error("An unexpected error occurred. Please try again.");
                    }
                    console.error("Sign up error:", error);
                }
            } else {
                try {
                    const { email, password } = data;

                    const userCredential = await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                    const idToken = await userCredential.user.getIdToken();
                    if (!idToken) {
                        toast.error("Sign in Failed. Please try again.");
                        return;
                    }

                    const signInResult = await signIn({
                        email,
                        idToken,
                    });

                    if (!signInResult?.success) {
                        toast.error(
                            signInResult?.message ||
                                "Sign in failed. Please try again."
                        );
                        return;
                    }

                    toast.success("Signed in successfully.");
                    router.push("/");
                } catch (error: any) {
                    if (error?.code) {
                        const firebaseErrorMessage = getFirebaseErrorMessage(error.code);
                        toast.error(firebaseErrorMessage);
                    } else {
                        toast.error("An unexpected error occurred. Please try again.");
                    }
                    console.error("Sign in error:", error);
                }
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    function getFirebaseErrorMessage(code: string): string {
        const errorMessages: { [key: string]: string } = {
            "auth/email-already-in-use": "This email is already registered. Please sign in or use a different email.",
            "auth/weak-password": "Password is too weak. Please use a stronger password (at least 6 characters).",
            "auth/invalid-email": "Please enter a valid email address.",
            "auth/invalid-credential":
                "Invalid email or password. Please check your credentials and try again.",
            "auth/invalid-login-credentials":
                "Invalid email or password. Please check your credentials and try again.",
            "auth/too-many-requests": "Too many failed attempts. Please try again later.",
            "auth/operation-not-allowed": "This operation is not allowed. Please contact support.",
            "auth/network-request-failed": "Network error. Please check your internet connection and try again.",
        };
        return errorMessages[code] || "An error occurred during authentication. Please try again.";
    }

    const isSignIn = type === "sign-in";

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className="text-primary-100">VoiceHire</h2>
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