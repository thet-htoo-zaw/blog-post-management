export interface Comment {
    content: string;
    authorId: number;
    createdAt: string;
}

export interface Post {
    id?: number;
    title: string;
    content: string;
    authorId: number;
    createdAt?: string;
    likes?: number;
    likedBy?: number[];
    comments?: Comment[];
    authorName?: string; 
}