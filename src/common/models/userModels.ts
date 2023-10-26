export class User {
    constructor(props = {}) {
        Object.assign(this, props);
    }

    id!: number;
    name!: string;
    email!: string;
    password!: string;
    isAdmin!: boolean;
    createdAt!: string;
    deletedAt!: string;
}