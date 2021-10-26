export interface ClientBundleGenerator {
    getBundle(): Promise<string>;
};