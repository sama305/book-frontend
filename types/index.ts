export interface UserCredentials {
    username: string,
    password: string,
    email: string,
};

export interface SignupRes {
    token: string,
}

export interface BookSearchInfo {
    key: string,
    author_key: string,
    author_name: string,
    first_publish_year: string,
    title: string,
    cover_edition_key: string,
    cover_i: string
}