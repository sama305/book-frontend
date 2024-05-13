export interface UserCredentials {
    username: string,
    password: string,
    email: string,
};

export interface BookSearchInfo {
    key: string,
    author_key: string,
    author_name: string,
    first_publish_year: string,
    title: string,
    cover_edition_key: string,
    cover_i: string
}

export interface GetReviewRes {
    content: string,
    rating: number,
    username: string,
    worksid: string,
    reviewid: string,
    post_date: string,
}

export interface ReviewView {
    username: string,
    worksid: string,
    reviewid: string,
    content: string,
    rating: number,
    post_date: string,
    authors: Array<string>,
    title: string,
    cover_i: string,
}


/* /login */
export interface LoginReq {
    username?: string,
    password?: string,
    email?: string,
    token?: string
}

export interface LoginRes {
    token: string,
}


/* /signup */
export interface SignupReq {
    username: string,
    password: string,
    email: string,
}

export interface SignupRes {
    token: string,
}


/* /user/[username] */
export interface GetUserRes {
    username: string,
    email: string,
    description: string,
    join_date: string
}


/* /review */
export interface PostReviewReq {
    content: string,
    rating: number,
    worksid: string,
}

export interface PostReviewRes {
    reviewid: string
}

/* /review/[reviewid] */
export interface GetReviewRes {
    content: string,
    username: string,
    rating: number
}

export interface DeleteReviewReq {
    token: string,
}

/* /user/[username]/reviews */
export type GetUserReviewsRes = Array<{
    username: string
    worksid: string
    reviewid: string
    content: string
    rating: number
    post_date: string
}>

/* /user/[username]/reviews/count */
export interface GetUserReviewsCount {
    count: number
}

/* /user/[username]/description */
export interface PatchDescReq {
    description: string
}

export interface HashTable<T> {
    [key: string]: T;
}