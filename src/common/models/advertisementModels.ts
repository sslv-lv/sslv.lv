export class Advertisement {
  constructor(props = {}) {
      Object.assign(this, props);
  }

  id!: number;
  categoryId!: number;
  userId!: number;
  title!: string;
  price!: number;
  createdAt!: string;
  deletedAt!: string;
}
