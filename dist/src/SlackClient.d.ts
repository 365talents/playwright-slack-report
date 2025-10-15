import { WebClient, KnownBlock, Block, ChatPostMessageResponse, LogLevel } from '@slack/web-api';
import { SummaryResults } from '.';
export type additionalInfo = Array<{
    key: string;
    value: string;
}>;
export default class SlackClient {
    private slackWebClient;
    private static readonly MAX_BLOCKS_PER_MESSAGE;
    constructor(slackClient: WebClient);
    private static chunkBlocks;
    sendMessage({ options, }: {
        options: {
            channelIds: Array<string>;
            customLayout: Function | undefined;
            customLayoutAsync: Function | undefined;
            fakeRequest?: Function;
            maxNumberOfFailures: number;
            slackOAuthToken?: string;
            slackLogLevel?: LogLevel;
            disableUnfurl?: boolean;
            summaryResults: SummaryResults;
            showInThread: boolean;
            sendCustomBlocksInThreadAfterIndex?: number;
        };
    }): Promise<Array<{
        channel: string;
        outcome: string;
        ts: string;
    }>>;
    attachDetailsToThread({ channelIds, ts, summaryResults, maxNumberOfFailures, disableUnfurl, fakeRequest, }: {
        channelIds: Array<string>;
        ts: string;
        summaryResults: SummaryResults;
        maxNumberOfFailures: number;
        disableUnfurl?: boolean;
        fakeRequest?: Function;
    }): Promise<any[]>;
    static doPostRequest(slackWebClient: WebClient, channel: string, fallbackText: string, blocks: Array<KnownBlock | Block>, unfurl: boolean, threadTimestamp?: string): Promise<ChatPostMessageResponse>;
}
