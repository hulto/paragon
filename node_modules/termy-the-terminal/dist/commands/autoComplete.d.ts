import { AutoCompleteResponse, FileSystem } from '../index';
import { ItemListType } from '../';
/**
 * Given a fileysystem, current path, and target, list the items in the desired
 * folder that start with target string
 *
 * @param fileSystem {object} - filesystem to ls upon
 * @param currentPath {string} - current path within filesystem
 * @param target {string} - string to match against (maybe be path)
 * @returns Promise<object> - resolves with contents that match target in path
 */
export default function autoComplete(fileSystem: FileSystem, currentPath: string, target: string, filterFn?: (item: ItemListType) => boolean): Promise<AutoCompleteResponse>;
