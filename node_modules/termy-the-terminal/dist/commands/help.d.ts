import { AutoCompleteResponse, CommandResponse, FileSystem } from '../index';
/**
 * Returns help menu for system commands
 *
 * @returns Promise<object> - resolves with list of system commands
 */
declare function help(): Promise<CommandResponse>;
/**
 * Do nothing for pwd autocomplete
 */
declare function helpAutoComplete(_fileSystem: FileSystem, _currentPath: string, _target: string): Promise<AutoCompleteResponse>;
declare const _default: {
    autoCompleteHandler: typeof helpAutoComplete;
    description: string;
    handler: typeof help;
};
export default _default;
