"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = {
  value: string;
  name: string;
  className?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
};

const PasswordInput = ({ value, name, onChange, placeholder, className }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const disabled = value === "" ? true : false;

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("hide-password-toggle pr-10", className)}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        className="absolute top-0 right-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword && !disabled ? (
          <EyeIcon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
      </Button>

      <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
    </div>
  );
};

export { PasswordInput };