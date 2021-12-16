import React from 'react';
import { Command } from '..';
declare type CommandList = {
    [key: string]: Command;
};
declare const TerminalContext: React.Context<CommandList>;
export default TerminalContext;
