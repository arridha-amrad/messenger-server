import mongoose from 'mongoose';
import { config, ENV_ENUM } from './config';

export const connectToDB = async (): Promise<void> => {
    try {
        const env = config.NODE_ENV;
        let url: string;

        switch (env) {
            case ENV_ENUM.dev:
                url = config.DEV_DB_URL;
                break;
            case ENV_ENUM.test:
                url = config.TEST_DB_URL;
                break;
            default:
                url = config.PROD_DB_URL;
                break;
        }

        await mongoose.connect(url);

        console.log('connected to mongoDB');
    } catch (err) {
        process.exit(1);
    }
};

export const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
    } catch (err) {
        process.exit(1);
    }
};
