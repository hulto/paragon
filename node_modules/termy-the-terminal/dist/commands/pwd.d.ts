import { AutoCompleteResponse, CommandResponse, FileSystem } from '../index';
/**
 * Returns current directory
 *
 * @returns Promise<object> - resolves with current directory
 */
declare function pwd(_f: FileSystem, currentPath: string): Promise<CommandResponse>;
/**
 * Do nothing for pwd autocomplete
 */
declare function pwdAutoComplete(_fileSystem: FileSystem, _currentPath: string, _target: string): Promise<AutoCompleteResponse>;
declare const _default: {
    autoCompleteHandler: typeof pwdAutoComplete;
    description: string;
    handler: typeof pwd;
};
export default _default;
