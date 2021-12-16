import { FileSystem, ItemListType } from '../../index';
/**
 * Takes a valid Unix path and converts it into a format
 * that matches the internal data structure. Including replacing "/"
 * with ".children" and removing leading slash
 *
 * usr/home/test becomes usr.children.home.children.test
 *
 * @param {string} pathStr - path string to convert
 * @returns {string} - converted string
 */
export declare function convertPathToInternalFormat(pathStr: string): string;
/**
 * Takes a unix path that may contain ".." and return a new
 * string that respects the ".." path segments i.e.
 * /home/user/.. => /home
 *
 * @param pathStr {string} - unix-formatted path
 * @returns {string} - new path after taking ".." into account
 */
export declare function handleDotDotInPath(pathStr: string): string;
/**
 * Takes an path formatted for internal use and converts it to an
 * external format. i.e.
 * home.children.user => /home/user
 *
 * @param pathStr {string} - internally formatted path
 * @returns {string} - path string formatted for terminal use
 */
export declare function convertInternalPathToExternal(pathStr: string): string;
/**
 * Takes a file path (externally formatted) and trims the file extension from it i.e.
 * /path/to/file.txt => /path/to/file
 * file.txt => file
 *
 * @param filePath {string} - filePath to trim extension from
 * @returns {string} - file path without file extension
 */
export declare function stripFileExtension(filePath: string): string;
/**
 * Takes a current path and a target path, and calculates the combined path and
 * returns it in internal format. If target path is absolute, currentPath is ignored.
 *
 * @param currentPath {string} - current path in system
 * @param targetPath {string} - target path in system
 */
export declare function getInternalPath(currentPath: string, targetPath: string): string;
/**
 * Checks if a file extension is a valid image file extension
 *
 * @param extension {string} - file extension to check
 * @returns {boolean} - whether or not file is image extension
 */
export declare function isImageExtension(extension: string): boolean;
declare type ParsedCommand = {
    commandName: string;
    commandOptions: string[];
    commandTargets: string[];
};
/**
 * Parses a given string into the command name, the options (specified with leading "-"),
 * and the command targets
 *
 * @param command - input string to parse
 * @returns {object} - the parsed command
 */
export declare function parseCommand(command: string): ParsedCommand;
/**
 * Given a filesystem and current path, return the target item from the
 * filesystem for a given garget path if it exists, or throw an error if
 * it doesn't.
 *
 * @param fileSystem {object} - Filesystem to search
 * @param currentPath {string} - Curernt path in filesystem
 * @param targetPath {string} - Path to target
 * @return {object} - Internal formatted filesystem from target
 */
export declare function getTarget(fileSystem: FileSystem, currentPath: string, targetPath: string): FileSystem;
/**
 * Takes an internally formatted filesystem and formats it into an
 * an item list.
 *
 * @param fileSystem {object} - internally formatted filesystem
 * @returns {object} - fomratted list of files/folders
 */
export declare function buildItemList(fileSystem: FileSystem): ItemListType;
export {};
