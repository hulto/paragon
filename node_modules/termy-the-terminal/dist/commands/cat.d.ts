import { AutoCompleteResponse, CommandResponse, FileSystem } from '../index';
/**
 * Given a file system, returns contents for a given file
 *
 * @param fileSystem {object} - filesystem to cat upon
 * @param currentPath {string} - current path within filesystem
 * @param targetPath  {string} - path of file to cat
 * @returns Promise<object> - resolves with contents of file
 */
declare function cat(fileSystem: FileSystem, currentPath: string, targetPath: string): Promise<CommandResponse>;
/**
 * Given a fileysystem, current path, and target, list the items in the desired
 * folder that start with target string
 *
 * @param fileSystem {object} - filesystem to ls upon
 * @param currentPath {string} - current path within filesystem
 * @param target {string} - string to match against (maybe be path)
 * @returns Promise<object> - resolves with contents that match target in path
 */
declare function catAutoComplete(fileSystem: FileSystem, currentPath: string, target: string): Promise<AutoCompleteResponse>;
declare const _default: {
    autoCompleteHandler: typeof catAutoComplete;
    description: string;
    handler: typeof cat;
};
export default _default;
