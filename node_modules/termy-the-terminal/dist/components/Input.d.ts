import React, { ChangeEvent, FormEvent, KeyboardEvent, RefObject } from 'react';
interface InputProps {
    currentPath: string;
    inputValue: string;
    inputPrompt: string;
    handleChange?(event: ChangeEvent<HTMLInputElement>): void;
    handleKeyDown?(event: KeyboardEvent<HTMLInputElement>): void;
    handleKeyUp?(event: KeyboardEvent<HTMLInputElement>): void;
    handleSubmit?(event: FormEvent<HTMLFormElement>): void;
    readOnly: boolean;
    ref?: RefObject<HTMLInputElement>;
}
export declare const Input: React.FC<InputProps>;
export default Input;
