/**
 * The global command-line options.
 */
export interface GlobalCLIOptions {
    /**
     * Whether to log verbosely.
     */
    verbose: boolean;

    /**
     * The maximum number of parallel connections to use during operations.
     *
     * Defaults to `3`.
     */
    maxConnections: number;

    /**
     * The timeout for network requests, in milliseconds.
     *
     * Defaults to `10000`.
     */
    timeout: number;

    /**
     * The API key to use when connecting to the CurseForge API.
     */
    curseForgeAPIKey?: string | undefined;

    /**
     * A custom user agent to use when making network requests.
     */
    userAgent?: string | undefined;
}

/**
 * An enumeration of known types of art assets.
 */
export enum ArtType {
    /**
     * The splash/banner image for a modpack.
     */
    Splash = 'splash',

    /**
     * The square icon/logo for a modpack.
     */
    Square = 'square',

    /**
     * Misc. media for the modpack.
     */
    Media = 'media'
}

/**
 * Data about an art asset.
 */
export interface Art {
    /**
     * The ID of the art.
     */
    id: number;

    /**
     * The size of the art, in bytes.
     */
    size: number;

    /**
     * Whether the art is compressed.
     */
    compressed: boolean;

    /**
     * The type of the art.
     */
    type: ArtType;

    /**
     * The location the art can be downloaded from.
     */
    url: string;

    /**
     * A list of mirror URLs in case the main URL is not available.
     */
    mirrors: string[];

    /**
     * The SHA1 hash of the file.
     */
    sha1: string;

    /**
     * The width of the art, in pixels.
     */
    width: number;

    /**
     * The height of the art, in pixels.
     */
    height: number;

    /**
     * The timestamp at which the art was last updated.
     */
    updated: number;
}

/**
 * An enumeration of known types of links.
 */
export enum LinkType {
    /**
     * A link to a presskit.
     */
    Presskit = 'presskit'
}

/**
 * Data about a link associated to a modpack.
 */
export interface Link {
    /**
     * The ID of the link.
     */
    id: number;

    /**
     * The name of the link.
     */
    name: string;

    /**
     * The URL of the link.
     */
    link: string;

    /**
     * The type of the link.
     */
    type: LinkType;
}

/**
 * An enumeration of known types of authors.
 */
export enum AuthorType {
    /**
     * The author is a team of people.
     */
    Team = 'team'
}

/**
 * The author of a modpack.
 */
export interface Author {
    /**
     * The ID of the author.
     */
    id: number;

    /**
     * The name of the author.
     */
    name: string;

    /**
     * The website of the author.
     */
    website: string;

    /**
     * The type of the author.
     */
    type: AuthorType;

    /**
     * The timestamp at which the author was last updated.
     */
    updated: number;
}

/**
 * A tag applied to some content.
 */
export interface Tag {
    /**
     * The ID of the tag.
     */
    id: number;

    /**
     * The name of the tag.
     */
    name: string;
}

/**
 * Information about the rating of some content.
 */
export interface Rating {
    /**
     * The ID of the rating.
     */
    id: number;

    /**
     * Unknown field.
     *
     * TODO: Figure out what this field is.
     */
    configured: boolean;

    /**
     * Whether this rating has been verified.
     */
    verified: boolean;

    /**
     * The suggested minimum age for the content.
     */
    age: number;

    /**
     * Whether the content contains gambling or references to it.
     */
    gambling: boolean;

    /**
     * Whether the content contains potentially frightening aspects.
     */
    frightening: boolean;

    /**
     * Whether the content contains alcohol/drug references.
     */
    alcoholdrugs: boolean;

    /**
     * Whether the content contains nudity or sexual aspects.
     */
    nuditysexual: boolean;

    /**
     * Whether the content contains strong stereotypes or hateful content about
     * a group.
     */
    stereotypehate: boolean;

    /**
     * Whether the content contains strong language.
     */
    language: boolean;

    /**
     * Whether the content contains violence.
     */
    violence: boolean;
}

/**
 * An enumeration of known modpack status types.
 */
export enum ModpackType {
    /**
     * The modpack is a release.
     */
    Release = 'release'
}

/**
 * An enumeration of known modpack providers.
 */
export enum ModpackProvider {
    /**
     * The Feed the Beast provider.
     */
    FeedTheBeast = 'modpacks.ch'
}

/**
 * An enumeration of possible response status.
 */
export enum ResponseStatus {
    /**
     * The response was a success.
     */
    Success = 'success'
}

/**
 * Data about a modpack.
 */
export interface ModpackManifest {
    /**
     * The ID of the modpack.
     */
    id: number;

    /**
     * The name of the modpack.
     */
    name: string;

    /**
     * A short description of the modpack.
     */
    synopsis: string;

    /**
     * A description of the modpack.
     */
    description: string;

    /**
     * A list of art associated with the modpack.
     */
    art: Art[];

    /**
     * a list of links associated with the modpack.
     */
    links: Link[];

    /**
     * A list of authors of the modpack.
     */
    authors: Author[];

    /**
     * A list of versions of the modpack.
     */
    versions: MinimalVersionManifest[];

    /**
     * The number of times the modpack has been installed.
     */
    installs: number;

    /**
     * The number of times the modpack has been played.
     */
    plays: number;

    /**
     * A list of tags associated with the modpack.
     */
    tags: Tag[];

    /**
     * Whether the modpack is featured.
     */
    featured: boolean;

    /**
     * The timestamp at which this data was refreshed.
     */
    refreshed: number;

    /**
     * Unknown field.
     *
     * TODO: Figure out this field's purpose.
     */
    notification: string;

    /**
     * The rating data about the modpack.
     */
    rating: Rating;

    /**
     * The response status.
     */
    status: ResponseStatus;

    /**
     * The timestamp of when the modpack was released.
     */
    released: number;

    /**
     * The source of the modpack.
     */
    provider: ModpackProvider;

    /**
     * The number of plays of the modpack in the last fourteen days.
     */
    plays_14d: number;

    /**
     * The type of the modpack status.
     */
    type: ModpackType;

    /**
     * When the modpack was last updated.
     */
    updated: number;

    /**
     * Whether the modpack is private.
     */
    private: boolean;
}

/**
 * Data about recommended specifications for running a modpack version.
 */
export interface Specs {
    /**
     * The ID of the specs.
     */
    id: number;

    /**
     * The minimum recommended amount of RAM, in megabytes.
     */
    minimum: number;

    /**
     * The recommended amount of RAM, in megabytes.
     */
    recommended: number;
}

/**
 * An enumeration of known types of targets.
 */
export enum TargetType {
    /**
     * The target game.
     */
    Game = 'game',

    /**
     * The target modloader.
     */
    Modloader = 'modloader',

    /**
     * The target runtime.
     */
    Runtime = 'runtime'
}

/**
 * Data about a target for a modpack.
 */
export interface Target {
    /**
     * The ID of the target.
     */
    id: number;

    /**
     * The name of the target.
     */
    name: string;

    /**
     * The type of the target.
     */
    type: TargetType;

    /**
     * The version of the target required.
     */
    version: string;

    /**
     * The timestamp at which the target was updated.
     */
    updated: number;
}

/**
 * An enumeration of known modpack ver
 */
export enum VersionType {
    Release = 'release'
}

/**
 * A minimal set of data about a version of a modpack.
 *
 * Mainly used when fetching a modpack manifest.
 */
export interface MinimalVersionManifest {
    /**
     * The ID of the modpack version.
     */
    id: number;

    /**
     * The name of the modpack version.
     */
    name: string;

    /**
     * The suggested specs for the version of the modpack.
     */
    specs: Specs;

    /**
     * The required targets for the version of the modpack.
     */
    targets: Target[];

    /**
     * The status of the modpack version.
     */
    type: VersionType;

    /**
     * Whether the modpack version is private.
     */
    private: boolean;
}

/**
 * A manifest of a modpack version.
 */
export interface ModpackVersionManifest extends MinimalVersionManifest {
    /**
     * The number of times the modpack version has been installed.
     */
    installs: number;

    /**
     * The number of times the modpack version has been played.
     */
    plays: number;

    /**
     * The timestamp at which this data was refreshed.
     */
    refreshed: number;

    /**
     * A URL to the changelog for the modpack version.
     */
    changelog: string;

    /**
     * The ID of the parent modpack.
     */
    parent: number;

    /**
     * Unknown field.
     *
     * TODO: Figure out this field's purpose.
     */
    notification: string;

    /**
     * a list of links associated with the modpack version.
     */
    links: Link[];

    /**
     * The response status.
     */
    status: ResponseStatus;

    /**
     * When the modpack version was last updated.
     */
    updated: number;
}
