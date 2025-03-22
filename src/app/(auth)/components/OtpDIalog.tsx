"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

type OtpDialogProps = {
  open?: boolean;
  handleOtpClose?: () => void;
  email: string;
};

const OtpDialog: React.FC<OtpDialogProps> = ({ open = false, email, handleOtpClose }) => {
  const [otp, setOtp] = useState("");

  console.log(otp, "here is otp");

  return (
    <Dialog open={true}>
      <DialogContent className="flex w-full min-w-[30rem] flex-col items-center gap-6 p-8">
        <DialogHeader>
          <DialogTitle className="h1 text-center">Enter OTP</DialogTitle>
          <DialogDescription className="body2 text-center">
            We have sent a code to {email ?? "blamichhane.gmail.com"}
          </DialogDescription>
        </DialogHeader>
        <InputOTP maxLength={6} className="w-full" value={otp} onChange={setOtp}>
          <InputOTPGroup className={cn("flex justify-between gap-3", otp.length === 6 && "shake")}>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button className="w-full rounded-full" disabled={otp.length !== 6}>
          Submit
        </Button>
        <div className="body2">
          {"Didn't get a code?"}{" "}
          <Link href={"/sign-in"} className="text-light-orange">
            Click here to send.
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpDialog;
