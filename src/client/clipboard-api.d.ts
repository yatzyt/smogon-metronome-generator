interface Clipboard {
    writeText(text: string): Promise<void>;
}

interface Navigator {
    readonly clipboard: Clipboard;
}

interface WorkerNavigator {
    clipboard?: Clipboard;
}