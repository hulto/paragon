import { Component } from 'react';
import './styles/Terminal.scss';
export * as utilities from './commands/utilities';
export { default as autoComplete } from './commands/autoComplete';
export interface TerminalState {
    autoCompleteIsActive: boolean;
    autoCompleteActiveItem: number;
    currentCommandId: number;
    currentHistoryId: number;
    currentPath: string;
    fileSystem: FileSystem;
    history: HistoryItem[];
    inputPrompt: string;
    inputValue: string;
    autoCompleteItems?: ItemListType;
}
export interface HistoryItem {
    input: JSX.Element;
    id: number;
    result: CommandResponse['commandResult'];
    value: string;
}
export interface CommandHandler {
    (fileSystem?: FileSystem, currentPath?: string, targetPath?: string, options?: string): Promise<CommandResponse>;
}
export interface CommandAutoCompleteHandler {
    (fileSystem: FileSystem, currentPath: string, target: string): Promise<AutoCompleteResponse>;
}
export interface Command {
    autoCompleteHandler?: CommandAutoCompleteHandler;
    description?: string;
    handler: CommandHandler;
}
export interface TerminalProps {
    fileSystem: FileSystem;
    inputPrompt?: string;
    customCommands?: {
        [key: string]: Command;
    };
}
export interface FileSystem {
    [key: string]: TerminalFolder | TerminalFile;
}
export declare type TerminalFile = TerminalTextFile | TerminalImageFile;
export interface TerminalTextFile {
    [key: string]: 'FILE' | string | JSX.Element;
    type: 'FILE';
    content: string | JSX.Element;
    extension: 'txt';
}
export interface TerminalImageFile {
    [key: string]: 'FILE' | string;
    type: 'FILE';
    content: string;
    extension: 'jpg' | 'png' | 'gif';
}
export interface TerminalFolder {
    [key: string]: 'FOLDER' | FileSystem | null;
    type: 'FOLDER';
    children: FileSystem | null;
}
export declare type CommandResponse = {
    updatedState?: Partial<TerminalState>;
    commandResult?: JSX.Element | string;
};
export interface ItemListType {
    [index: string]: {
        type: 'FOLDER' | 'FILE';
    };
}
export declare type AutoCompleteResponse = {
    commandResult?: ItemListType | null;
};
export declare class Terminal extends Component<TerminalProps, TerminalState> {
    readonly state: TerminalState;
    private inputWrapper;
    private terminalInput;
    componentDidMount(): void;
    componentDidUpdate(): void;
    private handleChange;
    private handleKeyDown;
    private handleSubmit;
    render(): JSX.Element;
}
