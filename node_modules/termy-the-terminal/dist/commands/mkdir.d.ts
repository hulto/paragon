import { AutoCompleteResponse, CommandResponse, FileSystem } from '../index';
/**
 * Given a folder path, creates that folder for the given file system and
 * returns the new file system if valid. If not, rejects with error.
 *
 * @param fileSystem {object} - filesystem to mkdir upon
 * @param currentPath {string} - current path within filesystem
 * @param folderPath  {string} - folder path to create
 * @returns Promise<object> - resolves with new path created if successful, rejects if not
 */
declare function mkdir(fileSystem: FileSystem, currentPath: string, folderPath: string): Promise<CommandResponse>;
/**
 * Given a fileysystem, current path, and target, list the items in the desired
 * folder that start with target string
 *
 * @param fileSystem {object} - filesystem to ls upon
 * @param currentPath {string} - current path within filesystem
 * @param target {string} - string to match against (maybe be path)
 * @returns Promise<object> - resolves with contents that match target in path
 */
declare function mkdirAutoComplete(fileSystem: FileSystem, currentPath: string, target: string): Promise<AutoCompleteResponse>;
declare const _default: {
    autoCompleteHandler: typeof mkdirAutoComplete;
    description: string;
    handler: typeof mkdir;
};
export default _default;
