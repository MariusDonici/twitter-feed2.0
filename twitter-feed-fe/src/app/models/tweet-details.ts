import { UserDetails } from "./user-details";

export class TweetDetails {
    user: UserDetails;
    isRetweet: Boolean;
    language: string;
    tweetText: String;
    source: String;
    createdAt: String;
}
