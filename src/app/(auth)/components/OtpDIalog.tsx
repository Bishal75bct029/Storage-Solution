"use client";

import { sendEmailOtp, verifySecret } from "@/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type OtpDialogProps = {
  email: string;
  accountId: string | null;
  setAccountId: (value: string) => void;
  openDialog?: boolean;
  setOpenDialog: (value: boolean) => void;
};

const OtpDialog: React.FC<OtpDialogProps> = ({ openDialog = false, setOpenDialog, accountId, email }) => {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ code?: number; message?: string }>({});

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError({ code: undefined, message: undefined });

    try {
      if (accountId) {
        const sessionId = await verifySecret(accountId, otp);
        if (sessionId) router.push("/");
        setOpenDialog(false);
      }
    } catch {
      setError({ code: 401, message: "Invalid OTP." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    await sendEmailOtp(email);
  };

  return (
    <Dialog open={openDialog}>
      <DialogContent className="flex w-full min-w-[30rem] flex-col items-center gap-6 p-8">
        <DialogHeader>
          <DialogTitle className="h1 text-center">Enter OTP</DialogTitle>
          <DialogDescription className="body2 text-center">
            We have sent a code to {email ?? "blamichhane.gmail.com"}
          </DialogDescription>
        </DialogHeader>
        <InputOTP maxLength={6} className="w-full" value={otp} onChange={setOtp}>
          <InputOTPGroup className={cn("flex justify-between gap-3", error?.code === 401 && "shake")}>
            <InputOTPSlot index={0} className={cn(error.code === 401 && "!border-error border")} />
            <InputOTPSlot index={1} className={cn(error.code === 401 && "!border-error border")} />
            <InputOTPSlot index={2} className={cn(error.code === 401 && "!border-error border")} />
            <InputOTPSlot index={3} className={cn(error.code === 401 && "!border-error border")} />
            <InputOTPSlot index={4} className={cn(error.code === 401 && "!border-error border")} />
            <InputOTPSlot index={5} className={cn(error.code === 401 && "!border-error border")} />
          </InputOTPGroup>
        </InputOTP>
        <Button onClick={handleSubmit} className="w-full rounded-full" disabled={otp.length !== 6 || isLoading}>
          Submit
          {isLoading && (
            <Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="ml-2 animate-spin" />
          )}
        </Button>
        <div className="body2">
          {"Didn't get a code?"}{" "}
          <div
            onClick={handleResendOtp}
            className="text-light-orange cursor-pointer hover:opacity-80 active:opacity-100"
          >
            Click here to send.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpDialog;
