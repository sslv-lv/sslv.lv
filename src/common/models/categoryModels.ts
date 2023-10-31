export class Category {
  constructor(props = {}) {
      Object.assign(this, props);
  }

  id!: string;
  name!: string;
  iconUrl!: string;
  subcategories!: Array<{}>;
  createdAt!: string;
  deletedAt!: string;
}
