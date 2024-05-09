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