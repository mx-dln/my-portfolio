import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-black text-[#343b32]"
                                >
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="h-13 rounded-2xl border-[#151614]/15 bg-[#f8f9f6] px-4 font-semibold focus-visible:border-[#151614] focus-visible:ring-[#c6ff4a]/45"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-black text-[#343b32]"
                                    >
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm font-black text-[#119f92] no-underline hover:text-[#151614]"
                                            tabIndex={5}
                                        >
                                            Forgot your password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="h-13 rounded-2xl border-[#151614]/15 bg-[#f8f9f6] px-4 font-semibold focus-visible:border-[#151614] focus-visible:ring-[#c6ff4a]/45"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-[#151614]/25 data-[state=checked]:border-[#151614] data-[state=checked]:bg-[#151614]"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm font-bold text-[#4d554c]"
                                >
                                    Remember this browser
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-13 w-full rounded-full bg-[#151614] text-sm font-black text-white shadow-[6px_6px_0_#c6ff4a] transition hover:-translate-y-0.5 hover:bg-[#151614]"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 rounded-2xl bg-[#eaffb8] px-4 py-3 text-center text-sm font-black text-[#343b32]">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Welcome back',
    description:
        'Access the private studio for portfolio projects and site content.',
};
