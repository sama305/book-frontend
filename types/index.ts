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
    likecount: number,
    isliked: boolean
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
    isliked: boolean
    likecount: number
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
    join_date: string,
    followercount: number,
    followingcount: number
    isfollowing: boolean,
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

/* /review/[reviewid]/stats */
export interface GetReviewStatsRes {
    commentcount: number
}

/* /review/[reviewid]/comments */
export interface CommentInfo {
    content: string,
    username: string,
    commentid: string,
    reviewid: string,
    post_date: string,
    likecount: number,
    isliked: boolean
}

export type GetReviewCommentsRes = Array<CommentInfo>

export interface PostReviewCommentReq {
    content: string,
}

/* /user/[username]/reviews */
export type GetUserReviewsRes = Array<{
    username: string
    volumeid: string
    reviewid: string
    content: string
    rating: number
    post_date: string,
    likecount: number,
    isliked: boolean
}>

/* /user/[username]/reviews/stats */
export interface GetUserReviewsStatsRes {
    avgrating: number,
    reviewcount: number
}

/* /user/[username]/description */
export interface PatchDescReq {
    description: string
}

/* /user/[username]/following */
export type GetUserFollowingRes = Array<{
    username: string,
    isfollowing: boolean
}>

/* /user/[username]/followers */
export type GetUserFollowersRes = GetUserFollowingRes

/* /volume/[volumeid] */
export interface GetVolumeRes {
    authors: Array<string>,
    title: string,
    cover: string,
    pageCount: string,
    publishedYear: string,
    description: string
}

/* /volume/[volumeid]/stats */
export interface GetVolumeStatsRes {
    avgrating: number,
    reviewcount: number,
}

/* /volume/[volumeid]/reviews */
export type GetVolumeReviewsRes = GetUserReviewsRes


export interface HashTable<T> {
    [key: string]: T;
}