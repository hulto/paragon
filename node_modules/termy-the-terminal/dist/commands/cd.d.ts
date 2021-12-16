import { AutoCompleteResponse, CommandResponse, FileSystem } from '../index';
/**
 * Given a file system, validates if changing directories from a given path
 * to a new path is possible, and returns the new path if so.
 *
 * @param fileSystem {object} - filesystem to cd upon
 * @param currentPath {string} - current path within filesystem
 * @param targetPath  {string} - path to change to
 * @returns Promise<object> - resolves with new path if successful, rejects if not
 */
declare function cd(fileSystem: FileSystem, currentPath: string, targetPath: string): Promise<CommandResponse>;
/**
 * Given a fileysystem, current path, and target, list the items in the desired
 * folder that start with target string
 *
 * @param fileSystem {object} - filesystem to ls upon
 * @param currentPath {string} - current path within filesystem
 * @param target {string} - string to match against (maybe be path)
 * @returns Promise<object> - resolves with contents that match target in path
 */
declare function cdAutoComplete(fileSystem: FileSystem, currentPath: string, target: string): Promise<AutoCompleteResponse>;
declare const _default: {
    autoCompleteHandler: typeof cdAutoComplete;
    description: string;
    handler: typeof cd;
};
export default _default;
