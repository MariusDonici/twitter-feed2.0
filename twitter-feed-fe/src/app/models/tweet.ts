export interface Tweet {
    id: String;
    user: {
        name: String
        location: String
        email: String
        followersCount: number
        profileBackgroundImageUrlHttps: String
        lang: String
        friendsCount: number
    };
    geoLocation: {
        latitude: number
        longitude: number
    };
    isRetweet: Boolean;
    language: String;
    tweetText: String;
    source: String;
    createdAt: String;

}
