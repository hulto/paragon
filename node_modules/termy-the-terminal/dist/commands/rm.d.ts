import { AutoCompleteResponse, CommandResponse, FileSystem } from '../index';
/**
 * Given a path, removes the object at that location if possible. Rejects if
 * the parameters aren't correct for the given item
 *
 * @param fileSystem {object} - filesystem to act upon
 * @param currentPath {string} - current path within filesystem
 * @param folderPath  {string} - path of object to remove
 * @returns Promise<object> - resolves if rm was successful, rejects if not
 */
declare function rm(fileSystem: FileSystem, currentPath: string, targetPath: string, options?: string): Promise<CommandResponse>;
/**
 * Given a fileysystem, current path, and target, list the items in the desired
 * folder that start with target string
 *
 * @param fileSystem {object} - filesystem to ls upon
 * @param currentPath {string} - current path within filesystem
 * @param target {string} - string to match against (maybe be path)
 * @returns Promise<object> - resolves with contents that match target in path
 */
declare function rmAutoComplete(fileSystem: FileSystem, currentPath: string, target: string): Promise<AutoCompleteResponse>;
declare const _default: {
    autoCompleteHandler: typeof rmAutoComplete;
    description: string;
    handler: typeof rm;
};
export default _default;
