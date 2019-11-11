export default class Timeout {
    private _delay?;
    private _promise;
    private _resolve;
    private _timeoutToken?;
    constructor(_delay?: number | undefined);
    onComplete(callback: () => void): void;
    complete(): void;
    start(): void;
}
