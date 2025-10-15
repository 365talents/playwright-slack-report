import { z } from 'zod';
import { LogLevel } from '@slack/web-api';
export declare const ZodCliSchema: z.ZodObject<{
    sendResults: z.ZodEnum<{
        always: "always";
        "on-failure": "on-failure";
    }>;
    sendUsingBot: z.ZodOptional<z.ZodObject<{
        channels: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
    sendUsingWebhook: z.ZodOptional<z.ZodObject<{
        webhookUrl: z.ZodString;
    }, z.core.$strip>>;
    customLayout: z.ZodOptional<z.ZodObject<{
        functionName: z.ZodString;
        source: z.ZodString;
    }, z.core.$strip>>;
    customLayoutAsync: z.ZodOptional<z.ZodObject<{
        functionName: z.ZodString;
        source: z.ZodString;
    }, z.core.$strip>>;
    slackLogLevel: z.ZodEnum<typeof LogLevel>;
    maxNumberOfFailures: z.ZodDefault<z.ZodNumber>;
    disableUnfurl: z.ZodDefault<z.ZodBoolean>;
    showInThread: z.ZodDefault<z.ZodBoolean>;
    proxy: z.ZodOptional<z.ZodString>;
    meta: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>>;
    sendCustomBlocksInThreadAfterIndex: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export interface ICliConfig {
    sendResults: 'always' | 'on-failure';
    sendUsingBot?: {
        channels: string[];
    };
    sendUsingWebhook?: {
        webhookUrl: string;
    };
    slackLogLevel: LogLevel;
    customLayout?: {
        functionName: string;
        source: string;
    };
    customLayoutAsync?: {
        functionName: string;
        source: string;
    };
    maxNumberOfFailures: number;
    disableUnfurl: boolean;
    showInThread: boolean;
    proxy?: string;
    meta?: Array<{
        key: string;
        value: string;
    }>;
    sendCustomBlocksInThreadAfterIndex?: number;
}
