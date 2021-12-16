import { CommandResponse, FileSystem, AutoCompleteResponse } from '../index';
/**
 * Given a fileysystem, lists all items for a given directory
 *
 * @param fileSystem {object} - filesystem to ls upon
 * @param currentPath {string} - current path within filesystem
 * @param targetPath {string} - path to list contents within
 * @returns Promise<object> - resolves with contents of given path
 */
declare function ls(fileSystem: FileSystem, currentPath: string, targetPath?: string): Promise<CommandResponse>;
/**
 * Given a fileysystem, current path, and target, list the items in the desired
 * folder that start with target string
 *
 * @param fileSystem {object} - filesystem to ls upon
 * @param currentPath {string} - current path within filesystem
 * @param target {string} - string to match against (maybe be path)
 * @returns Promise<object> - resolves with contents that match target in path
 */
declare function lsAutoComplete(fileSystem: FileSystem, currentPath: string, target: string): Promise<AutoCompleteResponse>;
declare const _default: {
    autoCompleteHandler: typeof lsAutoComplete;
    description: string;
    handler: typeof ls;
};
export default _default;
