import RequestOptions from './request-options';
export default class RequestFactory {
    createRequest(url: string, options?: RequestOptions): XMLHttpRequest;
    private _configureRequest;
    private _configureRequestHeaders;
    private _formatUrl;
}
