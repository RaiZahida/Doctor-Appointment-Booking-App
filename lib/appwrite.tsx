import { Account, Client, Databases, ID , Query} from 'react-native-appwrite';

// Load env variables
const API_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;

const client = new Client()
  .setEndpoint(API_ENDPOINT)
  .setProject(PROJECT_ID);

// Services
export const account = new Account(client);
export const databases = new Databases(client);
// export const storage = new Storage(client);
export default client;
export { ID };
export {Query};
