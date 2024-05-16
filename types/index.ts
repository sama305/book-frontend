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
    volumeid: string,
    reviewid: string,
    post_date: string,
}

export interface ReviewView {
    username: string,
    volumeid: string,
    reviewid: string,
    content: string,
    rating: number,
    post_date: string,
    authors: Array<string>,
    title: string,
    cover: string,
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
    volumeid: string,
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

export interface PutReviewReq {
    content: string,
    rating: number
}

export interface PutReviewRes {
    status: number
}

/* /user/[username]/reviews */
export type GetUserReviewsRes = Array<{
    username: string
    volumeid: string
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

/* /volume/[volumeid] */
export interface GetVolumeRes {
    authors: Array<string>,
    title: string,
    cover: string,
    pageCount: string,
    publishedYear: string,
    description: string
}

/* /volume/[volumeid]/reviews */
export type GetVolumeReviewsRes = Array<GetUserReviewsRes>


export interface HashTable<T> {
    [key: string]: T;
}