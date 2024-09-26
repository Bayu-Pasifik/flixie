export type Reviews = {
    author:         string;
    author_details: AuthorDetails;
    content:        string;
    created_at:     Date;
    id:             string;
    updated_at:     Date;
    url:            string;
}

export type AuthorDetails = {
    name:        string;
    username:    string;
    avatar_path: null;
    rating:      null;
}
