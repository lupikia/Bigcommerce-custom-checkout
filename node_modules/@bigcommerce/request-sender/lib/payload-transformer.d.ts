import RequestOptions from './request-options';
import Response from './response';
export default class PayloadTransformer {
    toRequestBody(options: RequestOptions): any;
    toResponse(xhr: XMLHttpRequest): Response;
    private _parseResponseBody;
    private _parseResponseHeaders;
    private _getHeader;
}
