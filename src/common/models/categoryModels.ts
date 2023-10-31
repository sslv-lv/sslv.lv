export class Category {
  constructor(props = {}) {
      Object.assign(this, props);
  }

  id!: string;
  name!: string;
  iconUrl!: string;
  subcategories!: {name: string}[];
  createdAt!: string;
  deletedAt!: string;
}
